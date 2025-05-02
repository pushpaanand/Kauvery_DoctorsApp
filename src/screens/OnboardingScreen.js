import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Quick Actions at Your Fingertips',
    description: 'Stay on Top of Your Day with Instant Schedule Overview & Quick Patient History Access',
    image: require('../assets/images/Screen2.png'),
  },
  {
    id: 2,
    title: 'Never Miss Critical Updates',
    description: 'Real-time Access to Patient Lab Results, Critical Patient Updates, Investigation Reports',
    image: require('../assets/images/Screen3.png'),
  },
];

const OnboardingScreen = ({ setIsFirstLaunch }) => {
  const [currentScreen, setCurrentScreen] = useState(0)
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
      setIsFirstLaunch(false)
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <View style={styles.container}>
      {currentScreen === 0 && <>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome to DocEase!</Text>
          <Text style={styles.subtitleText}>Where Care Meets Convenience</Text>
          <Image
            source={require('../assets/images/login.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Streamline your practice with DocEase{'\n'}
              The digital companion for modern{'\n'}
              healthcare professionals
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={() => setCurrentScreen(1)}>
          <Text style={styles.loginButtonText} >Get Started</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/25YearsLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </>}
      {currentScreen === 1 && <>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/25YearsLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
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

        <View style={styles.buttonContainer}>
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
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40, marginTop: 50
  },
  skipButton: {
    alignItems: 'flex-end',
  },
  skipText: {
    color: '#B4236C',
    fontSize: 16,
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B4236C',
    marginBottom: 5,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
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
    borderRadius: 2,
    width: 40,
  },
  button: {
    backgroundColor: '#B4236C',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 30,

  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 2,

  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginButton: {
    backgroundColor: '#B4236C',
    borderRadius: 8,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    marginRight: 8,
  },
});

export default OnboardingScreen; 