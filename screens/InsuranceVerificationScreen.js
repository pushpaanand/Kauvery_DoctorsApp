import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Title, TextInput, List, Divider, Portal, Dialog, Text, RadioButton } from 'react-native-paper';

export default function InsuranceVerificationScreen({ navigation }) {
  const [step, setStep] = useState('initial');
  const [patientData, setPatientData] = useState({
    patientId: '',
    visitType: '',
    insuranceType: '',
    preAuthRequired: null,
    documents: [],
  });

  const handlePreAuthCheck = () => {
    if (patientData.visitType === 'emergency') {
      setStep('emergency_admission');
    } else {
      setStep('check_insurance_type');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'initial':
        return (
          <>
            <Title>Patient Visit Information</Title>
            <TextInput
              label="Patient ID"
              value={patientData.patientId}
              onChangeText={text => setPatientData({...patientData, patientId: text})}
              style={styles.input}
              mode="outlined"
            />
            
            <Title style={styles.subtitle}>Visit Type</Title>
            <RadioButton.Group
              onValueChange={value => setPatientData({...patientData, visitType: value})}
              value={patientData.visitType}
            >
              <RadioButton.Item label="Emergency" value="emergency" />
              <RadioButton.Item label="Planned Admission" value="planned" />
              <RadioButton.Item label="Outpatient" value="outpatient" />
            </RadioButton.Group>

            <Button
              mode="contained"
              onPress={handlePreAuthCheck}
              style={styles.button}
            >
              Continue
            </Button>
          </>
        );

      case 'check_insurance_type':
        return (
          <>
            <Title>Insurance Type Verification</Title>
            <RadioButton.Group
              onValueChange={value => {
                setPatientData({...patientData, insuranceType: value});
                setStep('pre_auth_check');
              }}
              value={patientData.insuranceType}
            >
              <RadioButton.Item label="Government Insurance" value="government" />
              <RadioButton.Item label="Private Insurance" value="private" />
              <RadioButton.Item label="Corporate Insurance" value="corporate" />
            </RadioButton.Group>
          </>
        );

      case 'pre_auth_check':
        return (
          <>
            <Title>Pre-Authorization Check</Title>
            <List.Section>
              <List.Item
                title="Check Pre-Authorization Requirements"
                description="Based on insurance type and procedure"
                left={props => <List.Icon {...props} icon="clipboard-check" />}
              />
              <RadioButton.Group
                onValueChange={value => {
                  setPatientData({...patientData, preAuthRequired: value === 'yes'});
                  setStep(value === 'yes' ? 'pre_auth_process' : 'admission_process');
                }}
                value={patientData.preAuthRequired ? 'yes' : 'no'}
              >
                <RadioButton.Item label="Pre-Authorization Required" value="yes" />
                <RadioButton.Item label="No Pre-Authorization Needed" value="no" />
              </RadioButton.Group>
            </List.Section>
          </>
        );

      case 'pre_auth_process':
        return (
          <>
            <Title>Pre-Authorization Process</Title>
            <List.Section>
              <List.Item
                title="Submit Required Documents"
                description="Medical records, test results, etc."
                left={props => <List.Icon {...props} icon="file-document" />}
              />
              <List.Item
                title="Contact Insurance Provider"
                description="Submit pre-authorization request"
                left={props => <List.Icon {...props} icon="phone" />}
              />
              <Button
                mode="contained"
                onPress={() => setStep('waiting_approval')}
                style={styles.button}
              >
                Submit Pre-Authorization
              </Button>
            </List.Section>
          </>
        );

      case 'waiting_approval':
        return (
          <>
            <Title>Approval Status</Title>
            <List.Section>
              <List.Item
                title="Waiting for Insurance Approval"
                description="Track approval status"
                left={props => <List.Icon {...props} icon="clock-outline" />}
              />
              <Button
                mode="contained"
                onPress={() => setStep('admission_process')}
                style={styles.button}
              >
                Check Status
              </Button>
            </List.Section>
          </>
        );

      case 'admission_process':
        return (
          <>
            <Title>Admission Process</Title>
            <List.Section>
              <List.Item
                title="Insurance Coverage Confirmed"
                description="Ready for admission"
                left={props => <List.Icon {...props} icon="check-circle" />}
              />
              <Button
                mode="contained"
                onPress={() => navigation.navigate('PatientRegistration')}
                style={styles.button}
              >
                Proceed to Admission
              </Button>
            </List.Section>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {renderStepContent()}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
}); 