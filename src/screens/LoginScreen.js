import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    Username: '',
    Password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const handleLogin = async () => {
    console.log('handleLogin');
    if (!credentials.Username || !credentials.Password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loginResponse = await authService.login(credentials);
      if (loginResponse) {
        dispatch(setUser(loginResponse));
        setIsVisible(true);

        const timer = setTimeout(() => {
          setIsVisible(false);
      
        }, 10000); 
    
       clearTimeout(timer)
    
 
      }
      navigation.navigate('Dashboard') 

    } catch (error) {
      setError(error.message);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
<>
{isVisible?<SplashScreen/>: <SafeAreaView style={styles.container}>
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
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="person"
                size={24}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={credentials.Username}
                onChangeText={(text) => setCredentials(prev => ({ ...prev, Username: text }))}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons
                name="lock"
                size={24}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={credentials.Password}
                onChangeText={(text) => setCredentials(prev => ({ ...prev, Password: text }))}
                secureTextEntry={!showPassword}
                placeholderTextColor="#666"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && (
                    <MaterialIcons
                      name="check"
                      size={16}
                      color="#fff"
                    />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => console.log('Forgot password')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
              <MaterialIcons
                name="arrow-forward"
                size={24}
                color="#fff"
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
});

export default LoginScreen; 