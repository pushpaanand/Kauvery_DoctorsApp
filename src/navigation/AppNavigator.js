import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';


const AppNavigator = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    checkIfFirstLaunch();
  }, []);

  const checkIfFirstLaunch = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      // If hasSeenOnboarding is null or not 'true', it's first launch
      if (!hasSeenOnboarding) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      setIsFirstLaunch(true);
    }
  };

  if (isFirstLaunch === null) {
    return null; // Or a loading screen
  }

  console.log(isFirstLaunch)
  return (

      <>
        {isFirstLaunch ? (
          <OnboardingScreen setIsFirstLaunch={setIsFirstLaunch} />
        ) : (
          <LoginScreen />
        )}
      </>
    
  );
};

export default AppNavigator; 