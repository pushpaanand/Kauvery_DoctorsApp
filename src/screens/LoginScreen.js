import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { authService } from '../api/services/authService';
import { setToken, setUser, setLoading, setError } from '../store/slices/authSlice';
import SplashScreen from './SplashScreen';
import smsService from '../api/services/smsService';
import mixpanel, { identifyUser } from '../utils/mixpanel';
import { User } from '../utils/constants';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    mobileno: ''
  });
  const [screenCount, setScreenCount] = useState(1)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleLogin = async () => {
    if (!credentials.mobileno) {
      Alert.alert('Error', 'Please enter mobile number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const min = 100000;
      const max = 999999;
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      setRandomNumber(randomNum);
      setIsOtpGenerated(true);
      setResendTimer(30); // 30 seconds timer
      setOtp(randomNum.toString().split(''))
      // First time login - use primary vendor
      // const primarySmsResponse = await smsService.primarySms(credentials.mobileno, `${randomNum} is you OTP for Doctors App to verify your number`);
      // console.log(primarySmsResponse)
      setScreenCount(2);
    } catch (error) {
      setError(error.message);
      console.log(error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };
  // console.log(randomNumber)
  const handleResendOtp = async () => {
    if (resendAttempts >= 5 || resendTimer > 0) {
      return;
    }

    setLoading(true);
    try {
      const min = 100000;
      const max = 999999;
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      setRandomNumber(randomNum);
      setResendTimer(30); // Reset timer to 30 seconds

      // Use secondary vendor for resend
      // const secondarySmsResponse = await smsService.secondarySms(credentials.mobileno, randomNum);
      // console.log(secondarySmsResponse)
      setOtp(randomNum.toString().split(''))

      setResendAttempts(prev => prev + 1);
    } catch (error) {
      setError(error.message);
      Alert.alert('Resend Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text, index) => {
    if (text.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input if current input is filled
      if (text.length === 1 && index < 5) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const loginResponse = await authService.login(credentials);
      console.log(loginResponse)
      const validOtp = otp.join('') === randomNumber.toString()
      if (!validOtp) {
        Alert.alert('Error', 'Invalid OTP')
        return;
      }

      if (loginResponse.Message === "Invalid mobile number") {
        Alert.alert(
          'No Doctor Found',
          'No doctor exists with this mobile number. Please contact support if you believe this is an error.',
          [{ text: 'OK', onPress: () => setScreenCount(1) }]
        );
        return;
      }

      // if (loginResponse.error) {
      //   Alert.alert(
      //     'No Doctor Found',
      //     'No doctor exists with this mobile number. Please contact support if you believe this is an error.',
      //     [{ text: 'OK', onPress: () => setScreenCount(1) }]
      //   );
      //   return;
      // }

      if (loginResponse && validOtp) {
        dispatch(setUser(loginResponse));
        setIsVisible(true);

        setTimeout(() => {
          setIsVisible(false);
          mixpanel.track('Login', User)
          navigation.navigate('Dashboard');
        }, 3000);
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Error', error.message)
    }
  }

  return (
    <>
      {isVisible ? <SplashScreen /> : <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.headerContainer}>
              <Image
                source={require('../assets/images/25YearsLogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.welcomeText}>Welcome to DocEase!</Text>
              <Text style={styles.subtitleText}>Where Care Meets Convenience</Text>
              {screenCount === 1 && <>
                <Image
                  source={require('../assets/images/login.png')}
                  style={styles.logo1}
                  resizeMode="contain"
                />
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>
                    Streamline your practice with DocEase{'\n'}
                    The digital companion for modern{'\n'}
                    healthcare professionals
                  </Text>
                </View>
              </>
              }
            </View>
            {screenCount === 2 && <View>
              <Text style={styles.verifyTextHeader}>Verify Your Number</Text>
              <Text style={styles.verifyTextSubHeader}>We've sent an OTP to {credentials.mobileno}</Text>
            </View>}
            <View style={styles.formContainer}>
              <Text style={styles.formText}>{screenCount === 1 ? 'Enter Your mobile number to get started' : 'Enter the 6-digit code'}</Text>
              {screenCount === 1 && <View style={styles.inputContainer}>
                <MaterialIcons
                  name="phone"
                  size={24}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your mobile number"
                  value={credentials.mobileno}
                  onChangeText={(text) => setCredentials({ mobileno: text })}
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                />
              </View>}

              {screenCount == 2 && <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => otpInputs.current[index] = ref}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>}

              {screenCount === 1 ? <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Get OTP</Text>
              </TouchableOpacity> : <TouchableOpacity style={styles.loginButton} onPress={handleVerifyOtp}>
                <Text style={styles.loginButtonText}>Verify OTP</Text>
              </TouchableOpacity>}
              {screenCount === 2 && (
                <View style={styles.resendOTPContainer}>
                  <Text style={styles.resendOTPText}>Didn't receive the OTP?</Text>
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={resendAttempts >= 5 || resendTimer > 0 || !isOtpGenerated}
                  >
                    <Text style={[
                      styles.resendOTPButton,
                      (resendAttempts >= 5 || resendTimer > 0 || !isOtpGenerated) && styles.disabledResendButton
                    ]}>
                      {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>

        </KeyboardAvoidingView>
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>&copy; 2025 DocEase. All rights reserved.</Text>
        </View>
      </SafeAreaView>}

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 2,
  },
  logo1: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 12,
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B4236C',
    marginBottom: 5,
  },
  subtitleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  descriptionContainer: {
    alignItems: 'center',
  },
  descriptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  formText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  eyeIcon: {
    padding: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#B4236C',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#B4236C',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  rememberMeText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  forgotPasswordText: {
    color: '#B4236C',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
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
  arrowIcon: {
    marginLeft: 8,
  },
  copyrightContainer: {
    alignItems: 'center',

  },
  copyrightText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    marginBottom: 10
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginBottom: 20
  },
  otpInput: {
    width: 45,
    // height: 45,
    borderWidth: 1,
    borderColor: '#B4236C',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  resendOTPContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 5
  },
  resendOTPText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666'
  },
  resendOTPButton: {
    fontFamily: 'Poppins-Regular',
    color: '#B4236C',
    fontSize: 12
  },
  verifyTextHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#b4236c',
    marginBottom: 5
  },
  verifyTextSubHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  disabledResendButton: {
    color: '#999',
  },
});

export default LoginScreen; 