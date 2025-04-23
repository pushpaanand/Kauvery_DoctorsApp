import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, TextInput, Button, List, Chip, DataTable, Surface, Portal } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '../../utils/theme';
import SuccessDialog from '../../components/SuccessDialog';

export default function TariffRenewalScreen({ navigation }) {
  const [renewal, setRenewal] = useState({
    insuranceCompany: '',
    currentDiscount: '',
    proposedDiscount: '',
    currentCommitment: '',
    proposedCommitment: '',
    remarks: '',
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
            <Title>Tariff Renewal</Title>
            
            <TextInput
              label="Insurance Company"
              value={renewal.insuranceCompany}
              onChangeText={text => setRenewal({...renewal, insuranceCompany: text})}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.rowContainer}>
              <TextInput
                label="Current Discount (%)"
                value={renewal.currentDiscount}
                onChangeText={text => setRenewal({...renewal, currentDiscount: text})}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />

              <TextInput
                label="Proposed Discount (%)"
                value={renewal.proposedDiscount}
                onChangeText={text => setRenewal({...renewal, proposedDiscount: text})}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />
            </View>

            <View style={styles.rowContainer}>
              <TextInput
                label="Current Commitment"
                value={renewal.currentCommitment}
                onChangeText={text => setRenewal({...renewal, currentCommitment: text})}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />

              <TextInput
                label="Proposed Commitment"
                value={renewal.proposedCommitment}
                onChangeText={text => setRenewal({...renewal, proposedCommitment: text})}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfWidth]}
              />
            </View>

            <TextInput
              label="Remarks"
              value={renewal.remarks}
              onChangeText={text => setRenewal({...renewal, remarks: text})}
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
              Attach Documents
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
              Submit Renewal
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
      <SuccessDialog
        visible={showSuccess}
        message="Tariff renewal has been successfully submitted!"
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
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.background,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  button: {
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
}); 