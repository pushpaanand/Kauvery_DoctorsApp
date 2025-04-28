import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Surface, List } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '../../utils/theme';

export default function NewProposalScreen({ navigation }) {
  const [proposal, setProposal] = useState({
    insuranceCompany: '',
    contactPerson: '',
    email: '',
    phone: '',
    proposedDiscount: '',
    remarks: '',
  });
  const [documents, setDocuments] = useState([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: true
      });

      if (!result.canceled) {
        setDocuments([...documents, ...result.assets]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleSubmit = () => {
    // Navigate back to dashboard
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>New Insurance Proposal</Title>

        <TextInput
          label="Insurance Company Name"
          value={proposal.insuranceCompany}
          onChangeText={text => setProposal({...proposal, insuranceCompany: text})}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Contact Person"
          value={proposal.contactPerson}
          onChangeText={text => setProposal({...proposal, contactPerson: text})}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={proposal.email}
          onChangeText={text => setProposal({...proposal, email: text})}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          label="Phone Number"
          value={proposal.phone}
          onChangeText={text => setProposal({...proposal, phone: text})}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="Proposed Discount (%)"
          value={proposal.proposedDiscount}
          onChangeText={text => setProposal({...proposal, proposedDiscount: text})}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Remarks"
          value={proposal.remarks}
          onChangeText={text => setProposal({...proposal, remarks: text})}
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

        {documents.length > 0 && (
          <List.Section>
            <List.Subheader>Attached Documents</List.Subheader>
            {documents.map((doc, index) => (
              <List.Item
                key={index}
                title={doc.name}
                left={props => <List.Icon {...props} icon="file-document" />}
                right={props => (
                  <Button
                    {...props}
                    onPress={() => {
                      const newDocs = [...documents];
                      newDocs.splice(index, 1);
                      setDocuments(newDocs);
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
          Submit Proposal
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  surface: {
    margin: 16,
    padding: 16,
    elevation: 4,
    borderRadius: 8,
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
  },
}); 