import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, TextInput, Button, List, Chip, Divider, Text, Snackbar } from 'react-native-paper';
import { sendNotification } from '../../utils/notifications';
import SuccessDialog from '../../components/SuccessDialog';
import { theme } from '../../utils/theme';

export default function DocumentReviewScreen({ route, navigation }) {
  const { type = 'proposal', data = {} } = route.params || {};
  
  const [review, setReview] = useState({
    status: 'pending',
    comments: '',
    reviewDate: new Date().toISOString().split('T')[0],
  });

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleApprove = () => {
    setShowSuccess(true);
  };

  const handleSuccessDismiss = () => {
    setShowSuccess(false);
    navigation.navigate('ReviewerDashboard');
  };

  const renderDetails = () => {
    const details = data.details || {};
    
    switch (type) {
      case 'proposal':
        return (
          <List.Section>
            <List.Subheader>Proposal Details</List.Subheader>
            <List.Item title="Proposed Discount" description={details.proposedDiscount || 'N/A'} />
            <List.Item title="Coverage Type" description={details.coverageType || 'N/A'} />
            <List.Item title="Unit Name" description={details.unitName || 'N/A'} />
            <List.Item title="Expected Volume" description={details.expectedVolume || 'N/A'} />
            {details.attachments && (
              <List.Section>
                <List.Subheader>Attachments</List.Subheader>
                {details.attachments.map((file, index) => (
                  <List.Item
                    key={index}
                    title={file}
                    left={props => <List.Icon {...props} icon="file-document" />}
                    onPress={() => handleViewDocument(file)}
                  />
                ))}
              </List.Section>
            )}
          </List.Section>
        );

      case 'negotiation':
        return (
          <List.Section>
            <List.Subheader>Negotiation Details</List.Subheader>
            <List.Item title="Current Rate" description={details.currentRate || 'N/A'} />
            <List.Item title="Proposed Rate" description={details.proposedRate || 'N/A'} />
            <List.Item title="Counter Offer" description={details.counterOffer || 'N/A'} />
            <List.Item title="Validity Period" description={details.validityPeriod || 'N/A'} />
            <List.Item title="Negotiation Rounds" description={details.negotiationRounds?.toString() || 'N/A'} />
          </List.Section>
        );

      case 'mou':
        return (
          <List.Section>
            <List.Subheader>MoU Details</List.Subheader>
            <List.Item title="Start Date" description={details.startDate || 'N/A'} />
            <List.Item title="End Date" description={details.endDate || 'N/A'} />
            <List.Item title="Discount Rate" description={details.discountRate || 'N/A'} />
            <List.Item title="Special Terms" description={details.specialTerms || 'N/A'} />
            {details.attachments && (
              <List.Section>
                <List.Subheader>Attachments</List.Subheader>
                {details.attachments.map((file, index) => (
                  <List.Item
                    key={index}
                    title={file}
                    left={props => <List.Icon {...props} icon="file-document" />}
                    onPress={() => handleViewDocument(file)}
                  />
                ))}
              </List.Section>
            )}
          </List.Section>
        );

      case 'tariff':
        return (
          <List.Section>
            <List.Subheader>Tariff Details</List.Subheader>
            <List.Item title="Current Tariff" description={details.currentTariff || 'N/A'} />
            <List.Item title="Proposed Tariff" description={details.proposedTariff || 'N/A'} />
            <List.Item title="Effective Date" description={details.effectiveDate || 'N/A'} />
            {details.changes && (
              <List.Accordion title="Changes">
                {details.changes.map((change, index) => (
                  <List.Item key={index} title={change} />
                ))}
              </List.Accordion>
            )}
          </List.Section>
        );

      default:
        return null;
    }
  };

  const handleReview = (status) => {
    setReview({ ...review, status });

    // Send notification based on status
    if (status === 'approved') {
      // Show success message and notify approver
      setSnackbar({
        visible: true,
        message: 'Document successfully sent to approver'
      });

      // TODO: Send notification to approver
      // sendNotification('approver', {
      //   title: 'New Document for Approval',
      //   message: `${data.title} needs your approval`,
      //   data: { documentId: data.id }
      // });

      // Navigate back after delay
      setTimeout(() => {
        navigation.navigate('ReviewerDashboard');
      }, 2000);

    } else if (status === 'rejected') {
      // Show rejection message and notify initiator
      setSnackbar({
        visible: true,
        message: 'Document rejected. Initiator will be notified.'
      });

      // TODO: Send notification to initiator
      // sendNotification('initiator', {
      //   title: 'Document Rejected',
      //   message: `${data.title} was rejected. Please check comments.`,
      //   data: { documentId: data.id, comments: review.comments }
      // });

      // Navigate back after delay
      setTimeout(() => {
        navigation.navigate('ReviewerDashboard');
      }, 2000);
    }
  };

  const handleViewDocument = (file) => {
    // TODO: Implement document viewing functionality
    console.log('Viewing document:', file);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>{data.title || 'Document Review'}</Title>
            <Text style={styles.subtitle}>{data.company} - Submitted: {data.submittedDate}</Text>

            {renderDetails()}

            <Divider style={styles.divider} />

            <TextInput
              label="Review Comments"
              value={review.comments}
              onChangeText={text => setReview({...review, comments: text})}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />

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
        message="Document has been successfully reviewed and approved!"
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
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