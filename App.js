import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DifficultyScreen from './screens/DifficultyScreen';
import SessionLengthScreen from './screens/SessionLengthScreen';
import LoadingScreen from './screens/LoadingScreen';
import PracticeScreen from './screens/PracticeScreen';
import SummaryScreen from './screens/SummaryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Difficulty"
          component={DifficultyScreen}
        />
        <Stack.Screen
          name="SessionLength"
          component={SessionLengthScreen}
        />
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
        />
        <Stack.Screen
          name="Practice"
          component={PracticeScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Summary"
          component={SummaryScreen}
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
