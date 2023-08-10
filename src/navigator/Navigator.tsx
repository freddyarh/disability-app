import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';

import { AuthContext } from '../context/AuthContext';

import  Login  from '../auth/Login';
import  ForgotPassword  from '../auth/ForgotPassword';
import  Clients  from '../screens/Clients';
import ClientProfileForm from '../screens/ClientProfileForm';
import { LoadingScreen } from '../screens/LoadingScreen';
import ClientProfile from '../screens/ClientProfile';
import CreateStaffMembers from '../screens/CreateStaffMembers';
import StaffMembers from '../screens/StaffMembers';
import { DrawerContent } from './DrawerContent';
import ChangePassword from '../auth/ChangePassword';
import InsertCode from '../auth/InsertCode';
import ClientForm from '../screens/ClientForm';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const AuthNavigator = () => {
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="Login" component={ Login } />
      <Stack.Screen name="ForgotPassword" component={ ForgotPassword } />
      <Stack.Screen name="InsertCode" component={ InsertCode } />
      <Stack.Screen name="ChangePassword" component={ ChangePassword } />
    </Stack.Navigator>
  )
}

export const DrawerNavigator = () => {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  return(
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen 
        name={ "Clients" } 
        component={ Clients }
        options={{
          title: 'Home',
          headerTintColor: "white",
          headerStyle: {
              backgroundColor: "rgb(99, 81, 159)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "Create Staff Members" } 
        component={ CreateStaffMembers }
        options={{
          title: 'Create Staff Members',
          headerTintColor: "white",
          headerStyle: {
              backgroundColor: "rgb(99, 81, 159)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "Staff Members" } 
        component={ StaffMembers }
        options={{
          title: 'Staff Members',
          headerTintColor: "white",
          headerStyle: {
              backgroundColor: "rgb(99, 81, 159)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "Client Profile" } 
        component={ ClientProfile }
        options={{
          title: 'Client Profile',
          headerTintColor: "white",
          headerStyle: {
              backgroundColor: "rgb(99, 81, 159)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "ClientProfileForm" } 
        component={ ClientProfileForm }
        options={{
          title: 'ClientProfileForm',
          headerTintColor: "white",
          headerStyle: {
              backgroundColor: "rgb(99, 81, 159)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "Client Form" } 
        component={ ClientForm }
        options={{
          title: 'Client Form',
          headerTintColor: "white",
          headerStyle: {
              backgroundColor: "rgb(99, 81, 159)",
          },
        }}
        />
    </Drawer.Navigator>
  )
}

export const Navigator = () => {

  const { status } = useContext( AuthContext );

  if ( status === 'checking' ) return <LoadingScreen />

  return (
    // <NavigationContainer>

    <>
      {
        ( status !== 'authenticated') 
        ? (
            <AuthNavigator />
          )
          : (
            <DrawerNavigator />
          )
        }
    </>

    // </NavigationContainer>
  );
}