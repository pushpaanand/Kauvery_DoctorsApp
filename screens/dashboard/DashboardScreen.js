import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Button, Text, List } from 'react-native-paper';
import { theme } from '../../utils/theme';

export default function DashboardScreen({ navigation }) {
  const mouStats = {
    activeMous: 25,
    expiringMous: 5,
    pendingReviews: 3,
    pendingApprovals: 2,
  };

  // Mock data for expiring MoUs
  const expiringMousList = [
    {
      id: '1',
      company: 'ABC Insurance',
      expiryDays: 30,
    },
    {
      id: '2',
      company: 'XYZ Healthcare',
      expiryDays: 45,
    }
  ];

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('NewProposal')}
        style={styles.actionButton}
        labelStyle={{ color: theme.colors.buttonText }}
      >
        New Proposal
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Negotiation')}
        style={styles.actionButton}
        labelStyle={{ color: theme.colors.buttonText }}
      >
        Negotiation
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('MouDocument')}
        style={styles.actionButton}
        labelStyle={{ color: theme.colors.buttonText }}
      >
        MoU Document
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('TariffRenewal')}
        style={styles.actionButton}
        labelStyle={{ color: theme.colors.buttonText }}
      >
        Tariff Renewal
      </Button>
    </View>
  );

  const renderStats = () => (
    <View style={styles.countsContainer}>
      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{mouStats.activeMous}</Title>
          <Text style={styles.countLabel}>Active MoUs</Text>
        </Card.Content>
      </Card>
      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{mouStats.expiringMous}</Title>
          <Text style={styles.countLabel}>Expiring Soon</Text>
        </Card.Content>
      </Card>
      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{mouStats.pendingReviews}</Title>
          <Text style={styles.countLabel}>Pending Reviews</Text>
        </Card.Content>
      </Card>
      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{mouStats.pendingApprovals}</Title>
          <Text style={styles.countLabel}>Pending Approvals</Text>
        </Card.Content>
      </Card>
    </View>
  );

  const renderExpiringMous = () => (
    <Card style={styles.expiringCard}>
      <Card.Content>
        <Title style={styles.cardTitle}>Expiring MoUs</Title>
        <List.Section>
          {expiringMousList.map((mou) => (
            <List.Item
              key={mou.id}
              title={mou.company}
              description={`Expires in ${mou.expiryDays} days`}
              left={props => <List.Icon {...props} icon="clock-alert" color={theme.colors.warning} />}
              onPress={() => navigation.navigate('TariffRenewal')}
              style={styles.listItem}
            />
          ))}
        </List.Section>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      {renderActionButtons()}
      {renderStats()}
      {renderExpiringMous()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  actionButtons: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: theme.colors.primary,
  },
  countsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  countCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    elevation: 4,
  },
  countNumber: {
    fontSize: 24,
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  countLabel: {
    textAlign: 'center',
    color: theme.colors.subtext,
  },
  expiringCard: {
    margin: 16,
    backgroundColor: theme.colors.surface,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 8,
  },
  listItem: {
    paddingVertical: 8,
  }
}); 