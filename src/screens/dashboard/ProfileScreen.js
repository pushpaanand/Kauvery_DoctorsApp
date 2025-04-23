import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../utils/theme';
import CustomAlert from '../../components/CustomAlert';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);

  const profileData = {
    name: 'Dr. Baraneedharan',
    specialization: 'Diabetologist',
    stats: [
      { value: '143', label: 'Total Patients', change: '+25%' },
      { value: '18m', label: 'Avg. Wait Time', change: '-5%' },
      { value: '143', label: 'Satisfaction', change: '+12%' },
    ]
  };

  const menuItems = [
    {
      section: 'ACCOUNT SETTINGS',
      items: [
        { icon: 'bell-outline', label: 'Notifications', hasArrow: true },
        { icon: 'email-outline', label: 'Email Settings', hasArrow: true },
        { icon: 'phone-outline', label: 'Contact Info', hasArrow: true },
      ]
    },
    {
      section: 'PREFERENCES',
      items: [
        { icon: 'calendar-check', label: 'Availability', hasArrow: true },
        { icon: 'clock-outline', label: 'Working Hours', hasArrow: true },
      ]
    },
    {
      section: 'SECURITY',
      items: [
        { icon: 'shield-outline', label: 'Privacy Settings', hasArrow: true },
        { icon: 'logout', label: 'Log Out', hasArrow: false, color: '#f44336', onPress: handleLogout },
      ]
    }
  ];

  const handleLogout = () => {
    setAlertVisible(true);
  };

  const confirmLogout = async () => {
    setAlertVisible(false);
    try {
      await AsyncStorage.clear();
      navigation.replace('Login'); // Navigate to the login screen
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        onConfirm={confirmLogout}
      />
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialCommunityIcons name="chevron-left" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="cog" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image
              source={require('../../../assets/doctor.png')}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.doctorName}>{profileData.name}</Text>
              <Text style={styles.specialization}>{profileData.specialization}</Text>
              <TouchableOpacity>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <MaterialCommunityIcons name="account-group" size={24} color={theme.colors.primary} />
              <Text style={[styles.statChange, styles.positiveChange]}>
                {profileData.stats[0].change}
              </Text>
            </View>
            <Text style={styles.statValue}>{profileData.stats[0].value}</Text>
            <Text style={styles.statLabel}>{profileData.stats[0].label}</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.statChange, styles.negativeChange]}>
                {profileData.stats[1].change}
              </Text>
            </View>
            <Text style={styles.statValue}>{profileData.stats[1].value}</Text>
            <Text style={styles.statLabel}>{profileData.stats[1].label}</Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <MaterialCommunityIcons name="thumb-up-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.statChange, styles.positiveChange]}>
                {profileData.stats[2].change}
              </Text>
            </View>
            <Text style={styles.statValue}>{profileData.stats[2].value}</Text>
            <Text style={styles.statLabel}>{profileData.stats[2].label}</Text>
          </View>
        </View>

        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity 
                key={itemIndex} 
                style={styles.menuItem}
                onPress={() => {
                  if (section.section === 'SECURITY' && item.label === 'Log Out') {
                    handleLogout();
                  } else {
                    item.onPress && item.onPress();
                  }
                }}
              >
                <View style={styles.menuItemLeft}>
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={24} 
                    color={item.color || theme.colors.primary} 
                  />
                  <Text style={[
                    styles.menuItemText,
                    item.color && { color: item.color }
                  ]}>
                    {item.label}
                  </Text>
                </View>
                {item.hasArrow && (
                  <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={24} 
                    color="#666" 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: width * 0.045,
    fontFamily: 'Poppins-Bold',
    color: theme.colors.primary,
  },
  profileSection: {
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.04,
  },
  profileImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
  },
  profileInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: width * 0.045,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  specialization: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 2,
  },
  editProfileText: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.primary,
    marginTop: height * 0.01,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
    width: width * 0.25,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.02,
    marginBottom: height * 0.008,
  },
  statValue: {
    fontSize: width * 0.045,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
  },
  statChange: {
    fontSize: width * 0.028,
    fontFamily: 'Poppins-Medium',
  },
  positiveChange: {
    color: '#4CAF50',
  },
  negativeChange: {
    color: '#f44336',
  },
  menuSection: {
    paddingTop: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Medium',
    color: '#999',
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.01,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  menuItemText: {
    fontSize: width * 0.038,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
}); 