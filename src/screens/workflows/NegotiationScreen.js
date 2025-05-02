import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, TextInput, Button, List, Chip, DataTable } from 'react-native-paper';
import { theme } from '../../utils/theme';
import SuccessDialog from '../../components/SuccessDialog';

export default function NegotiationScreen({ navigation }) {
  const [negotiation, setNegotiation] = useState({
    insuranceCompany: '',
    proposedAmount: '',
    counterAmount: '',
    finalAmount: '',
    status: 'pending',
    comments: '',
  });

  const [negotiations, setNegotiations] = useState([
    {
      id: '1',
      date: '2024-03-20',
      proposedAmount: '1000000',
      counterAmount: '800000',
      status: 'inProgress'
    },
    {
      id: '2',
      date: '2024-03-18',
      proposedAmount: '750000',
      counterAmount: '600000',
      status: 'rejected'
    }
  ]);

  const [showSuccess, setShowSuccess] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      case 'inProgress': return 'orange';
      default: return 'gray';
    }
  };

  const handleUpdateStatus = (newStatus) => {
    setNegotiation({...negotiation, status: newStatus});
    if (newStatus === 'accepted') {
      navigation.navigate('MouDocument', { negotiationData: negotiation });
    }
  };

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleSuccessDismiss = () => {
    setShowSuccess(false);
    navigation.navigate('Dashboard');
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Current Negotiation</Title>
            
            <TextInput
              label="Insurance Company"
              value={negotiation.insuranceCompany}
              onChangeText={text => setNegotiation({...negotiation, insuranceCompany: text})}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Proposed Amount"
              value={negotiation.proposedAmount}
              onChangeText={text => setNegotiation({...negotiation, proposedAmount: text})}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Counter Amount"
              value={negotiation.counterAmount}
              onChangeText={text => setNegotiation({...negotiation, counterAmount: text})}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Final Agreed Amount"
              value={negotiation.finalAmount}
              onChangeText={text => setNegotiation({...negotiation, finalAmount: text})}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Comments"
              value={negotiation.comments}
              onChangeText={text => setNegotiation({...negotiation, comments: text})}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <View style={styles.statusButtons}>
              <Button
                mode="contained"
                onPress={() => handleUpdateStatus('accepted')}
                style={[styles.statusButton, { backgroundColor: theme.colors.success }]}
                labelStyle={{ color: theme.colors.buttonText }}
              >
                Accept
              </Button>
              <Button
                mode="contained"
                onPress={() => handleUpdateStatus('rejected')}
                style={[styles.statusButton, { backgroundColor: theme.colors.error }]}
                labelStyle={{ color: theme.colors.buttonText }}
              >
                Reject
              </Button>
              <Button
                mode="contained"
                onPress={() => handleUpdateStatus('inProgress')}
                style={[styles.statusButton, { backgroundColor: theme.colors.warning }]}
                labelStyle={{ color: theme.colors.buttonText }}
              >
                In Progress
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Negotiation History</Title>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title numeric>Proposed</DataTable.Title>
                <DataTable.Title numeric>Counter</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
              </DataTable.Header>

              {negotiations.map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>{item.date}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.proposedAmount}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.counterAmount}</DataTable.Cell>
                  <DataTable.Cell>
                    <Chip
                      textStyle={{ color: 'white' }}
                      style={{ backgroundColor: getStatusColor(item.status) }}
                    >
                      {item.status}
                    </Chip>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>
      </ScrollView>
      <SuccessDialog
        visible={showSuccess}
        message="Negotiation details have been successfully submitted!"
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
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
  }
}); 