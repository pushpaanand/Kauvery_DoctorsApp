import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { typography } from '../utils/typography';
import { theme } from '../utils/theme';

const FeaturesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Screen1.png')} style={styles.image} />
      <Text style={styles.title}>Quick Actions at Your Fingertips</Text>
      <Text style={styles.description}>
        Stay on Top of Your Day with Instant Schedule Overview & Quick Patient History Access
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Next" onPress={() => navigation.navigate('NextScreen')} color="#8A2BE2" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    ...typography.h2,
    color: theme.colors.primary,
  },
  description: {
    ...typography.body,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default FeaturesScreen;