import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';

import  Login  from '../auth/Login';
import  ForgotPassword  from '../auth/ForgotPassword';
import  Clients  from '../screens/Clients';
import ClientProfileForm from '../screens/ClientProfileForm';
import { LoadingScreen } from '../screens/LoadingScreen';
import ClientProfile from '../screens/ClientProfile';
import StaffMembers from '../screens/StaffMembers';


const Stack = createNativeStackNavigator();

export const Navigator = () => {

  const { status } = useContext( AuthContext );

  if ( 'checkin' === 'checking' ) return <LoadingScreen />

  return (
    // <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >

        {
          ( status !== 'authenticated') 
            ? (
              <>
                <Stack.Screen name="Login" component={ Login } />
                <Stack.Screen name="ForgotPassword" component={ ForgotPassword } />
              </>
            )
            : (
              <>
                <Stack.Screen 
                  name="Clients" 
                  component={ Clients } 
                />
                <Stack.Screen 
                  name="Form Client" 
                  component={ ClientProfileForm }
                />
                <Stack.Screen 
                  name="Client Profile" 
                  component={ ClientProfile }
                />
                <Stack.Screen 
                  name="Staff Members" 
                  component={ StaffMembers }
                />
              </>
            )
        }

      </Stack.Navigator>
    // </NavigationContainer>
  );
}