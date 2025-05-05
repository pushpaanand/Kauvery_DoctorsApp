import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../utils/theme';
import { typography } from '../../utils/typography';
import { useSelector } from 'react-redux';
import { patientService } from '../../api/services/patientService';

const { width, height } = Dimensions.get('window');

export default function InPatientsScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState('All Wards');
  const [inPatients, setInPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.auth.user);
  const doctorId = user?.['Doctor Id'];

  const wards = ['All Wards', 'ICU', 'General', 'Surgical', 'Pediatric'];
  useEffect(() => {
    const fetchInPatients = async () => {
      setLoading(true);
      try {
        const inPatientsData = await patientService.getInPatients(doctorId);
        setInPatients(inPatientsData);
        console.log('In Patients:', inPatientsData[0]);
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


  const handleWardSelect = (ward) => {
    setSelectedWard(ward);
    setSearchQuery(ward);
  };

  const renderSearchHeader = () => (
    <View style={styles.searchHeader}>
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => setShowSearch(false)}>
          <MaterialCommunityIcons name="chevron-left" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
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
              placeholder: '#999',
              text: '#333'
            }
          }}
          textAlignVertical="center"
          numberOfLines={1}
        />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.wardFilters}
        contentContainerStyle={styles.wardFiltersContent}
      >
        {wards.map((ward, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.wardChip,
              selectedWard === ward && styles.selectedWardChip
            ]}
            onPress={() => handleWardSelect(ward)}
          >
            <Text style={[
              styles.wardChipText,
              selectedWard === ward && styles.selectedWardChipText
            ]}>
              {ward}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {showSearch ? renderSearchHeader() : (
        <View style={styles.header}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="chevron-left" size={30} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>In-Patients</Text>
          <TouchableOpacity onPress={() => setShowSearch(true)}>
            <MaterialCommunityIcons name="magnify" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {inPatients.map((patient, index) => (
          <Card key={index} style={styles.patientCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.patientInfo}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.patientName}>{patient.PatientName}</Text>
                    {patient.status? patient.status === 'Critical' && (
                      <MaterialCommunityIcons name="alert-circle" size={16} color="#f44336" />
                    ) : (
                      // <MaterialCommunityIcons name="alert-circle" size={16} color="#f44336" />
                    ''
                    )}
                  </View>
                  <Text style={styles.patientDetails}>
                    {patient.Age} | {patient.Gender} | {patient.CaseType}
                  </Text>
                  <Text style={styles.uhidText}>UHID: {patient.Uhid? patient.Uhid: 'N/A'}</Text>
                </View>
                <View style={styles.roomInfo}>
                  <Text style={styles.roomNumber}>
                    {patient.roomNumber? patient.roomNumber: 'N/A'}
                  </Text>
                  {patient.status ? (
                  <Text style={[
                    styles.statusText,
                    patient.status === 'Critical' ? styles.criticalStatus : styles.stableStatus
                  ]}>
                    {patient.status}
                  </Text>
                  ) : (
                    ''
                  )}
                </View>
              </View>

              <View style={styles.separator} />

              <View style={styles.bottomSection}>
                <View style={styles.admittedInfo}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                  <Text style={styles.admittedText}>Admitted: {patient.AdmissionDate? patient.AdmissionDate: 'N/A'}</Text>
                </View>

                <TouchableOpacity style={styles.viewReportsButton}>
                  <Text style={styles.viewReportsText}>View Reports</Text>
                </TouchableOpacity>
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
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    ...typography.h2,
    color: theme.colors.primary,
  },
  patientCard: {
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.01,
    elevation: 3,
    borderRadius: width * 0.02,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: width * 0.04,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: height * 0.008,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: height * 0.015,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: height * 0.005,
  },
  patientInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  patientName: {
    fontFamily: 'Poppins-Medium',
    fontSize: Math.min(width * 0.045, 20),
    color: '#333',
  },
  patientDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.035, 16),
    color: '#666',
  },
  uhidText: {
    fontFamily: 'Poppins-Regular',
    fontSize: Math.min(width * 0.032, 14),
    color: '#666',
    marginTop: height * 0.002,
  },
  roomInfo: {
    alignItems: 'flex-end',
  },
  roomNumber: {
    ...typography.medium,
    color: theme.colors.primary,
  },
  statusText: {
    fontSize: width * 0.035,
    marginTop: 2,
  },
  criticalStatus: {
    color: '#f44336',
  },
  stableStatus: {
    color: '#4CAF50',
  },
  admittedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  admittedText: {
    fontSize: width * 0.035,
    color: '#666',
  },
  viewReportsButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.01,
  },
  viewReportsText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: '500',
  },
  searchHeader: {
    paddingVertical: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
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
  wardFilters: {
    marginTop: height * 0.015,
  },
  wardFiltersContent: {
    paddingHorizontal: width * 0.04,
    gap: width * 0.02,
  },
  wardChip: {
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.05,
    backgroundColor: '#f0f0f0',
  },
  selectedWardChip: {
    backgroundColor: theme.colors.primary,
  },
  wardChipText: {
    ...typography.regular,
    fontSize: width * 0.020,
    color: '#666',
  },
  selectedWardChipText: {
    ...typography.regular,
    color: '#fff',
  },
}); 
