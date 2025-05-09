import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Modal } from 'react-native';
import { Text, Searchbar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../utils/theme';
import { typography } from '../../utils/typography';
import PreOpChecklistModal from '../../components/PreOpChecklistModal';
import { useDispatch, useSelector } from 'react-redux';
import { patientService } from '../../api/services/patientService';
import PatientDocumentScreen from '../PatientDocumentScreen';
import { COLORS, INPatientsData, InPatientSearchText, OTPatientsData, OTPatientsSearchText, OutPatienstData, OutPatientSearchText, User } from '../../utils/constants';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import mixpanel, { trackEvent } from '../../utils/mixpanel';
import { setDateRange } from '../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');
const PatientCard = ({ patient, setPatientDocuments }) => {
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);

  const handleVideoConsultation = () => {
    setIsVideoModalVisible(true);
    trackEvent('OP Video Consultation Started', { patientId: patient.UHID })
  };

  return (
    <View style={styles.patientCard}>
      <View>    <View style={styles.patientMainInfo}>
        <View style={styles.nameAndTime}>
          <Text style={styles.patientName}>{patient.PATIENT_NAME}</Text>
          <Text style={styles.uhidText}>{patient.UHID}</Text>
        </View>
        <View style={styles.patientSubInfo}>
          <View style={styles.time}>
            <MaterialCommunityIcons name="account" size={15} color={'#666'} />
            <Text style={styles.ageGender}>{patient.AGE} Age | {patient.Sex}</Text>
          </View>

          <View style={styles.time}>
            <MaterialCommunityIcons name="clock" size={15} color={'#666'} />
            <Text style={styles.ageGender}>{patient.Appointment_Time}</Text>
          </View>
        </View>
      </View>
        <View style={styles.statusSection}>
          {patient.STATUS === 'waiting' && (
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: '#FFA500' }]}>
                Waiting
              </Text>
              <View >
                {patient.CASE_TYPE && (
                  <Text style={styles.consultType}>• {patient.CASE_TYPE}</Text>
                )}
                {patient.REFERRED_BY_PHYSICIAN && (
                  <Text style={styles.referredBy} numberOfLines={1}>
                    {patient.REFERRED_BY_PHYSICIAN}
                  </Text>
                )}
                {patient.Last_visit && (
                  <Text style={styles.lastVisit}>{patient.Last_visit}</Text>
                )}
              </View>
            </View>
          )}
          {patient.STATUS === 'Completed' && (
            <View style={styles.statusContainer}>
              <View>
                <Text style={[styles.statusText, { color: '#4CAF50' }]}>Completed</Text>
                {
                  patient.Last_visit && <Text style={styles.consultType}>Last Visit:</Text>
                }            </View>
              <View>
                {patient.CASE_TYPE && (
                  <Text style={styles.consultType}>• {patient.CASE_TYPE}</Text>
                )}
                {patient.REFERRED_BY_PHYSICIAN && (
                  <Text style={styles.referredBy} numberOfLines={1}>
                    {patient.REFERRED_BY_PHYSICIAN}
                  </Text>
                )}
                {patient.Last_visit && (
                  <Text style={styles.lastVisit}>{patient.Last_visit}</Text>
                )}
              </View>
            </View>
          )}
          {patient.STATUS === 'onHold' && (
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: '#FF5722' }]}>On Hold</Text>
              <View>
                {patient.CASE_TYPE && (
                  <Text style={styles.consultType}>• {patient.CASE_TYPE}</Text>
                )}
                {patient.REFERRED_BY_PHYSICIAN && (
                  <Text style={styles.referredBy} numberOfLines={1}>
                    {patient.REFERRED_BY_PHYSICIAN}
                  </Text>
                )}
                {patient.Last_visit && (
                  <Text style={styles.lastVisit}>{patient.Last_visit}</Text>
                )}
              </View>
            </View>
          )}
          {!patient.STATUS && <View >
            {patient.REFERRED_BY_PHYSICIAN && (
              <Text style={styles.referredBy}>
                {patient.REFERRED_BY_PHYSICIAN}
              </Text>
            )}
            {patient.Last_visit && (
              <Text style={styles.lastVisit}>{patient.Last_visit}</Text>
            )}
          </View>}
        </View></View>

      <View style={styles.consultInfo}>
        <View style={styles.rightSection}>
          {/* {patient.hasVideo && ( */}
          {/* <TouchableOpacity style={styles.iconButton} onPress={handleVideoConsultation}>
            <MaterialCommunityIcons name="video" size={20} color={theme.colors.primary} />
          </TouchableOpacity> */}
          {/* )} */}
          <TouchableOpacity style={styles.iconButton} onPress={() => setPatientDocuments(patient)}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVideoModalVisible}
        onRequestClose={() => setIsVideoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Video Consultation</Text>
              <TouchableOpacity onPress={() => setIsVideoModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Patient Details:</Text>
              <Text style={styles.modalText}>Name: {patient.PATIENT_NAME}</Text>
              <Text style={styles.modalText}>UHID: {patient.UHID}</Text>

              <View style={styles.videoContainer}>
                <View style={styles.videoPlaceholder}>
                  <MaterialCommunityIcons name="video" size={50} color="#666" />
                  <Text style={styles.videoPlaceholderText}>Video consultation will start here</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsVideoModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>End Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={() => {
                  // Here you would implement the actual video call functionality
                  console.log('Starting video call with:', patient.PATIENT_NAME);
                }}
              >
                <Text style={styles.scheduleButtonText}>Start Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const InPatientCard = ({ patient, setPatientDocuments }) => {


  return (
    <View>
      <View style={styles.patientCard}>
        <View style={styles.patientMainInfo}>
          <View style={styles.nameAndTime}>
            <Text style={styles.patientName}>{patient.PatientName}</Text>
            <Text style={styles.uhidText}>{patient.Uhid}</Text>
          </View>
          <View style={styles.patientSubInfo}>
            <View style={styles.time}>
              <MaterialCommunityIcons name="account" size={15} color={'#666'} />
              <Text style={styles.ageGender}>{patient.Age} Age | {patient.Gender} | {patient.CaseType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.consultInfo}>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton} onPress={() => setPatientDocuments(patient)}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.patientDetails}>
        <View style={styles.statusSection}>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: '#FFA500' }]}>
              {patient.Status}
            </Text>
            <View >
              {patient.CaseType && (
                <Text style={styles.consultType}>•{patient.IpNo}</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.time}>
          <MaterialCommunityIcons name="clock" size={12} color={'#ddd'} />
          <Text style={styles.admitted}>Admitted: {patient.AdmissionDate.replaceAll('/', '-')}</Text>
        </View>
      </View>

    </View>
  );
};

