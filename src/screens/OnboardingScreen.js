import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Welcome to DocEase!',
    subtitle: 'Where Care Meets Convenience',
    description: 'The digital companion for modern healthcare professionals',
    image: require('../assets/Screen1.png'),
  },
  {
    id: 2,
    title: 'Quick Actions at Your Fingertips',
    description: 'Stay on Top of Your Day with Instant Schedule Overview & Quick Patient History Access',
    image: require('../assets/Screen3.png'),
  },
  {
    id: 3,
    title: 'Never Miss Critical Updates',
    description: 'Real-time Access to Patient Lab Results, Critical Patient Updates, Investigation Reports',
    image: require('../assets/Screen3.png'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = () => {
    if (currentSlideIndex >= slides.length - 1) {
      handleSkip();
    } else {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.slideContainer}>
        <Image source={slides[currentSlideIndex].image} style={styles.image} />
        <Text style={styles.title}>{slides[currentSlideIndex].title}</Text>
        {slides[currentSlideIndex].subtitle && (
          <Text style={styles.subtitle}>{slides[currentSlideIndex].subtitle}</Text>
        )}
        <Text style={styles.description}>{slides[currentSlideIndex].description}</Text>
      </View>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentSlideIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {currentSlideIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipButton: {
    padding: 20,
    alignItems: 'flex-end',
  },
  skipText: {
    color: '#666',
    fontSize: 16,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B4236C',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#B4236C',
    width: 20,
  },
  button: {
    backgroundColor: '#B4236C',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default OnboardingScreen; 