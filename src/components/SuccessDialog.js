import React from 'react';
import { Modal } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { Dialog, Button, Text } from 'react-native-paper';
import { theme } from '../utils/theme';

export default function SuccessDialog({ visible, message, onDismiss }) {
  return (
    <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Dialog.Icon icon="check-circle" size={40} color={theme.colors.success} />
        <Text variant="headlineMedium" style={styles.title}>Success!</Text>
        <Text style={styles.message}>{message}</Text>
        <Button 
          onPress={onDismiss}
          mode="contained"
          style={styles.button}
          labelStyle={{ color: theme.colors.buttonText }}
        >
          OK
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginVertical: 10,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 30,
  }
}); 