import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    showPassword: false,
  });

  const handleLogin = () => {
    navigation.replace('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.welcomeText}>Welcome to DocEase!</Text>
        <Text style={styles.subtitleText}>Where Care Meets Convenience</Text>

        <Image
          source={require('../../assets/login.png')}
          style={styles.loginImage}
          resizeMode="contain"
        />

        <Text style={styles.descriptionText}>
          Streamline your practice with DocEase{'\n'}
          The digital companion for modern{'\n'}
          healthcare professionals
        </Text>

        <View style={styles.inputContainer}>
          <MaterialIcons 
            name="person" 
            size={24} 
            color={theme.colors.primary}
            style={styles.inputIcon} 
          />
          <TextInput
            label="Username"
            value={credentials.username}
            onChangeText={(text) => setCredentials({ ...credentials, username: text })}
            mode="outlined"
            style={styles.input}
            outlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.primary}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons 
            name="lock" 
            size={24} 
            color={theme.colors.primary}
            style={styles.inputIcon} 
          />
          <TextInput
            label="Password"
            value={credentials.password}
            onChangeText={(text) => setCredentials({ ...credentials, password: text })}
            mode="outlined"
            secureTextEntry={!credentials.showPassword}
            right={
              <TextInput.Icon 
                icon={credentials.showPassword ? "eye-off" : "eye"}
                onPress={() => setCredentials({ 
                  ...credentials, 
                  showPassword: !credentials.showPassword 
                })}
                color={theme.colors.primary}
              />
            }
            style={styles.input}
            outlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.primary}
          />
        </View>

        <View style={styles.optionsContainer}>
          <Button
            mode="text"
            onPress={() => setCredentials({ 
              ...credentials, 
              rememberMe: !credentials.rememberMe 
            })}
            icon={credentials.rememberMe ? "checkbox-marked" : "checkbox-blank-outline"}
            textColor={theme.colors.primary}
          >
            Remember me
          </Button>
          
          <Button
            mode="text"
            onPress={() => console.log('Forgot password')}
            textColor={theme.colors.primary}
          >
            Forgot Password?
          </Button>
        </View>

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.loginButton}
          contentStyle={styles.loginButtonContent}
          labelStyle={styles.loginButtonLabel}
        >
          Login
          <MaterialIcons 
            name="arrow-forward" 
            size={20} 
            color="#fff"
            style={styles.arrowIcon}
          />
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.15,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: width * 0.04,
    color: '#333',
    marginBottom: 12,
  },
  loginImage: {
    width: width * 0.8,
    height: width * 0.5,
    marginVertical: 20,
  },
  descriptionText: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
    lineHeight: width * 0.05,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    backgroundColor: '#fff',
  },
  inputIcon: {
    position: 'absolute',
    zIndex: 1,
    left: 8,
    top: 15,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  loginButtonContent: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonLabel: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#fff',
  },
  arrowIcon: {
    marginLeft: 8,
  },
}); 