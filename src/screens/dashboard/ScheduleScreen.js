import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Searchbar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../utils/theme';
import { typography } from '../../../utils/typography';
import PreOpChecklistModal from '../../components/PreOpChecklistModal';
import { useSelector } from 'react-redux';
import { patientService } from '../../api/services/patientService';

const { width, height } = Dimensions.get('window');

const MENU_ITEMS = ['Out - Patients', 'In - Patients', 'OT Schedule'];

const STATUS_COLORS = {
  Waiting: '#FFA500',
  Scheduled: '#962067',
  Completed: '#4CAF50',
  'On Hold': '#FF5722',
};

const PatientCard = ({ patient }) => (
  <View style={styles.patientCard}>
    <View style={styles.patientMainInfo}>
      <View style={styles.nameAndTime}>
        <Text style={styles.patientName}>{patient.name}</Text>
        <Text style={styles.appointmentTime}>{patient.time}</Text>
      </View>
      <View style={styles.patientSubInfo}>
        <Text style={styles.ageGender}>{patient.age} | {patient.gender}</Text>
        <Text style={styles.uhidText}>{patient.uhid}</Text>
      </View>
    </View>
    
    <View style={styles.consultInfo}>
      <View style={styles.leftSection}>
        {patient.type && (
          <Text style={styles.consultType}>{patient.type}</Text>
        )}
        {patient.referredBy && (
          <Text style={styles.referredBy} numberOfLines={1}>
            {patient.referredBy}
          </Text>
        )}
        {patient.lastVisit && (
          <Text style={styles.lastVisit}>{patient.lastVisit}</Text>
        )}
      </View>
      <View style={styles.rightSection}>
        {patient.hasVideo && (
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="video" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="file-document-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.statusSection}>
      {patient.status === 'waiting' && (
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#FFA500" />
          <Text style={[styles.statusText, { color: '#FFA500' }]}>
            Waiting for {patient.waitingTime}
          </Text>
        </View>
      )}
      {patient.status === 'completed' && (
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={[styles.statusText, { color: '#4CAF50' }]}>Completed</Text>
        </View>
      )}
      {patient.status === 'onHold' && (
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="pause-circle" size={16} color="#FF5722" />
          <Text style={[styles.statusText, { color: '#FF5722' }]}>On Hold</Text>
        </View>
      )}
    </View>
  </View>
);

const OTScheduleCard = ({ surgery }) => (
  <View style={styles.otCard}>
    <View style={styles.otHeader}>
      <View style={styles.otTypeContainer}>
        <Text style={styles.otNumber}>{surgery.otNumber}</Text>
        <View style={[
          styles.otTypeBadge,
          { backgroundColor: surgery.otType === 'Emergency' ? '#FF5722' : theme.colors.primary }
        ]}>
          <Text style={styles.otTypeText}>{surgery.otType}</Text>
        </View>
      </View>
      <Text style={styles.otTime}>{surgery.time}</Text>
    </View>

    <View style={styles.patientMainInfo}>
      <Text style={styles.patientName}>{surgery.name}</Text>
      <View style={styles.patientSubInfo}>
        <Text style={styles.ageGender}>{surgery.age} | {surgery.gender}</Text>
        <Text style={styles.uhidText}>{surgery.uhid}</Text>
      </View>
    </View>

    <View style={styles.procedureSection}>
      <Text style={styles.procedureTitle}>{surgery.procedure}</Text>
      <Text style={styles.procedureDetails}>
        {surgery.anesthesia} • {surgery.duration}
      </Text>
    </View>

    <View style={styles.teamSection}>
      <Text style={styles.teamText}>{surgery.team}</Text>
      <Text style={styles.preOpStatus}>{surgery.preOpStatus}</Text>
    </View>

    <View style={styles.otActions}>
      {surgery.buttons.map((button, index) => (
        <TouchableOpacity 
          key={index}
          style={[
            styles.otButton,
            { 
              backgroundColor: button === 'View Details' ? '#fff' : theme.colors.primary,
              borderWidth: button === 'View Details' ? 1 : 0,
              borderColor: theme.colors.primary
            }
          ]}
        >
          <Text style={[
            styles.otButtonText,
            { color: button === 'View Details' ? theme.colors.primary : '#fff' }
          ]}>
            {button}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function ScheduleScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [activeTab, setActiveTab] = React.useState('Out - Patients');
  const [checklistVisible, setChecklistVisible] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [initialModalTab, setInitialModalTab] = useState('details');
  const [patients, setPatients] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const user = useSelector(state => state.auth.user); 
  const doctorId = user?.['Doctor Id'];

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const [outPatientsData] = await Promise.all([          
          patientService.getOutPatients(doctorId)
        ]);

        setPatients(outPatientsData);
        // setOutPatients(outPatientsData);

        console.log('In Patients:', outPatientsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchPatients();
    }
  }, [doctorId]);

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === 'forward') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: 'short'
    });
  };

  const appointments = [
    {
      name: 'Arun Kumar S.',
      uhid: 'UHID CN2089404262',
      age: '28 years',
      gender: 'Male',
      type: 'Diabetes',
      time: '02:15 PM',
      status: 'waiting',
      waitingTime: '25 minutes'
    },
    {
      name: 'Ida Marceline Lee',
      uhid: 'UHID CN2089404262',
      age: '45 years',
      gender: 'Female',
      type: 'Follow-up',
      time: '02:30 PM',
      referredBy: 'Referred by: Dr. kavitha assistant radiologist, Family Me...'
    },
    {
      name: 'Vikram S',
      uhid: 'UHID CN2089404262',
      age: '35 years',
      gender: 'Male',
      type: 'Review',
      time: '03:15 PM',
      status: 'completed',
      icons: ['clock-outline', 'pause-circle']
    },
    {
      name: 'Shreya',
      uhid: 'UHID: CN2089404262',
      age: 19,
      gender: 'Female',
      type: 'Follow-up',
      time: '03:30 PM',
      status: 'completed'
    },
    {
      name: 'Arun Kumar S.',
      uhid: 'UHID: CN2089404262',
      age: 28,
      gender: 'Male',
      type: 'Diabetes',
      time: '03:15 PM',
      lastVisit: 'Last visited on : 22.09.2024'
    },
    {
      name: 'Logesh B',
      uhid: 'UHID: CN2089404262',
      age: 28,
      gender: 'Male',
      type: 'Diabetes',
      time: '03:30 PM',
      lastVisit: 'Last visited on : 22.09.2024'
    },
    {
      name: 'Praveen V.K',
      uhid: 'UHID: CN2089404262',
      age: 42,
      gender: 'Male',
      type: 'Diabetes',
      time: '03:45 PM',
      status: 'onHold'
    },
  ];

  // Add OT Schedule data
  const otSchedule = [
    {
      name: 'Rajesh Kumar M.',
      uhid: 'UHID: CN2089941421',
      age: '42 years',
      gender: 'Male',
      procedure: 'Total Knee Replacement',
      otNumber: 'OT-1',
      otType: 'Elective',
      time: 'Scheduled: 09:30 AM',
      anesthesia: 'Anesthesia: General',
      duration: 'Duration: 2.5 hrs',
      team: 'Team: Dr. Santhosh, Dr. Priya',
      preOpStatus: 'Pre-op Status: Completed',
      buttons: ['View Details', 'Pre-op Checklist']
    },
    {
      name: 'Meena S.',
      uhid: 'UHID: CN2089941422',
      age: '35 years',
      gender: 'Female',
      procedure: 'Laparoscopic Cholecystectomy',
      otNumber: 'OT-2',
      otType: 'Elective',
      time: 'Started: 10:05 AM',
      anesthesia: 'Anesthesia: General',
      duration: 'Duration: 1.5 hrs',
      team: 'Team: Dr. Santhosh, Dr. Rajesh',
      preOpStatus: 'Pre-op Status: N/A',
      buttons: ['View Details']
    },
    {
      name: 'Abdul Karim',
      uhid: 'UHID: CN2089941423',
      age: '55 years',
      gender: 'Male',
      procedure: 'Emergency Appendectomy',
      otNumber: 'OT-3',
      otType: 'Emergency',
      time: 'Scheduled: 11:30 AM',
      anesthesia: 'Anesthesia: General',
      duration: 'Duration: 1 hr',
      team: 'Team: Dr. Santhosh, Dr. Rajesh',
      preOpStatus: 'Pre-op Status: Pending',
      buttons: ['View Details', 'Pre-op Checklist']
    }
  ];

  const showChecklist = (patient, initialTab = 'details') => {
    setSelectedPatient(patient);
    setChecklistVisible(true);
    setInitialModalTab(initialTab);
  };

  const hideChecklist = () => {
    setChecklistVisible(false);
    setSelectedPatient(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialCommunityIcons name="chevron-left" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Schedule</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="magnify" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.quickGlanceRow}>
        <Text style={styles.sectionTitle}>Quick Glance</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => handleDateChange('back')}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.dateText}>
            {formatDate(selectedDate)}, {selectedDate.toLocaleDateString('en-US', { month: 'short' })}
          </Text>
          <TouchableOpacity onPress={() => handleDateChange('forward')}>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scheduleTypeContainer}>
        <TouchableOpacity 
          style={[
            styles.scheduleTypeButton,
            activeTab === 'Out - Patients' && styles.activeScheduleTypeButton
          ]}
          onPress={() => setActiveTab('Out - Patients')}
        >
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
          <Text style={[
            styles.scheduleTypeText,
            activeTab === 'OT Schedule' && styles.activeScheduleTypeText
          ]}>OT Schedule</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'Out - Patients' ? (
          appointments.map((appointment, index) => (
            <Card key={index} style={styles.appointmentCard}>
              <Card.Content>
                <PatientCard patient={appointment} />
              </Card.Content>
            </Card>
          ))
        ) : activeTab === 'In - Patients' ? (
          appointments.map((appointment, index) => (
            <Card key={index} style={styles.appointmentCard}>
              <Card.Content>
                <PatientCard patient={appointment} />
              </Card.Content>
            </Card>
          ))
        ) : (
          otSchedule.map((surgery, index) => (
            <Card key={index} style={styles.surgeryCard}>
              <Card.Content>
                <OTScheduleCard surgery={surgery} />
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <PreOpChecklistModal
        visible={checklistVisible}
        hideModal={hideChecklist}
        patient={selectedPatient}
        initialTab={initialModalTab}
      />
    </SafeAreaView>
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
    marginBottom: height * 0.02,
    gap: width * 0.03,
  },
  scheduleTypeButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  activeScheduleTypeButton: {
    backgroundColor: theme.colors.primary,
  },
  scheduleTypeText: {
    ...typography.regular,
    fontSize: width * 0.038,
    color: '#666',
  },
  activeScheduleTypeText: {
    ...typography.regular,
    fontSize: width * 0.038,
    color: '#fff',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.012,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  patientMainInfo: {
    marginBottom: height * 0.01,
  },
  nameAndTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    fontSize: width * 0.042,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  appointmentTime: {
    fontSize: width * 0.038,
    fontFamily: 'Poppins-Medium',
    color: theme.colors.primary,
  },
  patientSubInfo: {
    marginTop: 2,
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
    marginTop: 2,
  },
  consultInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: height * 0.01,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    gap: width * 0.02,
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
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.012,
    elevation: 2,
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
    marginTop: height * 0.01,
  },
  procedureTitle: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  procedureDetails: {
    fontSize: width * 0.035,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    marginTop: height * 0.004,
  },
  teamSection: {
    marginTop: height * 0.01,
  },
  teamText: {
    fontSize: width * 0.035,
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
}); 