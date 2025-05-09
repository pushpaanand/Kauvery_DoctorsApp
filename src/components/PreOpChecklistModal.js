import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Modal, Portal, Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { typography } from '../utils/typography';
import { theme } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const ChecklistItem = ({ title, date, status }) => (
  <View style={styles.checklistItem}>
    <View style={styles.itemLeft}>
      <MaterialCommunityIcons
        name={status === 'Completed' ? 'check-circle' : status === 'pending' ? 'clock-outline' : 'alert-circle'}
        size={20}
        color={status === 'Completed' ? '#4CAF50' : status === 'pending' ? '#FFA000' : '#F44336'}
      />
      <Text style={styles.itemTitle}>{title}</Text>
    </View>
    <Text style={styles.itemDate}>{date || 'Need Review'}</Text>
  </View>
);

export default function PreOpChecklistModal({ visible, hideModal, patient, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'details');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Pre-op Checklist</Text>
          <IconButton
            icon="close"
            iconColor={'#fff'}
            size={24}
            onPress={hideModal}
          />
        </View>

        {/* <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'checklist' && styles.activeTab]}
            onPress={() => setActiveTab('checklist')}
          >
            <Text style={[styles.tabText, activeTab === 'checklist' && styles.activeTabText]}>
              Pre-op Checklist
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'details' && styles.activeTab]}
            onPress={() => setActiveTab('details')}
          >
            <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
              Patient Details
            </Text>
          </TouchableOpacity>
        </View> */}

        <ScrollView style={styles.content}>
          {/* {activeTab === 'checklist' ? (
            // Pre-op Checklist View
            <>
              {checklistItems.map((item, index) => (
                <ChecklistItem
                  key={index}
                  title={item.title}
                  date={item.date}
                  status={item.status}
                />
              ))}
            </>
          ) : (
            // Patient Details View
            <>
              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Patient Information</Text>
                <View style={styles.detailsCard}>
                  {patientDetails.patientInfo.map((item, index) => (
                    <View key={index} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{item.label}</Text>
                      <Text style={styles.detailValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Medical History</Text>
                <View style={styles.detailsCard}>
                  {patientDetails.medicalHistory.map((item, index) => (
                    <View key={index} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{item.label}</Text>
                      <Text style={styles.detailValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Procedure Details</Text>
                <View style={styles.detailsCard}>
                  {patientDetails.procedureDetails.map((item, index) => (
                    <View key={index} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{item.label}</Text>
                      <Text style={styles.detailValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )} */}
          {patient.INVESTIGATION.sort((a, b) => a.Date.localeCompare(b.Date)).map((item, index) => (
            <ChecklistItem
              key={index}
              title={item.Name}
              date={item.Date}
              status={item.Status}
            />
          ))}

        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    margin: width * 0.05,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#B4236c',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalTitle: {
    ...typography.h2,
    color: '#fff',
    textAlign: 'center'
  },
  tabContainer: {
    flexDirection: 'row',
    padding: width * 0.04,
    gap: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    borderRadius: width * 0.01,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: width * 0.035,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    padding: width * 0.04,

  },
  checklistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  itemTitle: {
    ...typography.body,
    color: '#333',
    width: '70%'
  },
  itemDate: {
    fontSize: width * 0.035,
    color: '#666',
  },
  detailsSection: {
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.04,
    color: theme.colors.primary,
    fontWeight: '500',
    marginBottom: height * 0.01,
  },
  detailsCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: width * 0.01,
    padding: width * 0.04,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.008,
  },
  detailLabel: {
    ...typography.label,
    color: '#666',
  },
  detailValue: {
    fontSize: width * 0.035,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
}); 