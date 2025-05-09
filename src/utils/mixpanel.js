import { Mixpanel } from 'mixpanel-react-native';
import { Platform } from 'react-native';

let mixpanel;

try {
  // Initialize Mixpanel with your project token
  mixpanel = new Mixpanel('6506fb89463375a7347d849c847702d5',true);
  
  // Initialize Mixpanel
  mixpanel.init().then(() => {
    console.log('Mixpanel initialized successfully');
  }).catch(error => {
    console.warn('Mixpanel initialization failed:', error);
  });
} catch (error) {
  console.warn('Mixpanel setup failed:', error);
  // Create a mock mixpanel object to prevent app crashes
  mixpanel = {
    track: () => {},
    identify: () => {},
    people: { set: () => {} },
    reset: () => {},
  };
}


export default mixpanel; 