const OTScheduleCard = ({ surgery, hideChecklist, initialModalTab, checklistVisible, setChecklistVisible }) => (
  <View style={styles.otCard}>
    <View style={styles.patientCard}>
      <View style={styles.patientMainInfo}>
        <View style={styles.nameAndTime}>
          <Text style={styles.patientName}>{surgery.PATIENT_NAME}</Text>
          <Text style={styles.uhidText}>{surgery.UHID}</Text>
        </View>
        <View style={styles.patientSubInfo}>
          <View style={styles.time}>
            <MaterialCommunityIcons name="account" size={15} color={'#666'} />
            <Text style={styles.ageGender}>{surgery.AGE} Age | {surgery.SEX} </Text>
          </View>
        </View>
      </View>

      <View style={styles.consultInfo}>
        <View style={styles.rightSection}>
          {surgery.hasVideo && (
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="video" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: isInvestigationComplete(surgery) ? 'rgba(28, 141, 28, 0.28)' : 'rgba(216, 141, 29, 0.28)' }]} onPress={() => setChecklistVisible(true)}>
            <MaterialCommunityIcons name="view-list" size={20} color={isInvestigationComplete(surgery) ? 'green' : 'orange'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>

    <View style={styles.patientDetails}>
      <View style={styles.statusSection}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: '#FFA500' }]}>
            Emergency
          </Text>
          <View >
            <Text style={styles.consultType}>• {surgery.THEATRENAME}</Text>
          </View>
        </View>
      </View>
      <View style={styles.time}>
        <MaterialCommunityIcons name="clock" size={12} color={'#ddd'} />
        <Text style={styles.admitted}>Scheduled: 12:00 PM</Text>
      </View>
    </View>
    <Text style={styles.procedureTitle}>{surgery.SURGERY}</Text>
    <View style={styles.procedureSection}>
      <>
        <Text style={styles.procedureDetails}>
          Anesthesia: {surgery.ANESTHESIATYPE} | Duration: 2.5hrs
        </Text>
      </>
      <View style={styles.teamSection}>
        <Text style={styles.teamText}>Team: {surgery.DOCTOR.ActDoctor}, {surgery.DOCTOR.AssistantSurgeon},{surgery.DOCTOR.AttendingDoctor}</Text>
      </View>
    </View>

    <PreOpChecklistModal
      visible={checklistVisible}
      hideModal={hideChecklist}
      patient={surgery}
      initialTab={initialModalTab}
    />
  </View>
);

