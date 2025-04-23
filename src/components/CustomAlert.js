import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from '../../utils/theme';

// Replace these with your website's theme colors and font
const themeColors = {
  primary: theme.colors.primary, // Example primary color
  textPrimary: '#333', // Example text color
  background: '#fff', // Example background color
  danger: '#e74c3c', // Example danger color
};

const typography = {
  fontFamily: 'Poppins-Regular', // Replace with your website's font
  fontSizeMedium: 16,
  fontSizeLarge: 18,
};

const { width, height } = Dimensions.get('window');

const CustomAlert = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>Confirm Logout</Text>
          <Text style={styles.message}>Are you sure you want to log out?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: width * 0.8,
    backgroundColor: themeColors.background,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSizeLarge,
    fontFamily: typography.fontFamily,
    color: themeColors.textPrimary,
    marginBottom: 10,
  },
  message: {
    fontSize: typography.fontSizeMedium,
    fontFamily: typography.fontFamily,
    color: themeColors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    backgroundColor: themeColors.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: themeColors.primary,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 10,
    backgroundColor: themeColors.primary,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.fontSizeMedium,
    fontFamily: typography.fontFamily,
    color: themeColors.primary,
  },
  confirmButtonText: {
    fontSize: typography.fontSizeMedium,
    fontFamily: typography.fontFamily,
    color: themeColors.background,
  },
});

export default CustomAlert; 