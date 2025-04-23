import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Title, Text } from 'react-native-paper';

export default function MainScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Insurance Department Workflow</Title>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('InsuranceVerification')}
            >
              Insurance Verification
            </Button>
            
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('PatientRegistration')}
            >
              Patient Registration
            </Button>
            
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('ClaimProcessing')}
            >
              Claim Processing
            </Button>
          </View>
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
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    marginVertical: 8,
    paddingVertical: 8,
  },
}); 