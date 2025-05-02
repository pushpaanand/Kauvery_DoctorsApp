import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { Text, Searchbar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { useSelector } from 'react-redux';
import { patientService } from '../../api/services/patientService';

const { width, height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;

export default function PatientsScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [patients, setPatients] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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

  // React.useEffect(() => {
  //   const fetchPatients = async () => {
  //     try {
  // const patients = [
  //   {
  //     name: 'Arun Kumar S.',
  //     uhid: 'UHID: CN2089941421',
  //     age: '23 years',
  //     gender: 'Male',
  //     condition: 'Diabetes',
  //     lastVisit: '22 Oct 2024',
  //     nextVisit: '22 Nov 2024',
  //   },
  //   {
  //     name: 'Praveena V.K.',
  //     uhid: 'UHID: CN2089941422',
  //     age: '37 years',
  //     gender: 'Female',
  //     condition: 'Diabetes-II',
  //     lastVisit: '22 Oct 2024',
  //     nextVisit: '22 Nov 2024',
  //   },
  //   {
  //     name: 'Santhosh Ku.',
  //     uhid: 'UHID: CN2089941423',
  //     age: '39 years',
  //     gender: 'Male',
  //     condition: 'Diabetes III',
  //     lastVisit: '22 Oct 2024',
  //     nextVisit: '22 Nov 2024',
  //   },
  //   {
  //     name: 'Vikaram S.',
  //     uhid: 'UHID: CN2089941424',
  //     age: '28 years',
  //     gender: 'Male',
  //     condition: 'Diabetes',
  //     lastVisit: '22 Oct 2024',
  //     nextVisit: '22 Nov 2024',
  //   },
  // ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialCommunityIcons name="chevron-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patients</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search patients..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          placeholderTextColor="#999"
          selectionColor={theme.colors.primary}
          cursorColor={theme.colors.primary}
          icon={() => <MaterialCommunityIcons name="magnify" size={24} color="#999" />}
          theme={{
            colors: {
              text: '#333',
              placeholder: '#999',
            },
          }}
        />
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="filter-variant" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {patients.map((patient, index) => (
          <Card key={index} style={styles.patientCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.mainContent}>
                <View style={styles.topRow}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.patientName}>{patient.PATIENT_NAME}</Text>
                    <Text style={styles.uhidText}>UHID:{patient.UHID}</Text>
                  </View>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                      <MaterialCommunityIcons name="file-document-outline" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <MaterialCommunityIcons name="download-outline" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <MaterialCommunityIcons name="history" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.patientDetails}>
                  {/* {patient.AGE} | {patient.Sex} | {patient.condition} */}
                  {patient.AGE} Years | {patient.Sex} 
                </Text>
                <View style={styles.separator} />
                <View style={styles.visitsContainer}>
                  <View style={styles.visitRow}>
                    <Text style={styles.visitLabel}>Last Visit</Text>
                    <Text style={styles.visitDate}>{patient.lastVisit? patient.lastVisit: 'N/A'}</Text>
                  </View>
                  <View style={styles.visitRow}>
                    <Text style={styles.visitLabel}>Next Visit</Text>
                    <Text style={styles.visitDate}>{patient.nextVisit? patient.nextVisit: 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
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
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height: Platform.OS === 'ios' ? height * 0.06 : height * 0.07,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: Math.min(width * 0.045, 20),
    color: theme.colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
    backgroundColor: '#fff',
    gap: width * 0.02,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    elevation: 0,
    height: height * 0.055,
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: width * 0.035,
    height: height * 0.055,
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
    color: '#333',
    alignSelf: 'center',
    marginTop: 0,
  },
  filterButton: {
    padding: width * 0.02,
  },
  patientCard: {
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.008,
    borderRadius: width * 0.02,
    elevation: 1,
    backgroundColor: '#fff',
  },
  cardContent: {
    padding: width * 0.03,
  },
  mainContent: {
    gap: height * 0.008,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flex: 1,
  },
  patientName: {
    fontFamily: 'Poppins-Medium',
    fontSize: Math.min(width * 0.045, 20),
    color: '#333',
  },
  uhidText: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.032, 14),
    color: '#666',
    marginTop: height * 0.002,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  actionButton: {
    padding: width * 0.01,
  },
  patientDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.035, 16),
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: height * 0.015,
  },
  visitsContainer: {
    gap: height * 0.006,
    marginTop: height * 0.004,
  },
  visitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visitLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.032, 14),
    color: '#666',
  },
  visitDate: {
    fontFamily: 'Poppins-Medium',
    fontSize: Math.min(width * 0.032, 14),
    color: theme.colors.primary,
  },
}); 