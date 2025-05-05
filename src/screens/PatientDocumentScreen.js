import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import { theme } from '../utils/theme'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { typography } from '../utils/typography';
import { Table, Row, Rows } from 'react-native-table-component';

const { width, height } = Dimensions.get('window');
const PatientDocumentScreen = ({ patient, setPatientDocuments ,activeTab}) => {
  const tableHead = ['File Name', 'Category', 'Date', 'Action'];
  const tableData = [
    [
      <View style={styles.row}>
        <MaterialCommunityIcons name="image" size={24} color={theme.colors.primary} />
        <Text style={styles.cell}>Chest X-ray</Text>
      </View>,
      'Radiology',
      'Mar 12, 2023',
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons name="cloud-download" size={24} color={theme.colors.primary} />
      </View>

    ],
    [
      <View style={styles.row}>
        <MaterialCommunityIcons name="file" size={24} color={theme.colors.primary} />
        <Text style={styles.cell}>Blood work result</Text>
      </View>,
      'Lab Result',
      'Mar 12, 2023',
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons name="cloud-download" size={24} color={theme.colors.primary} />
      </View>
    ]
  ];
  console.log(patient)
  console.log(activeTab)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setPatientDocuments(null)}>
          <MaterialCommunityIcons name="chevron-left" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{activeTab === 'Out - Patients' ?patient.PATIENT_NAME:patient.PatientName} {'\n'} Files & Documents</Text>
          <Text style={styles.uhidText}>{activeTab === 'Out - Patients' ?patient.UHID:patient.Uhid} | {activeTab === 'Out - Patients' ?patient.AGE:patient.Age} Years | {activeTab === 'Out - Patients' ?patient.Sex:patient.Gender}</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="filter" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <Table borderStyle={{ backgroundColor:'#fff' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
    </View>
  )
}

export default PatientDocumentScreen

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
    marginTop: 30
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerTitle: {
    ...typography.h2,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  uhidText: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    textAlign:'center',
    marginTop: 2,
  },
  head: { height: 40, },
  text: { margin: 2, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { flex: 1, justifyContent: 'center', padding: 8 }
})
