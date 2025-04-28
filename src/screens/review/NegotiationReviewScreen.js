import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, TextInput, Button, List, Divider, Text, DataTable, Snackbar } from 'react-native-paper';
import { sendNotification } from '../../utils/notifications';
import SuccessDialog from '../../components/SuccessDialog';
import { theme } from '../../utils/theme';

export default function NegotiationReviewScreen({ route, navigation }) {
  const { negotiationData = {} } = route.params || {};
  
  const [review, setReview] = useState({
    status: 'pending',
    comments: '',
    reviewDate: new Date().toISOString().split('T')[0],
    recommendedAmount: '',
  });

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleReview = (status) => {
    setReview({ ...review, status });

    if (status === 'approved') {
      // Show success message and notify approver
      setSnackbar({
        visible: true,
        message: 'Negotiation successfully sent to approver'
      });

      // TODO: Send notification to approver
      // sendNotification('approver', {
      //   title: 'New Negotiation for Approval',
      //   message: `${negotiationData.title} needs your approval`,
      //   data: { 
      //     negotiationId: negotiationData.id,
      //     recommendedAmount: review.recommendedAmount 
      //   }
      // });

      // Navigate back after delay
      setTimeout(() => {
        navigation.navigate('ReviewerDashboard');
      }, 2000);

    } else if (status === 'rejected') {
      // Show rejection message and notify initiator
      setSnackbar({
        visible: true,
        message: 'Negotiation rejected. Initiator will be notified.'
      });

      // TODO: Send notification to initiator
      // sendNotification('initiator', {
      //   title: 'Negotiation Rejected',
      //   message: `${negotiationData.title} was rejected. Please check comments.`,
      //   data: { 
      //     negotiationId: negotiationData.id, 
      //     comments: review.comments 
      //   }
      // });

      // Navigate back after delay
      setTimeout(() => {
        navigation.navigate('ReviewerDashboard');
      }, 2000);
    }
  };

  const handleApprove = () => {
    setShowSuccess(true);
  };

  const handleSuccessDismiss = () => {
    setShowSuccess(false);
    navigation.navigate('ReviewerDashboard');
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Negotiation Review</Title>

            <List.Section>
              <List.Subheader>Negotiation Details</List.Subheader>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Item</DataTable.Title>
                  <DataTable.Title numeric>Amount</DataTable.Title>
                </DataTable.Header>

                <DataTable.Row>
                  <DataTable.Cell>Proposed Amount</DataTable.Cell>
                  <DataTable.Cell numeric>{negotiationData?.proposedAmount || 'N/A'}</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>Counter Amount</DataTable.Cell>
                  <DataTable.Cell numeric>{negotiationData?.counterAmount || 'N/A'}</DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell>Final Amount</DataTable.Cell>
                  <DataTable.Cell numeric>{negotiationData?.finalAmount || 'N/A'}</DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </List.Section>

            <Divider style={styles.divider} />

            <TextInput
              label="Recommended Amount"
              value={review.recommendedAmount}
              onChangeText={text => setReview({...review, recommendedAmount: text})}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Review Comments"
              value={review.comments}
              onChangeText={text => setReview({...review, comments: text})}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <List.Section>
              <List.Subheader>Additional Information</List.Subheader>
              <List.Item
                title="Insurance Company"
                description={negotiationData?.insuranceCompany || 'N/A'}
              />
              <List.Item
                title="Negotiation Comments"
                description={negotiationData?.comments || 'N/A'}
              />
            </List.Section>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleApprove}
                style={styles.approveButton}
                labelStyle={{ color: theme.colors.buttonText }}
              >
                Approve
              </Button>
              
              <Button
                mode="contained"
                onPress={() => handleReview('rejected')}
                style={[styles.button, { backgroundColor: 'red' }]}
              >
                Reject
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={2000}
        action={{
          label: 'OK',
          onPress: () => setSnackbar({ ...snackbar, visible: false }),
        }}
      >
        {snackbar.message}
      </Snackbar>

      <SuccessDialog
        visible={showSuccess}
        message="Negotiation has been successfully reviewed and approved!"
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
    backgroundColor: '#ffffff',
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
  },
  detailsSurface: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginVertical: 8,
  },
  approveButton: {
    backgroundColor: theme.colors.success,
  },
}); 