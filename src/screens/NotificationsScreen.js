import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, Card, Title, IconButton } from 'react-native-paper';

export default function NotificationsScreen({ navigation }) {
  const notifications = [
    {
      id: '1',
      title: 'New Document Review Required',
      description: 'ABC Insurance MoU needs your review',
      type: 'review',
      date: '2024-03-20',
      read: false,
    },
    {
      id: '2',
      title: 'MoU Expiring Soon',
      description: 'XYZ Healthcare MoU expires in 30 days',
      type: 'expiry',
      date: '2024-03-19',
      read: true,
    },
    {
      id: '3',
      title: 'Approval Required',
      description: 'Final approval needed for DEF Insurance proposal',
      type: 'approval',
      date: '2024-03-18',
      read: false,
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'review': return 'file-document-edit';
      case 'expiry': return 'clock-alert';
      case 'approval': return 'checkbox-marked-circle';
      default: return 'bell';
    }
  };

  const handleNotificationPress = (notification) => {
    switch (notification.type) {
      case 'review':
        navigation.navigate('DocumentReview');
        break;
      case 'expiry':
        navigation.navigate('TariffRenewal');
        break;
      case 'approval':
        navigation.navigate('FinalApproval');
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Notifications</Title>
          <List.Section>
            {notifications.map((notification) => (
              <List.Item
                key={notification.id}
                title={notification.title}
                description={notification.description}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={getIcon(notification.type)}
                    color={notification.read ? '#666' : '#2c3e50'}
                  />
                )}
                right={props => (
                  <IconButton
                    {...props}
                    icon="chevron-right"
                    onPress={() => handleNotificationPress(notification)}
                  />
                )}
                style={[
                  styles.notification,
                  !notification.read && styles.unread
                ]}
                onPress={() => handleNotificationPress(notification)}
              />
            ))}
          </List.Section>
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
  notification: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  unread: {
    backgroundColor: '#f0f8ff',
  },
}); 