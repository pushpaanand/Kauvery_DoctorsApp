import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/dashboard/HomeScreen';
import PatientsScreen from '../screens/dashboard/PatientsScreen';
import ScheduleScreen from '../screens/dashboard/ScheduleScreen';
import InPatientsScreen from '../screens/dashboard/InPatientsScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';
import { theme } from '../utils/theme';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Patients"
        component={PatientsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" size={24} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar" size={24} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="In-Patients"
        component={InPatientsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bed" size={24} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
} 