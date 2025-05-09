import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions, Image, Platform, StatusBar } from 'react-native';
import { Text, Searchbar, Card, Menu, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '../../utils/theme';
import { patientService } from '../../api/services/patientService';
import { COLORS, INPatientsData, OTPatientsData, OutPatienstData, User, user } from '../../utils/constants';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import mixpanel from '../../utils/mixpanel';
import { setDateRange } from '../../store/slices/authSlice';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;
const { width, height } = Dimensions.get('window');

// Update the color palette to use primary color variations

// Update the DoctorTypeCard component for a more compact design
const DoctorTypeCard = ({ icon, title, count, color, length }) => (

  <TouchableOpacity
    style={[styles.statCard, {
      backgroundColor: '#FFFFFF',
      borderColor: title!=='Surgeries' ?'#eee':'#fff',
      // flexDirection: length > 1 ? 'column' : 'row',
      flexDirection: 'column',

    }]}
  >
    <View style={styles.statCardContent}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={color}
        />
      </View>
      {/* <View style={styles.statTextContainer}> */}
      <Text style={styles.statCount}>{count}</Text>

    </View>

    {/* <Text style={[styles.statTitle, { marginTop: length > 1 ? 0 : 10, paddingLeft: length > 1 ? 0 : 10 }]}>{title}</Text> */}
    <Text style={styles.statTitle}>{title}</Text>

    {/* </View> */}

  </TouchableOpacity>
);

// Add this new component for the progress bar
const ProgressBar = ({ current, total }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressTextContainer}>
      {/* <Text style={styles.progressText}>Today's Patient Visits</Text> */}
      {/* <Text style={styles.progressCount}>{current}/{total}</Text> */}
    </View>
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${(current / total) * 100}%` }]} />
    </View>
    <Text style={styles.progressText}>Remaining: {total - current}</Text>

  </View>
);



export default function HomeScreen({ navigation }) {
  // const [dateRange, setDateRange] = useState(new Date());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [outPatients, setOutPatients] = useState([]);
  const [inPatients, setInPatients] = useState([]);
  const [otPatients, setOtPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.auth.user);
  const dateRange = useSelector(state=>state.auth.dateRange)
  const dispatch = useDispatch();
  // const user = User
  const doctorId = user?.['Doctor Id'];
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(user.DocBranch[0].BranchName);




  useEffect(() => {
    const fetchInPatients = async () => {
      setLoading(true);
      try {
        const inPatientsData = await patientService.getInPatients(doctorId);
        setInPatients(inPatientsData);
        const OutPatientsData = await patientService.getOutPatients(doctorId);
        setOutPatients(OutPatientsData);
        const OtPatientsData = await patientService.getOTPatients(doctorId);
        setOtPatients(OtPatientsData)
      } catch (err) {
        setError(err.message);
        console.error('Error fetching in-patients:', err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchInPatients();
    }
  }, [doctorId]);



  // Add this function back for week days generation

  const generateWeekDays = () => {
    const days = [];
    const startDate = new Date(dateRange);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    for (let i = 0; i < 7; i++) {
      const date = new Date(dateRange);
      date.setDate(startDate.getDate() + i);

      const dateString = moment(date).format('DD-MM-YYYY');
      const hasOutPatientAppts = OutPatienstData.some(patient =>
        patient.Appointment_Date === dateString
      );

      const hasInPatientAppts = INPatientsData.some(patient =>
        patient.AdmissionDate.replaceAll('/', '-') === dateString
      );
      const hasAppts = hasOutPatientAppts || hasInPatientAppts;
      days.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: dateString,
        isSelected: date.toDateString() === dateRange.toDateString(),
        hasAppointments: hasAppts,
        isToday: date.toDateString() === new Date().toDateString(),
        isBeyondThreeMonths: date > threeMonthsFromNow
      });
    }
    return days;
  };

  // Add this function for week navigation
  const handleWeekChange = (direction) => {
    const newDate = new Date(dateRange);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    if (direction === 'next') {
      // Check if next date would be beyond 3 months
      const nextDate = new Date(newDate);
      nextDate.setDate(nextDate.getDate() + 1);
      if (nextDate <= threeMonthsFromNow) {
        newDate.setDate(newDate.getDate() + 1);
       dispatch(setDateRange(newDate));
      }
    } else {
      newDate.setDate(newDate.getDate() - 1);
     dispatch(setDateRange(newDate));
    }
  };



  const showDatePicker = () => {
    setDatePickerVisible(true);
    mixpanel.track('Date Picker Opened', user)
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    mixpanel.track('Date Picker Closed', user)
  };

  const handleConfirm = (date) => {
    dispatch(setDateRange(date))
    hideDatePicker();
    mixpanel.track('Date Picker Confirmed', user)
  };

  // Function to get the label for the selected date
  const getSelectedDateLabel = () => {
    const today = moment();
    const selected = moment(dateRange);
    if (selected.isSame(today, 'day')) {
      return 'Today';
    } else if (selected.isSame(today.clone().add(1, 'days'), 'day')) {
      return 'Tomorrow';
    } else {
      return selected.format('ddd, DD');
    }
  };

  const renderDoctorTypeCards = () => {
    const cards = [];

    // Get selected date in YYYY-MM-DD format from dateRange
    const selectedDate = moment(dateRange).format('DD-MM-YYYY')

    // Filter OutPatienstData for selected date appointments
    const selectedDateOutPatients = OutPatienstData.filter(patient =>
      patient.Appointment_Date === selectedDate
    );
    const selectedInPatients = INPatientsData.filter(patient =>
      patient.AdmissionDate.replaceAll('/', '-') === selectedDate
    );


    const selectedotPatients = OTPatientsData.filter(patient =>
      patient.SurgeryDate === selectedDateString
    );
    console.log(selectedotPatients)
    if (selectedDateOutPatients.length > 0) {
      cards.push(
        // <View style={styles.cardProgressContainer}>
        <DoctorTypeCard
          key="outpatients"
          icon="account-group"
          title="Out Patients"
          count={selectedDateOutPatients.length.toString()}
          color={COLORS.primary}
          length={cards.length}
        />
        // <ProgressBar
        //   current={selectedDateOutPatients.length.toString()}
        //   total={selectedDateOutPatients.length.toString()}
        // />
        // </View>
      );
    }

    if (selectedInPatients.length > 0) {
      cards.push(
        <DoctorTypeCard
          key="inpatients"
          icon="bed"
          title="In Patients"
          count={selectedInPatients.length.toString()}
          color={COLORS.primary}
          length={cards.length}
        />
      );
    }

    if (selectedotPatients.length > 0) {
      cards.push(
        <DoctorTypeCard
          key="otpatients"
          icon="medical-bag"
          title="Surgeries"
          count={selectedotPatients.length.toString()}
          color={COLORS.primary}
        />
      );
    }
    return (
      // <View style={cards.length > 1 ? styles.cardsContainer : styles.lastCardContainer}>
      //   {cards.map((card, index) => (
      //     <View
      //       key={index}
      //       style={[
      //         styles.cardWrapper,
      //         index === cards.length - 1 && styles.lastCard
      //       ]}
      //     >
      //       {card}
      //     </View>
      //   ))}
      // </View>
      <View style={styles.cardsContainer}>
           <DoctorTypeCard
          key="outpatients"
          icon="account-group"
          title="Out Patients"
          count={selectedDateOutPatients.length.toString()}
          color={COLORS.primary}
          length={cards.length}
        />
              <DoctorTypeCard
          key="inpatients"
          icon="bed"
          title="In Patients"
          count={selectedInPatients.length.toString()}
          color={COLORS.primary}
          length={cards.length}
        />
      <DoctorTypeCard
          key="otpatients"
          icon="medical-bag"
          title="Surgeries"
          count={selectedotPatients.length.toString()}
          color={COLORS.primary}
        />
    </View>
    );
  };

  // Update the renderCalendarSection
  const renderCalendarSection = () => {
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    const nextDate = new Date(dateRange);
    nextDate.setDate(nextDate.getDate() + 1);
    const isNextDisabled = nextDate > threeMonthsFromNow;

    return (
      <View style={styles.dateSection}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={showDatePicker}
        >
          <View style={styles.dateDisplay}>
            <MaterialCommunityIcons name="calendar-month" size={24} color={theme.colors.primary} />
            <Text style={styles.selectedDateText}>
              {moment(dateRange).format('MMMM YYYY')}
            </Text>
          </View>
          <View style={styles.weekNavigation}>
            <TouchableOpacity
              style={[styles.navigationButton, { opacity: 1 }]}
              onPress={() => handleWeekChange('prev')}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <Text style={styles.selectedDayLabel}>
              {getSelectedDateLabel()}
            </Text>
            <TouchableOpacity
              style={[styles.navigationButton, { opacity: isNextDisabled ? 0.5 : 1 }]}
              onPress={() => !isNextDisabled && handleWeekChange('next')}
              disabled={isNextDisabled}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScrollView}
          contentContainerStyle={styles.dateScrollContent}
        >
          {generateWeekDays().map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                item.isSelected && styles.selectedDateItem,
                item.isToday && styles.todayDateItem,
                item.isBeyondThreeMonths && { opacity: 0.5 }
              ]}
              onPress={() => {
                if (!item.isBeyondThreeMonths) {
                  const newDate = new Date(dateRange);
                  newDate.setDate(item.date);
                 dispatch(setDateRange(newDate));
                }
              }}
              disabled={item.isBeyondThreeMonths}
            >
              <Text style={[
                styles.dayText,
                item.isSelected && styles.selectedDayText,
                item.isToday && styles.todayText
              ]}>
                {item.day}
              </Text>
              <View style={[
                styles.dateNumber,
                item.isSelected && styles.selectedDateNumber,
                item.isToday && styles.todayDateNumber
              ]}>
                <Text style={[
                  styles.dateNumberText,
                  (item.isSelected || item.isToday) && styles.selectedDateNumberText,
                  item.isToday && !item.isSelected && styles.todayDateNumberText
                ]}>
                  {item.date}
                </Text>
              </View>
              {item.hasAppointments && !item.isBeyondThreeMonths && (
                <View style={[
                  styles.appointmentDot,
                  (item.isSelected || item.isToday) && styles.selectedAppointmentDot
                ]} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={dateRange}
          maximumDate={moment().add(3, 'months').toDate()}
        />
      </View>
    );
  };

  const selectedDateString = moment(dateRange).format('DD-MM-YYYY');

  const filteredOutPatients = OutPatienstData.sort((a, b) => a.Appointment_Time.localeCompare(b.Appointment_Time)).filter(appointment =>
    appointment.Appointment_Date === selectedDateString && appointment.PATIENT_NAME.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInPatients = INPatientsData.filter(patient =>
    patient.AdmissionDate.replaceAll('/', '-') === selectedDateString && patient.PatientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOtPatients = OTPatientsData.filter(patient =>
    patient.SurgeryDate === selectedDateString
  );

  // console.log(inPatients)

  // Update the Upcoming section to include inPatients and otPatients
  const renderUpcomingAppointments = () => {


    return (
      <View>
        {/* Out Patients */}
        {filteredOutPatients.map((appointment, index) => (
          <Card key={`out-${index}`} style={styles.appointmentCard}>
            <Card.Content style={styles.appointmentContent}>
              <View style={styles.appointmentLeft}>
                <Text style={styles.appointmentName}>{appointment.PATIENT_NAME}</Text>
                <Text style={styles.appointmentDetails}>
                  {appointment.AGE} Years | {appointment.Sex} | {appointment.CASE_TYPE}
                </Text>
              </View>
              <View style={styles.appointmentRight}>
                <View style={styles.eventTypeContainer}>
                  {appointment.CASE_TYPE === 'Video Consult' ? (
                    <TouchableOpacity style={styles.videoButton}>
                      <MaterialCommunityIcons name="video" size={16} color="#fff" />
                      <Text style={styles.videoButtonText}>Video Consult</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.eventType}>OP Consultation</Text>
                  )}
                </View>
                <View style={styles.scheduleTag}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color="#666" />
                  {/* <Text style={styles.scheduleText}>Scheduled: {appointment.Appointment_Time}</Text> */}
                  <View style={styles.scheduleTextContainer}>  
                    <Text style={[styles.scheduleText,{color:'#0000ff'}]}>Scheduled:</Text>
                    <Text style={styles.scheduleText}>{appointment.Appointment_Time}</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* In Patients */}
        {filteredInPatients.map((patient, index) => (
          <Card key={`in-${index}`} style={styles.appointmentCard}>
            <Card.Content style={styles.appointmentContent}>
              <View style={styles.appointmentLeft}>
                <Text style={styles.appointmentName}>{patient.PatientName}</Text>
                <Text style={styles.appointmentDetails}>
                  {patient.Age} Years | {patient.Gender} | {patient.CaseType}
                </Text>
              </View>
              <View style={styles.appointmentRight}>
                <Text style={styles.eventType}>IP Rounds</Text>
                {/* <View style={styles.scheduleTag}>
                  <MaterialCommunityIcons name="calendar" size={14} color="#666" />
                  <Text style={styles.scheduleText}>Admitted: {patient.AdmissionDate}</Text>
                </View> */}
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* OT Patients */}
        {filteredOtPatients.map((patient, index) => (
          <Card key={`ot-${index}`} style={styles.appointmentCard}>
            <Card.Content style={styles.appointmentContent}>
              <View style={styles.appointmentLeft}>
                <Text style={styles.appointmentName}>{patient.PATIENT_NAME}</Text>
                <Text style={styles.appointmentDetails}>
                  {patient.AGE} | {patient.SEX} | {patient.SURGERY}
                </Text>
              </View>
              <View style={styles.appointmentRight}>
                <Text style={styles.eventType}>Surgery</Text>

                <View style={styles.scheduleTag}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color="#666" />

                  <View style={styles.scheduleTextContainer}>  
                    <Text style={[styles.scheduleText,{color:'#0000ff'}]}>Scheduled:</Text>
                    <Text style={styles.scheduleText}>7.00 PM</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  };
  useEffect(() => {
    (user['Doctor Id'], {
      ...user
    })
  })
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#962067" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          </View>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={styles.locationSelector}
                onPress={() => setMenuVisible(true)}
              >
                <MaterialCommunityIcons name="map-marker" size={20} color="#B4236C" />
                <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">{selectedLocation}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            }
            style={styles.menu}
          >
            {user.DocBranch.map((location, index) => (
              <React.Fragment key={index}>
                <Menu.Item
                  onPress={() => {
                    setSelectedLocation(location.BranchName);
                    setMenuVisible(false);
                    mixpanel.track('Location Selected', { location, user })
                  }}
                  title={location.BranchName}
                  titleStyle={[
                    styles.menuItemText,
                    selectedLocation === location.BranchName && styles.selectedMenuItemText
                  ]}
                />
                {index < user.DocBranch.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Menu>

          <TouchableOpacity onPress={() => mixpanel.track('Bell Clicked', user)}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome {user.DoctorName}</Text>
          {/* <Text style={styles.subText}>Let's take care of your patient's</Text> */}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search patients, appointments..."
            onChangeText={setSearchQuery}
            onSubmitEditing={() => mixpanel.track('Search Bar', { searchQuery, user })}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            placeholderTextColor="#999"
            icon={() => <MaterialCommunityIcons name="magnify" size={24} color="#962067" />}
            iconColor="#999"
          />
        </View>

        {/* Calendar Section */}
        {renderCalendarSection()}

        {/* Overview Section */}
        {filteredInPatients.length > 0 || filteredOutPatients.length > 0 || filteredOtPatients.length > 0 ? <View style={styles.overviewSection}>

          {renderDoctorTypeCards()}
        </View> : ''}

        {/* Upcoming Section */}
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {filteredInPatients.length > 0 || filteredOutPatients.length > 0 || filteredOtPatients.length > 0 ?
              <TouchableOpacity onPress={() => { [navigation.navigate('Schedule'), mixpanel.track('View All Schedule ', user)] }}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity> : ''}
          </View>
          {filteredInPatients.length > 0 || filteredOutPatients.length > 0 || filteredOtPatients.length > 0 ?
            renderUpcomingAppointments() : <View style={styles.noAppoinments}>
              <Image source={require('../../assets/images/noAppoinments.png')} />
              <Text style={styles.noAppoinmentsHeader}>Not Schedule Yet</Text>
              <Text style={styles.noAppoinmentsText}>You don't have any appoinments scheduled {'\n'} for {moment(dateRange).format('MMMM DD, YYYY') === moment().format('MMMM DD, YYYY') ? 'Today' : moment(dateRange).format('MMMM DD, YYYY')}</Text>
            </View>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height: Platform.OS === 'ios' ? height * 0.06 : height * 0.07,
  },
  logoContainer: {
    height: height * 0.04,
    justifyContent: 'center',
  },
  logo: {
    height: '100%',
    width: width * 0.25,
    resizeMode: 'contain',
  },
  welcomeSection: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    backgroundColor: '#fff',
    // marginBottom: height * 0.008,
  },
  welcomeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: Math.min(width * 0.046, 24),
    color: theme.colors.primary,
    marginBottom: height * 0.004,
  },
  subText: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.038, 16),
    color: '#666',
  },
  searchContainer: {
    backgroundColor: '#fff'
  },
  searchBar: {
    marginHorizontal: 15,
    // marginVertical: height * 0.008,
    backgroundColor: '#f7f7f7',
    elevation: 0,
    borderRadius: width * 0.02,
    height: height * 0.055,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.032, 16),
    color: '#333',
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    height: height * 0.055,
    alignSelf: 'center',
  },
  dateSection: {
    backgroundColor: '#fff',
    paddingVertical: height * 0.015,
    marginBottom: height * 0.008,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedDateText: {
    fontSize: width * 0.04,
    fontFamily: 'Poppins-Medium',
    color: theme.colors.primary,
  },
  todayText: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.primary,
  },
  overviewSection: {
    backgroundColor: '#fff',
    paddingVertical: height * 0.015,
    marginBottom: height * 0.01,

  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: Math.min(width * 0.040, 20),
    color: '#333',
  },
  viewAllText: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.032, 16),
    color: theme.colors.primary,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: width * 0.04,
    marginTop: height * 0.01,
  },
  lastCardContainer: {
    width: '100%',
    justifyContent: 'flex-start'
  },
  statCard: {
    width: width * 0.31,
    padding: width * 0.025,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: '#666',

  },
  statCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexDirection: 'row',

  },
  iconContainer: {
    padding: width * 0.02,
    borderRadius: 50,
    marginBottom: height * 0.008,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: width * 0.045,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statTitle: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Regular',
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  upcomingSection: {
    backgroundColor: '#fff',
    paddingTop: height * 0.02,
    paddingBottom: height * 0.01,
  },
  appointmentCard: {
    marginHorizontal: width * 0.04,
    marginBottom: height * 0.01,
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appointmentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: width * 0.03,
  },
  appointmentLeft: {
    flex: 1,
  },
  appointmentName: {
    fontFamily: 'Poppins-Medium',
    fontSize: Math.min(width * 0.038, 16),
    color: theme.colors.primary,
    marginBottom: height * 0.002,
  },
  appointmentDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.032, 14),
    color: '#666',
  },
  appointmentRight: {
    alignItems: 'flex-end',
    gap: height * 0.008,
  },
  eventTypeContainer: {
    marginBottom: height * 0.004,
  },
  eventType: {
    fontFamily: 'Poppins-Medium',
    fontSize: Math.min(width * 0.032, 14),
    fontWeight: 'bold',
    color: 'grey',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.004,
    borderRadius: width * 0.01,
    gap: width * 0.01,
  },
  videoButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: Math.min(width * 0.028, 12),
    color: '#fff',
  },
  scheduleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
  },
  scheduleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.028, 12),
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.015,
  },
  patientSection: {
    backgroundColor: '#fff',
    paddingTop: height * 0.02,
    paddingBottom: height * 0.01,
    marginTop: height * 0.01,
  },
  patientCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  patientName: {
    fontFamily: 'Poppins-Medium',
    fontSize: Math.min(width * 0.038, 16),
    color: '#2c3e50',
    marginBottom: 5,
  },
  progressContainer: {

    width: width * 1,
    paddingHorizontal: width * 0.04,


  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  progressText: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: COLORS.text.secondary,
    textAlign: 'right'
  },
  progressCount: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Medium',
    color: COLORS.primary,
  },
  progressBarContainer: {
    height: height * 0.012,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  cardWrapper: {
    borderRightWidth: 1,
    borderColor: '#eee',
  },
  lastCard: {
    borderRightWidth: 0,
  },
  dateScrollView: {
    marginTop: height * 0.015,
  },
  dateScrollContent: {
    paddingHorizontal: width * 0.04,
    paddingRight: width * 0.08,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.02,
    marginRight: width * 0.03,
    borderRadius: width * 0.02,
    minWidth: width * 0.12,
    position: 'relative',
  },
  selectedDateItem: {
    backgroundColor: '#fff',
  },
  todayDateItem: {
    backgroundColor: '#fff',
  },
  dayText: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.034, 14),
    color: '#666',
    marginBottom: height * 0.004,
  },
  selectedDayText: {
    color: '#666',
  },
  dateNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    marginBottom: height * 0.005


  },
  selectedDateNumber: {
    backgroundColor: theme.colors.primary,
  },
  todayDateNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: height * 0.005,
    borderColor: theme.colors.primary,
  },
  dateNumberText: {
    fontFamily: 'Poppins-Medium',
    fontSize: Math.min(width * 0.036, 16),
    color: '#666',
    marginTop: height * 0.005

  },
  selectedDateNumberText: {
    color: '#fff',
    marginTop: height * 0.005

  },
  todayDateNumberText: {
    color: '#666'
  },
  appointmentDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#666',
    position: 'absolute',
    bottom: 2,
    alignSelf: 'center',
  },
  selectedAppointmentDot: {
    backgroundColor: theme.colors.primary,

  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  selectedDayLabel: {
    fontSize: width * 0.04,
    fontFamily: 'Poppins-Medium',
    color: theme.colors.primary,
    marginHorizontal: 10,
  },
  noAppoinments: {
    alignItems: 'center',
  },
  noAppoinmentsHeader: {
    fontFamily: 'Poppins-Medium',
    fontSize: width * 0.05,
    color: '#962067',
    marginBottom: height * 0.01
  },
  noAppoinmentsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.035,
    color: COLORS.text.secondary,
    textAlign: 'center'
  },
  cardProgressContainer: {
    width: width * 0.45,

  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
    borderRadius: width * 0.02,
    gap: width * 0.01,
    width: width * 0.5
  },
  locationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: Math.min(width * 0.032, 14),
    color: '#333',
    width: width * 0.31,
    textAlign: 'center',


  },
  menu: {
    marginTop: height * 0.1,
  },
  menuItemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.032, 14),
    color: '#333',
  },
  selectedMenuItemText: {
    color: theme.colors.primary,
    fontFamily: 'Poppins-Medium',
  },
  scheduleTextContainer: {
    flexDirection: 'row',
    gap: 3
  }
}); 
