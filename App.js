import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { View, Image, StyleSheet, Text } from 'react-native';
import LogoutButton from './components/LogoutButton';
import { theme } from './src/utils/theme';
import TabNavigator from './src/navigation/TabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';

// Workflow Screens
import NewProposalScreen from './screens/workflows/NewProposalScreen';
import NegotiationScreen from './screens/workflows/NegotiationScreen';
import MouDocumentScreen from './screens/workflows/MouDocumentScreen';
import TariffRenewalScreen from './screens/workflows/TariffRenewalScreen';

// Review Screens
import DocumentReviewScreen from './screens/review/DocumentReviewScreen';
import NegotiationReviewScreen from './screens/review/NegotiationReviewScreen';

// Approval Screens
import FinalApprovalScreen from './screens/approval/FinalApprovalScreen';

// Notification Screen
import NotificationsScreen from './screens/NotificationsScreen';

// Reviewer Screens
import ReviewerDashboardScreen from './screens/reviewer/ReviewerDashboardScreen';

// Approver Screens
import ApproverDashboardScreen from './screens/approver/ApproverDashboardScreen';

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// LogoTitle component for dashboards with logo
const DashboardLogoTitle = () => (
  <View style={styles.headerContainer}>
    <Image
      source={require('./assets/logo.png')}
      style={styles.headerLogo}
    />
  </View>
);

// Simple title component for other screens
const SimpleTitle = ({ title }) => (
  <Text style={styles.headerTitle}>{title}</Text>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <Portal.Host>
            <NavigationContainer>
              <Stack.Navigator 
                initialRouteName="Login"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen 
                  name="Login" 
                  component={LoginScreen}
                />

                <Stack.Screen 
                  name="Dashboard" 
                  component={TabNavigator}
                  options={{ headerShown: false }}
                />

                <Stack.Screen 
                  name="NewProposal" 
                  component={NewProposalScreen}
                  options={{ 
                    headerTitle: "New Proposal"
                  }}
                />
                <Stack.Screen 
                  name="Negotiation" 
                  component={NegotiationScreen}
                  options={{ 
                    headerTitle: "Negotiation Process"
                  }}
                />
                <Stack.Screen 
                  name="MouDocument" 
                  component={MouDocumentScreen}
                  options={{ 
                    headerTitle: "MoU Document"
                  }}
                />
                <Stack.Screen 
                  name="TariffRenewal" 
                  component={TariffRenewalScreen}
                  options={{ 
                    headerTitle: "Tariff Renewal"
                  }}
                />

                <Stack.Screen 
                  name="DocumentReview" 
                  component={DocumentReviewScreen}
                  options={{ 
                    headerTitle: "Document Review"
                  }}
                />
                <Stack.Screen 
                  name="NegotiationReview" 
                  component={NegotiationReviewScreen}
                  options={{ 
                    headerTitle: "Negotiation Review"
                  }}
                />

                <Stack.Screen 
                  name="FinalApproval" 
                  component={FinalApprovalScreen}
                  options={{ 
                    headerTitle: "Final Approval"
                  }}
                />

                <Stack.Screen 
                  name="Notifications" 
                  component={NotificationsScreen}
                  options={{ 
                    headerTitle: "Notifications"
                  }}
                />

                <Stack.Screen 
                  name="ReviewerDashboard" 
                  component={ReviewerDashboardScreen}
                  options={({ navigation }) => ({ 
                    headerShown: true,
                    headerTitle: '',
                    headerLeft: () => <DashboardLogoTitle />,
                    headerRight: () => (
                      <View style={styles.headerRight}>
                        <NotificationIcon navigation={navigation} />
                        <LogoutButton navigation={navigation} />
                      </View>
                    ),
                  })}
                />

                <Stack.Screen 
                  name="ApproverDashboard" 
                  component={ApproverDashboardScreen}
                  options={({ navigation }) => ({ 
                    headerShown: true,
                    headerTitle: '',
                    headerLeft: () => <DashboardLogoTitle />,
                    headerRight: () => (
                      <View style={styles.headerRight}>
                        <NotificationIcon navigation={navigation} />
                        <LogoutButton navigation={navigation} />
                      </View>
                    ),
                  })}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </Portal.Host>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

// NotificationIcon Component
const NotificationIcon = ({ navigation }) => (
  <IconButton
    icon="bell"
    iconColor={theme.colors.primary}
    size={24}
    onPress={() => navigation.navigate('Notifications')}
  />
);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 16,
  },
  headerLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
});