function isInvestigationComplete(patient) {
  return patient.INVESTIGATION.every(investigation => investigation.Status === 'Completed');
}

export default function ScheduleScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  // const [dateRange, setDateRange] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [activeTab, setActiveTab] = React.useState('Out - Patients');
  const [checklistVisible, setChecklistVisible] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [initialModalTab, setInitialModalTab] = useState('details');
  const [outPatients, setOutPatients] = useState([]);
  const [inPatients, setInPatients] = useState([]);
  const [otPatients, setOtPatients] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [patientDocuments, setPatientDocuments] = useState(null)
  const user = useSelector(state => state.auth.user);
  // const user = User
  const dispatch = useDispatch();
  const dateRange = useSelector(state => state.auth.dateRange);

  const doctorId = user?.['Doctor Id'];
  const [searchVisible, setSearchVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');

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

  const hideChecklist = () => {
    setChecklistVisible(false);
    setSelectedPatient(null);

  };
  const showDatePicker = () => {
    setDatePickerVisible(true);
    mixpanel.track('Date Picker Opened', User)

  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    mixpanel.track('Date Picker Closed', User)
  };

  const handleConfirm = (date) => {
    dispatch(setDateRange(date));
    hideDatePicker();
    mixpanel.track('Date Picker Confirmed', { date, User })

  };
  const selectedDateString = moment(dateRange).format('DD-MM-YYYY');
  const filteredOutPatients = OutPatienstData.sort((a, b) => a.Appointment_Time.localeCompare(b.Appointment_Time)).filter(appointment =>
    appointment.Appointment_Date === selectedDateString && appointment.PATIENT_NAME.toLowerCase().includes(searchQuery.toLowerCase()) && appointment.STATUS.toLowerCase().includes(selectedFilter.toLowerCase())
  );
  const filteredInPatients = INPatientsData.filter(patient =>
    patient.AdmissionDate.replaceAll('/', '-') === selectedDateString && patient.PatientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOtPatients = OTPatientsData.filter(patient =>
    patient.SurgeryDate === selectedDateString &&
    patient.PATIENT_NAME.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      {patientDocuments ?
        <PatientDocumentScreen patient={patientDocuments} setPatientDocuments={setPatientDocuments} activeTab={activeTab} /> :
        <SafeAreaView style={styles.container} edges={['top']}>


          {searchVisible ? (
            <View style={styles.searchContainer}>
              <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#962067" />
              </TouchableOpacity>
              <View style={styles.searchBarContainer}>
                <Searchbar
                  placeholder="Search patients by name, room or ID..."
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  onSubmitEditing={() => mixpanel.track('Search Bar', { searchQuery, User })}
                  style={styles.searchBar}
                  inputStyle={styles.searchInput}
                  placeholderTextColor="#999"
                  icon={() => <MaterialCommunityIcons name="magnify" size={24} color="#962067" />}
                  iconColor="#999"
                />
                <View style={styles.filterContainer}>
                  {(activeTab === 'Out - Patients' ? OutPatientSearchText :
                    activeTab === 'In - Patients' ? InPatientSearchText :
                      OTPatientsSearchText).map((filter) => (
                        <TouchableOpacity
                          key={filter}
                          style={[
                            styles.filterButton,
                            selectedFilter === filter && styles.activeFilterButton
                          ]}
                          onPress={() => [setSelectedFilter(selectedFilter === filter ? '' : filter), mixpanel.track('Filter Selected', { filter, User })]}
                        >
                          <Text style={[
                            styles.filterText,
                            selectedFilter === filter ? { color: '#fff' } : { color: '#666' }
                          ]}>
                            {filter}
                          </Text>
                        </TouchableOpacity>
                      ))}
                </View>
              </View>
            </View>
          ) : <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="chevron-left" size={30} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Schedule</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={showDatePicker}>
                <MaterialCommunityIcons name="calendar" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSearchVisible(true)}>
                <MaterialCommunityIcons name="magnify" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              date={dateRange}
              maximumDate={moment().add(3, 'months').toDate()}
            />
          </View>}

          <View style={styles.scheduleTypeContainer}>
            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                activeTab === 'Out - Patients' && styles.activeScheduleTypeButton
              ]}
              onPress={() => [setActiveTab('Out - Patients'), trackEvent('OP Schedule Selected', user)]}
            >
              <MaterialCommunityIcons name="account-group" size={24} color={activeTab === 'Out - Patients' ? theme.colors.primary : '#666'} />

              <Text style={[
                styles.scheduleTypeText,
                activeTab === 'Out - Patients' && styles.activeScheduleTypeText
              ]}>Out - Patients</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                activeTab === 'In - Patients' && styles.activeScheduleTypeButton
              ]}
              onPress={() => [setActiveTab('In - Patients'), trackEvent('IP Schedule Selected', user)]}
            >
              <MaterialCommunityIcons name="bed" size={24} color={activeTab === 'In - Patients' ? theme.colors.primary : '#666'} />

              <Text style={[
                styles.scheduleTypeText,
                activeTab === 'In - Patients' && styles.activeScheduleTypeText
              ]}>In - Patients</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                activeTab === 'OT Schedule' && styles.activeScheduleTypeButton
              ]}
              onPress={() => [setActiveTab('OT Schedule'), trackEvent('OT Schedule Selected', user)]}
            >
              <MaterialCommunityIcons name="medical-bag" size={24} color={activeTab === 'OT Schedule' ? theme.colors.primary : '#666'} />

              <Text style={[
                styles.scheduleTypeText,
                activeTab === 'OT Schedule' && styles.activeScheduleTypeText
              ]}>OT Schedule</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {activeTab === 'Out - Patients' ? (
              filteredOutPatients.length > 0 ?
                filteredOutPatients.map((appointment, index) => (
                  <Card key={index} style={styles.appointmentCard}>
                    <Card.Content>
                      <PatientCard patient={appointment} setPatientDocuments={setPatientDocuments} />
                    </Card.Content>
                  </Card>
                )) :
                <View style={styles.noAppointments}>
                  <Image source={require('../../assets/images/noAppoinments.png')} />
                  <Text style={styles.noAppoinmentsHeader}>Not Schedule Yet</Text>
                  <Text style={styles.noAppoinmentsText}>You don't have any appoinments scheduled {'\n'} for {moment(dateRange).format('MMMM DD, YYYY') === moment().format('MMMM DD, YYYY') ? 'Today' : moment(dateRange).format('MMMM DD, YYYY')}</Text>
                </View>
            ) : activeTab === 'In - Patients' ? (
              filteredInPatients.length > 0 ?
                filteredInPatients.map((appointment, index) => (
                  <Card key={index} style={styles.appointmentCard}>
                    <Card.Content>
                      <InPatientCard patient={appointment} setPatientDocuments={setPatientDocuments} />
                    </Card.Content>
                  </Card>
                )) : <View style={styles.noAppointments}>
                  <Image source={require('../../assets/images/noAppoinments.png')} />
                  <Text style={styles.noAppoinmentsHeader}>Not Schedule Yet</Text>
                  <Text style={styles.noAppoinmentsText}>You don't have any In-Patients scheduled {'\n'} for {moment(dateRange).format('MMMM DD, YYYY') === moment().format('MMMM DD, YYYY') ? 'Today' : moment(dateRange).format('MMMM DD, YYYY')}</Text>
                </View>
            ) : (
              filteredOtPatients.length > 0 ? filteredOtPatients?.map((surgery, index) => (
                <Card key={index} style={styles.surgeryCard}>
                  <Card.Content>
                    <OTScheduleCard surgery={surgery} hideChecklist={hideChecklist} checklistVisible={checklistVisible} initialModalTab={initialModalTab} setChecklistVisible={setChecklistVisible} />
                  </Card.Content>
                </Card>
              )) : <View style={styles.noAppointments}>
                <Image source={require('../../assets/images/noAppoinments.png')} />
                <Text style={styles.noAppoinmentsHeader}>Not Schedule Yet</Text>
                <Text style={styles.noAppoinmentsText}>You don't have any OT-Patients scheduled {'\n'} for {moment(dateRange).format('MMMM DD, YYYY') === moment().format('MMMM DD, YYYY') ? 'Today' : moment(dateRange).format('MMMM DD, YYYY')}</Text>
              </View>
            )}
          </ScrollView>

        </SafeAreaView>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerIcons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5
  },
  headerTitle: {
    ...typography.h2,
    color: theme.colors.primary,
  },
  quickGlanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: width * 0.038,
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  dateText: {
    ...typography.regular,
    color: '#333',
  },
  scheduleTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.04,
    marginVertical: height * 0.02,
    gap: width * 0.03,
    borderBottomWidth: 2,
    borderBottomColor: '#eee'
  },
  scheduleTypeButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    alignItems: 'center',

  },
  activeScheduleTypeButton: {
    borderBottomColor: theme.colors.primary,
    borderBottomWidth: 2,
  },
  scheduleTypeText: {
    ...typography.regular,
    fontSize: width * 0.038,
    color: '#666',
  },
  activeScheduleTypeText: {
    ...typography.regular,
    fontSize: width * 0.038,
    color: theme.colors.primary,
  },
  placeholderText: {
    textAlign: 'center',
    marginTop: height * 0.02,
    color: '#666',
  },
  appointmentCard: {
    marginHorizontal: width * 0.04,
    marginBottom: height * 0.015,
    elevation: 2,
    borderRadius: width * 0.02,
    backgroundColor: '#fff',
  },
  patientCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  patientDetails: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  patientMainInfo: {
    // marginBottom: height * 0.01,
  },
  nameAndTime: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 0,
    width: '95%',
    alignItems: 'center',
    lineHeight: '0.2'
  },
  patientName: {
    fontSize: width * 0.042,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    paddingRight: 5

  },
  appointmentTime: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  patientSubInfo: {
    marginTop: 2,
    display: 'flex',
    flexDirection: 'row',
    gap: 5
  },
  admitted: {
    fontSize: width * 0.025,
    fontFamily: 'Poppins-Regular',
    color: '#999',
  },
  ageGender: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  uhidText: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    // marginTop: 2,
  },
  consultInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginVertical: height * 0.01,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    gap: width * 0.02,
  },
  time: {
    display: 'flex',
    flexDirection: 'row'
  },
  consultType: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  referredBy: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  lastVisit: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  statusText: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  surgeryCard: {
    marginHorizontal: width * 0.04,
    marginBottom: height * 0.015,
    elevation: 2,
    borderRadius: width * 0.02,
    backgroundColor: '#fff',
  },
  otCard: {
    backgroundColor: '#fff',
    // borderRadius: 12,
    // padding: width * 0.04,
    // marginBottom: height * 0.012,
    // elevation: 2,
  },
  otHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  otTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  otNumber: {
    fontSize: width * 0.04,
    color: theme.colors.primary,
    fontWeight: '500',
    fontFamily: 'Poppins-Regular',
  },
  otTypeBadge: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.004,
    borderRadius: 20,
  },
  otTypeText: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  otTime: {
    fontSize: width * 0.038,
    fontFamily: 'Poppins-Medium',
    color: theme.colors.primary,
  },
  procedureSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: height * 0.01,
    alignItems: 'center'
  },
  procedureTitle: {
    fontSize: width * 0.03,
    // fontWeight: '700',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  procedureDetails: {
    fontSize: width * 0.025,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    // marginTop: height * 0.004,
  },
  teamSection: {
    // marginTop: height * 0.01,
  },
  teamText: {
    fontSize: width * 0.025,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  preOpStatus: {
    fontSize: width * 0.035,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginTop: height * 0.004,
  },
  otActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: width * 0.02,
    marginTop: height * 0.015,
  },
  otButton: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.008,
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otButtonText: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Medium',
  },
  iconButton: {
    backgroundColor: '#ddd',
    borderRadius: 50,
    padding: 5
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: width * 0.02,
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: width * 0.01,
    marginTop: height * 0.01,
  },
  filterButton: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  activeFilterButton: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    color: '#666',
  },
  noAppointments: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.5,
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
  searchBar: {
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
  searchBarContainer: {
    width: width * .8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    ...typography.h3,
    color: theme.colors.primary,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalLabel: {
    ...typography.h4,
    color: theme.colors.primary,
    marginBottom: 10,
  },
  modalText: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    marginBottom: 5,
  },
  videoContainer: {
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  videoPlaceholderText: {
    marginTop: 10,
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  cancelButtonText: {
    color: theme.colors.primary,
    fontFamily: 'Poppins-Regular',
  },
  scheduleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  scheduleButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
}); 