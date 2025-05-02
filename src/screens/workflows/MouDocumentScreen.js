import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, TextInput, Button, List } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '../../utils/theme';
import SuccessDialog from '../../components/SuccessDialog';

export default function MouDocumentScreen({ route, navigation }) {
  const negotiationData = route.params?.negotiationData;
  
  const [mouDetails, setMouDetails] = useState({
    insuranceCompany: negotiationData?.insuranceCompany || '',
    startDate: '',
    endDate: '',
    discountPercentage: '',
    commitmentAmount: negotiationData?.finalAmount || '',
    exclusions: '',
    specialTerms: '',
  });

  const [attachments, setAttachments] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleSuccessDismiss = () => {
    setShowSuccess(false);
    navigation.navigate('Dashboard');
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        multiple: true
      });

      if (!result.canceled) {
        setAttachments([...attachments, ...result.assets]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>MoU Document Details</Title>
            
            <TextInput
              label="Insurance Company"
              value={mouDetails.insuranceCompany}
              onChangeText={text => setMouDetails({...mouDetails, insuranceCompany: text})}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Start Date"
              value={mouDetails.startDate}
              onChangeText={text => setMouDetails({...mouDetails, startDate: text})}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="End Date"
              value={mouDetails.endDate}
              onChangeText={text => setMouDetails({...mouDetails, endDate: text})}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Discount Percentage"
              value={mouDetails.discountPercentage}
              onChangeText={text => setMouDetails({...mouDetails, discountPercentage: text})}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Commitment Amount"
              value={mouDetails.commitmentAmount}
              onChangeText={text => setMouDetails({...mouDetails, commitmentAmount: text})}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Exclusions"
              value={mouDetails.exclusions}
              onChangeText={text => setMouDetails({...mouDetails, exclusions: text})}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <TextInput
              label="Special Terms & Conditions"
              value={mouDetails.specialTerms}
              onChangeText={text => setMouDetails({...mouDetails, specialTerms: text})}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={pickDocument}
              icon="file-upload"
              style={styles.button}
              labelStyle={{ color: theme.colors.buttonText }}
            >
              Attach MoU Documents
            </Button>

            {attachments.length > 0 && (
              <List.Section>
                <List.Subheader>Attached Documents</List.Subheader>
                {attachments.map((doc, index) => (
                  <List.Item
                    key={index}
                    title={doc.name}
                    left={props => <List.Icon {...props} icon="file-document" />}
                    right={props => (
                      <Button
                        {...props}
                        onPress={() => {
                          const newDocs = [...attachments];
                          newDocs.splice(index, 1);
                          setAttachments(newDocs);
                        }}
                        icon="delete"
                      />
                    )}
                  />
                ))}
              </List.Section>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              labelStyle={{ color: theme.colors.buttonText }}
            >
              Submit MoU
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
      <SuccessDialog
        visible={showSuccess}
        message="MoU Document has been successfully submitted!"
        onDismiss={handleSuccessDismiss}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: 16,
    elevation: 4,
    backgroundColor: theme.colors.surface,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.background,
  },
  button: {
    marginVertical: 8,
    backgroundColor: theme.colors.primary,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
  }
}); 