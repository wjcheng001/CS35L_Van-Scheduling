import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';

import WelcomeScreen from './src/screens/WelcomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SchedulingScreen from './src/screens/SchedulingScreen';
import { BACKEND_URL } from './secrets';

fetch(`${BACKEND_URL}/api/trips`)
  .then((res) => res.json())
  .then((data) => {
    console.log('Trips:', data);
  });

const Stack = createNativeStackNavigator();
<Button title="Go to Schedule" onPress={() => navigation.navigate('Schedule')} />

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false, // disables default header for custom design
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Scheduling" component={SchedulingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

