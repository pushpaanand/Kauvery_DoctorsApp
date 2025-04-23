import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Image, Platform, StatusBar } from 'react-native';
import { Text, Searchbar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../../utils/theme';
import { useSelector } from 'react-redux';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;
const { width, height } = Dimensions.get('window');

// Update the color palette to use primary color variations
const COLORS = {
  primary: '#962067',
  cardColors: {
    first: '#962067',
    second: '#962067',
    third: '#962067',
  },
  outPatient: '#4CAF50',
  inPatient: '#2196F3',
  surgery: '#FF5722',
  appointment: '#FF9800',
  background: '#F5F7FA',
  cardBg: '#FFFFFF',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999'
  }
};

// Update the DoctorTypeCard component for a more compact design
const DoctorTypeCard = ({ icon, title, count, color }) => (
  <TouchableOpacity 
    style={[styles.statCard, { 
      backgroundColor: '#FFFFFF',
      borderColor: color,
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
        <Text style={styles.statTitle}>{title}</Text>
      {/* </View> */}
    
  </TouchableOpacity>
);

// Add this new component for the progress bar
const ProgressBar = ({ current, total }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressTextContainer}>
      <Text style={styles.progressText}>Today's Patient Visits</Text>
      <Text style={styles.progressCount}>{current}/{total}</Text>
    </View>
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${(current/total) * 100}%` }]} />
    </View>
  </View>
);

// Update the SAMPLE_APPOINTMENTS with today's date and next few days
const getTodayBasedAppointments = () => {
  const appointments = {};
  const today = new Date();
  
  // Add appointments for today and next 5 days
  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    // Ensure at least some dates have appointments
    if (i === 0 || i === 2 || i === 4) { // Today, day after tomorrow, and 4th day
      appointments[dateString] = Math.floor(Math.random() * 3) + 1; // 1-3 appointments
    } else {
      appointments[dateString] = Math.floor(Math.random() * 2); // 0-1 appointments
    }
  }
  
  return appointments;
};

const SAMPLE_APPOINTMENTS = getTodayBasedAppointments();

// Keep DateItem component outside
const DateItem = ({ day, date, isSelected, hasAppointments, isToday, onPress }) => (
  <TouchableOpacity 
    style={[
      styles.dateItem, 
      isSelected && styles.selectedDateItem,
      isToday && styles.todayDateItem
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.dayText, 
      isSelected && styles.selectedDayText,
      isToday && styles.todayText
    ]}>
      {day}
    </Text>
    <Text style={[
      styles.dateNumber, 
      isSelected && styles.selectedDateNumber,
      isToday && styles.todayText
    ]}>
      {date}
    </Text>
    {hasAppointments && <View style={[
      styles.appointmentDot,
      (isSelected || isToday) && styles.selectedAppointmentDot
    ]} />}
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState(new Date());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [outPatients, setOutPatients] = useState([]);
  const [inPatients, setInPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Update the sample data to include visit counts
  const SAMPLE_DATA = {
    outPatients: [
      {
        PATIENT_NAME: 'John Doe',
        AGE: '45',
        Sex: 'Male',
        CASE_TYPE: 'Diabetes',
        Appointment_Time: '10:30 AM',
        UHID: 'UH001',
        STATUS: 'Completed'
      },
      {
        PATIENT_NAME: 'Jane Smith',
        AGE: '32',
        Sex: 'Female',
        CASE_TYPE: 'Follow-up',
        Appointment_Time: '11:00 AM',
        UHID: 'UH002',
        STATUS: 'Completed'
      },
      // Add more with different statuses
    ],
    inPatients: [
      {
        PatientName: 'Robert Wilson',
        Age: '58',
        Gender: 'Male',
        CaseType: 'Post Surgery',
        AdmissionDate: '2024-03-20',
        Uhid: 'UH003'
      },
      {
        PatientName: 'Mary Johnson',
        Age: '49',
        Gender: 'Female',
        CaseType: 'Cardiac Care',
        AdmissionDate: '2024-03-19',
        Uhid: 'UH004'
      },
      // Add more sample in-patients...
    ],
    visitCounts: {
      completed: 8,
      total: 24
    }
  };

  // Modify the useEffect to use sample data
  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setOutPatients(SAMPLE_DATA.outPatients);
      setInPatients(SAMPLE_DATA.inPatients);
      setLoading(false);
    }, 1000);
  }, []);

  // Add sample user data
  const SAMPLE_USER = {
    'Doctor Id': 'DOC001',
    'Doctor Name': 'Dr. Sarah Connor',
    'Doctor Type': 'OUTPATIENT' // Can be 'SURGERY', 'OUTPATIENT', or 'INPATIENT'
  };

  // In your component, replace the Redux selector
  // const user = useSelector(state => state.auth.user);
  const user = SAMPLE_USER;

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = months[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const upcomingAppointments = [
    {
      name: 'Madhu Prakash A.',
      age: '28 years',
      gender: 'Male',
      eventType: 'Review',
      type: 'OP Consultation',
      time: 'Scheduled: 10:30 PM',
    },
    {
      name: 'Rajesh Kumar M.',
      age: '42 years',
      gender: 'Male',
      eventType: 'Surgery',
      type: 'Total Knee Replacement',
      time: 'Scheduled: 08:30 PM',
    },
    {
      name: 'Lakshmi N.',
      age: '55 years',
      gender: 'Female',
      eventType: 'IP Rounds',
      type: 'Diabetic Ketoacidosis',
      time: 'Scheduled: 09:30 PM',
    },
    {
      name: 'Priya S.',
      age: '27 years',
      gender: 'Female',
      eventType: 'Video Consult',
      type: 'Review',
      time: 'Scheduled: 11:30 PM',
    },
  ];

  // Update generateWeekDays function
  const generateWeekDays = () => {
    const days = [];
    const startDate = new Date(dateRange);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const hasAppts = SAMPLE_APPOINTMENTS[dateString] > 0;
      console.log('Date:', dateString, 'Appointments:', SAMPLE_APPOINTMENTS[dateString], 'Has Appointments:', hasAppts);
      
      days.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: dateString,
        isSelected: date.toDateString() === selectedDate.toDateString(),
        hasAppointments: hasAppts,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    return days;
  };

  // Update handleDateChange function
  const handleDateChange = (direction) => {
    const newDate = new Date(dateRange);
    if (direction === 'forward') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setDateRange(newDate);
    setSelectedDate(newDate);
  };

  // Update the monthText to show correct month based on dateRange
  const getMonthYear = () => {
    const date = new Date(dateRange);
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const renderDoctorTypeCards = () => {
    const doctorType = user?.['Doctor Type'] || 'GENERAL';

    switch (doctorType) {
      case 'SURGERY':
        return (
          <View style={styles.cardsContainer}>
            <DoctorTypeCard 
              icon="account-group"
              title="Out Patients"
              count="24"
              color={COLORS.primary}
            />
            <DoctorTypeCard 
              icon="bed"
              title="In Patients"
              count="12"
              color={COLORS.primary}
            />
            <DoctorTypeCard 
              icon="medical-bag"
              title="Surgeries"
              count="3"
              color={COLORS.primary}
            />
          </View>
        );
      
      case 'INPATIENT':
        return (
          <View style={styles.cardsContainer}>
            <DoctorTypeCard 
              icon="account-group"
              title="Out Patients"
              count={outPatients.length}
              color={COLORS.primary}
            />
            <DoctorTypeCard 
              icon="calendar-check"
              title="Appointments"
              count="8"
              color={COLORS.primary}
            />
          </View>
        );
      
      case 'OUTPATIENT':
        return (
          <View>
            <View style={styles.cardsContainer}>
              <DoctorTypeCard 
                icon="account-group"
                title="Out Patients"
                count={SAMPLE_DATA.visitCounts.total}
                color={COLORS.primary}
              />
            </View>
            <ProgressBar 
              current={SAMPLE_DATA.visitCounts.completed} 
              total={SAMPLE_DATA.visitCounts.total} 
            />
          </View>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
            <Image source={require('../../../assets/logo.png')} style={styles.logo} />
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome {user['Doctor Name']}</Text>
          {/* <Text style={styles.subText}>Let's take care of your patient's</Text> */}
        </View>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search patients, appointments..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          placeholderTextColor="#999"
          icon={() => <MaterialCommunityIcons name="magnify" size={24} color="#999" />}
          iconColor="#999"
        />

        {/* Calendar Section */}
        <View style={styles.dateSection}>
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={() => handleDateChange('back')}>
              <MaterialCommunityIcons name="chevron-left" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.monthText}>{getMonthYear()}</Text>
            <TouchableOpacity onPress={() => handleDateChange('forward')}>
              <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.dateScrollView}
            contentContainerStyle={styles.dateScrollContent}
          >
            {generateWeekDays().map((item, index) => (
              <DateItem 
                key={index}
                day={item.day}
                date={item.date}
                isSelected={item.isSelected}
                hasAppointments={item.hasAppointments}
                isToday={item.isToday}
                onPress={() => setSelectedDate(new Date(item.fullDate))}
              />
            ))}
          </ScrollView>
        </View>

        {/* Overview Section */}
        <View style={styles.overviewSection}>
          {/* <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Over View</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View> */}
          
          {renderDoctorTypeCards()}
        </View>

        {/* Upcoming Section */}
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Appointment Cards */}
          {outPatients.map((appointment, index) => (
            <Card key={index} style={styles.appointmentCard}>
              <Card.Content style={styles.appointmentContent}>
                <View style={styles.appointmentLeft}>
                  <Text style={styles.appointmentName}>{appointment.PATIENT_NAME}</Text>
                  <Text style={styles.appointmentDetails}>
                    {appointment.AGE} | {appointment.Sex} | {appointment.CASE_TYPE}
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
                      <Text style={styles.eventType}>{appointment.CASE_TYPE}</Text>
                    )}
                  </View>
                  <View style={styles.scheduleTag}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#666" />
                    <Text style={styles.scheduleText}>Scheduled on: {appointment.Appointment_Time}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Patient Section */}
        {/* <View style={styles.patientSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>In Patients</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {inPatients.map((patient, index) => (
            <View key={index} style={styles.patientCard}>
              <Text style={styles.patientName}>{patient.Salutation} {patient.PatientName}</Text>
              <Text>IP No: {patient.IpNo}</Text>
              <Text>UHID: {patient.Uhid}</Text>
              <Text>Age: {patient.Age} {patient.AgeType}</Text>
              <Text>Case: {patient.CaseType}</Text>
              <Text>Admission Date: {patient.AdmissionDate}</Text>
            </View>
          ))}
        </View>

        <View style={styles.patientSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Out Patients</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {outPatients.map((patient, index) => (
            <View key={index} style={styles.patientCard}>
              <Text style={styles.patientName}>{patient.PATIENT_NAME}</Text>
              <Text>UHID: {patient.UHID}</Text>
              <Text>OP No: {patient.OP_NO}</Text>
              <Text>Age: {patient.AGE}</Text>
              <Text>Sex: {patient.Sex}</Text>
              <Text>Appointment Time: {patient.Appointment_Time}</Text>
              <Text>Case Type: {patient.CASE_TYPE}</Text>
              <Text>Status: {patient.STATUS}</Text>
            </View>
          ))}
        </View> */}
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
    marginBottom: height * 0.008,
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
  searchBar: {
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.008,
    backgroundColor: '#f5f5f5',
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
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.01,
  },
  monthText: {
    fontSize: width * 0.04,
    fontFamily: 'Poppins-Medium',
    color: COLORS.text.primary,
  },
  dateScrollView: {
    marginTop: height * 0.015,
  },
  dateScrollContent: {
    paddingHorizontal: width * 0.04,
    paddingRight: width * 0.08, // Add extra padding at the end
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.02,
    marginRight: width * 0.03, // Increase space between dates
    borderRadius: width * 0.02,
    minWidth: width * 0.12,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedDateItem: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  todayDateItem: {
    borderColor: theme.colors.primary,
  },
  dayText: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.034, 14),
    color: '#666',
    marginBottom: height * 0.004,
  },
  dateNumber: {
    fontFamily: 'Poppins-Medium',
    fontSize: Math.min(width * 0.036, 16),
    color: '#333',
  },
  selectedDayText: {
    color: '#fff',
  },
  selectedDateNumber: {
    color: '#fff',
  },
  todayText: {
    color: '#000',
  },
  appointmentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    bottom: 2,
    alignSelf: 'center',
  },
  selectedAppointmentDot: {
    backgroundColor: '#fff',
  },
  overviewSection: {
    backgroundColor: '#fff',
    paddingVertical: height * 0.015,
    // marginBottom: height * 0.002,
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
  statCard: {
    width: width * 0.31,
    padding: width * 0.025,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statCardContent: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  iconContainer: {
    padding: width * 0.02,
    borderRadius: 8,
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
    marginTop: height * 0.01,
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
    color: theme.colors.primary,
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
    paddingHorizontal: width * 0.04,
    marginTop: height * 0.02,
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
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
}); 
