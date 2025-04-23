import React from 'react';
import { IconButton } from 'react-native-paper';
import { theme } from '../utils/theme';

export default function LogoutButton({ navigation }) {
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <IconButton
      icon="logout"
      iconColor={theme.colors.primary}
      size={24}
      onPress={handleLogout}
    />
  );
} 