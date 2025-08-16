import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store';

// Screens
import AuthScreen from '../screens/AuthScreen';
import CanvasScreen from '../screens/CanvasScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={CanvasScreen} />
            <Stack.Screen name="Home" component={CanvasScreen} />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="Messages" 
              component={MessagesScreen}
              options={{
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="Search" 
              component={SearchScreen}
              options={{
                presentation: 'modal',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;