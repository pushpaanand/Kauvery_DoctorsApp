import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, TextInput, Button, List, Divider, Text, Surface, Snackbar } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import SignatureModal from '../../components/SignatureModal';
import SuccessDialog from '../../components/SuccessDialog';
import { theme } from '../../utils/theme';

export default function FinalApprovalScreen({ route, navigation }) {
  const { documentData = {}, type = '', reviewDetails = {} } = route.params || {};
  
  const [approval, setApproval] = useState({
    status: 'pending',
    comments: '',
    approvalDate: new Date().toISOString().split('T')[0],
    signature: null,
  });

  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState(null);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const renderDocumentDetails = () => {
    const details = documentData.details || {};
    
    return (
      <List.Section>
        <List.Subheader>Document Information</List.Subheader>
        <List.Item 
          title="Title"
          description={documentData.title || 'N/A'}
        />
        <List.Item 
          title="Company"
          description={documentData.company || 'N/A'}
        />
        <List.Item 
          title="Submission Date"
          description={documentData.submittedDate || 'N/A'}
        />
        
        <Divider style={styles.divider} />
        
        <List.Subheader>Review Information</List.Subheader>
        <List.Item 
          title="Reviewed By"
          description={documentData.reviewedBy || 'N/A'}
        />
        <List.Item 
          title="Review Date"
          description={documentData.reviewDate || 'N/A'}
        />
        <List.Item 
          title="Reviewer Comments"
          description={details.reviewerComments || 'No comments'}
        />

        {details.attachments && details.attachments.length > 0 && (
          <>
            <Divider style={styles.divider} />
            <List.Subheader>Attachments</List.Subheader>
            {details.attachments.map((file, index) => (
              <List.Item
                key={index}
                title={file}
                left={props => <List.Icon {...props} icon="file-document" />}
                onPress={() => handleViewDocument(file)}
              />
            ))}
          </>
        )}
      </List.Section>
    );
  };

  const handleSignatureSave = (signatureData) => {
    setSignature(signatureData);
    setShowSignature(false);
  };

  const handleApproval = (status) => {
    if (status === 'approved' && !signature) {
      setShowSignature(true);
      return;
    }

    setApproval(prev => ({ ...prev, status }));
    // TODO: Implement actual approval logic
    setShowSuccess(true);
  };

  const handleViewDocument = (file) => {
    // TODO: Implement document viewing functionality
    console.log('Viewing document:', file);
  };

  const handleSuccessDismiss = () => {
    setShowSuccess(false);
    navigation.navigate('ApproverDashboard');
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Final Approval</Title>
            
            {renderDocumentDetails()}

            <Divider style={styles.divider} />

            <TextInput
              label="Approval Comments"
              value={approval.comments}
              onChangeText={text => setApproval(prev => ({ ...prev, comments: text }))}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => handleApproval('approved')}
                style={[styles.button, { backgroundColor: 'green' }]}
                icon={signature ? 'check' : 'draw'}
              >
                {signature ? 'Approve & Sign' : 'Add Signature'}
              </Button>
              
              <Button
                mode="contained"
                onPress={() => handleApproval('rejected')}
                style={[styles.button, { backgroundColor: 'red' }]}
              >
                Reject
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <SignatureModal
        visible={showSignature}
        onClose={() => setShowSignature(false)}
        onSave={handleSignatureSave}
      />

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={2000}
      >
        {snackbar.message}
      </Snackbar>

      <SuccessDialog
        visible={showSuccess}
        message="Document has been successfully approved and signed!"
        onDismiss={handleSuccessDismiss}
      />
    </>
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
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  }
}); 