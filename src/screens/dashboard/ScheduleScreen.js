import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Text, Searchbar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../utils/theme';
import { typography } from '../../utils/typography';
import PreOpChecklistModal from '../../components/PreOpChecklistModal';
import { useSelector } from 'react-redux';
import { patientService } from '../../api/services/patientService';
import PatientDocumentScreen from '../PatientDocumentScreen';
import { COLORS, InPatientSearchText, OTPatientsData, OTPatientsSearchText, OutPatienstData, OutPatientSearchText } from '../../utils/constants';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

const { width, height } = Dimensions.get('window');
const PatientCard = ({ patient, setPatientDocuments }) => (
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
            {/* <MaterialCommunityIcons name="clock-outline" size={16} color="#FFA500" /> */}
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
            {/* <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" /> */}
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
            {/* <MaterialCommunityIcons name="pause-circle" size={16} color="#FF5722" /> */}
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
          {/* {patient.type && (
          <Text style={styles.consultType}>{patient.type}</Text>
        )} */}
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
        {patient.hasVideo && (
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="video" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconButton} onPress={() => setPatientDocuments(patient)}>
          <MaterialCommunityIcons name="file-document-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>

  </View>
);
const InPatientCard = ({ patient, setPatientDocuments }) => (
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
          {patient.hasVideo && (
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="video" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.iconButton} onPress={() => setPatientDocuments(patient)}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <View style={styles.patientDetails}>

      <View style={styles.statusSection}>
        <View style={styles.statusContainer}>
          {/* <MaterialCommunityIcons name="clock-outline" size={16} color="#FFA500" /> */}
          <Text style={[styles.statusText, { color: '#FFA500' }]}>
            {patient.Status}
          </Text>
          <View >
            {patient.CaseType && (
              <Text style={styles.consultType}>•{patient.IpNo}</Text>
            )}
            {/* {patient.REFERRED_BY_PHYSICIAN && (
                <Text style={styles.referredBy} numberOfLines={1}>
                  {patient.REFERRED_BY_PHYSICIAN}
                </Text>
              )}
              {patient.Last_visit && (
                <Text style={styles.lastVisit}>{patient.Last_visit}</Text>
              )} */}
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

const OTScheduleCard = ({ surgery,hideChecklist,initialModalTab,checklistVisible ,setChecklistVisible}) => (
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
          <TouchableOpacity style={[styles.iconButton,{backgroundColor:isInvestigationComplete(surgery)?'rgba(28, 141, 28, 0.28)':'rgba(216, 141, 29, 0.28)'}]} onPress={()=>setChecklistVisible(true)}>
            <MaterialCommunityIcons name="view-list" size={20} color={isInvestigationComplete(surgery)?'green':'orange'} />
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

export default function ScheduleScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dateRange, setDateRange] = useState(new Date());
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
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setDateRange(date);
    hideDatePicker();
  };
  const selectedDateString = moment(dateRange).format('DD-MM-YYYY');
  const filteredOutPatients = OutPatienstData.filter(appointment =>
    appointment.Appointment_Date === selectedDateString && appointment.PATIENT_NAME.toLowerCase().includes(searchQuery.toLowerCase()) && appointment.STATUS.toLowerCase().includes(selectedFilter.toLowerCase())
  );
  const filteredInPatients = inPatients.filter(patient =>
    patient.AdmissionDate.replaceAll('/', '-') === selectedDateString && patient.PatientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOtPatients = OTPatientsData.filter(patient =>
    // patient.SurgeryDate === selectedDateString
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
                          onPress={() => setSelectedFilter(selectedFilter === filter ? '' : filter)}
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
            <TouchableOpacity>
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
            />
          </View>}

          <View style={styles.scheduleTypeContainer}>
            <TouchableOpacity
              style={[
                styles.scheduleTypeButton,
                activeTab === 'Out - Patients' && styles.activeScheduleTypeButton
              ]}
              onPress={() => setActiveTab('Out - Patients')}
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
              onPress={() => setActiveTab('In - Patients')}
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
              onPress={() => setActiveTab('OT Schedule')}
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
                  <Text style={styles.noAppoinmentsText}>You don't have any appoinments scheduled {'\n'} for {moment(dateRange).format('MMMM DD, YYYY')}</Text>
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
                  <Text style={styles.noAppoinmentsText}>You don't have any In-Patients scheduled {'\n'} for {moment(dateRange).format('MMMM DD, YYYY')}</Text>
                </View>
            ) : (
              filteredOtPatients.length > 0 ? filteredOtPatients?.map((surgery, index) => (
                <Card key={index} style={styles.surgeryCard}>
                  <Card.Content>
                    <OTScheduleCard surgery={surgery} hideChecklist={hideChecklist} checklistVisible={checklistVisible} initialModalTab={initialModalTab} setChecklistVisible={setChecklistVisible}/>
                  </Card.Content>
                </Card>
              )) : <View style={styles.noAppointments}>
                <Image source={require('../../assets/images/noAppoinments.png')} />
                <Text style={styles.noAppoinmentsHeader}>Not Schedule Yet</Text>
                <Text style={styles.noAppoinmentsText}>You don't have any OT-Patients scheduled {'\n'} for {moment(dateRange).format('MMMM DD, YYYY')}</Text>
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
    flexWrap:'wrap',
    gap: 0,
    width:'95%',
    alignItems: 'center',
    lineHeight:'0.2'
  },
  patientName: {
    fontSize: width * 0.042,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    paddingRight:5

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
    alignItems:'center'
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
  }
}); 