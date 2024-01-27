import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';

import { AuthContext } from '../context/AuthContext';

import  Login  from '../auth/Login';
import  ForgotPassword  from '../auth/ForgotPassword';
import  Clients  from '../screens/Clients';
import CreateClientProfile from '../screens/CreateClientProfile';
import { LoadingScreen } from '../screens/LoadingScreen';
import ClientProfile from '../screens/ClientProfile';
import CreateStaffMembers from '../screens/CreateStaffMembers';
import StaffMembers from '../screens/StaffMembers';
import { DrawerContent } from './DrawerContent';
import ChangePassword from '../auth/ChangePassword';
import InsertCode from '../auth/InsertCode';
import ClientForm from '../screens/ClientForm';
import ClientReport from '../screens/ClientReport';
import { colors } from '../styles/colors';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export const AuthNavigator = () => {
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="Login" component={ Login } options={{
          title: '',
          headerTintColor: "rgb(99, 81, 159)",
          headerStyle: {
            backgroundColor: "rgb(6, 3, 2)"
          },
        }}/>
      <Stack.Screen name="ForgotPassword" component={ ForgotPassword } options={{
          title: 'Forgot Password',
          headerTintColor: colors.titleColor,
          headerStyle: {
              backgroundColor: "rgb(6, 3, 2)",
          },
        }}/>
      <Stack.Screen name="InsertCode" component={ InsertCode } options={{
          title: 'Insert Code',
          headerTintColor: colors.titleColor,
          headerStyle: {
              backgroundColor: "rgb(6, 3, 2)",
          },
        }}/>
      <Stack.Screen name="ChangePassword" component={ ChangePassword } options={{
          title: 'Change Password',
          headerTintColor: colors.titleColor,
          headerStyle: {
              backgroundColor: "rgb(6, 3, 2)",
          },
        }}/>
    </Stack.Navigator>
  )
}

export const DrawerNavigator = () => {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  return(
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'back',
        drawerStyle: isLargeScreen ? null : { width: '100%', backgroundColor: colors.white },
        overlayColor: 'transparent',
        headerStyle: {
          elevation: 0,
          shadowColor: 'transparent'
        }
      }}>
      <Drawer.Screen 
        name={ "Clients" } 
        component={ Clients }
        options={{
          title: 'Participants',
          headerTintColor: colors.titleColor,
          headerStyle: {
              backgroundColor: "rgb(6, 3, 2)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "Create Staff Members" } 
        component={ CreateStaffMembers }
        options={{
          title: 'Create Staff Members',
          headerTintColor: colors.titleColor,
          headerStyle: {
              backgroundColor: "rgb(6, 3, 2)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "Staff Members" } 
        component={ StaffMembers }
        options={{
          title: 'Users',
          headerTintColor: colors.titleColor,
          headerStyle: {
              backgroundColor: "rgb(6, 3, 2)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "Client Profile" } 
        component={ ClientProfile }
        options={{
          title: 'Client Profile',
          headerTintColor: colors.titleColor,
          headerStyle: {
              backgroundColor: "rgb(6, 3, 2)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "CreateClientProfile" } 
        component={ CreateClientProfile }
        options={{
          title: 'Create Client Profile',
          headerTintColor: colors.titleColor,
          headerStyle: {
              backgroundColor: "rgb(6, 3, 2)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "Client Form" } 
        component={ ClientForm }
        options={{
          title: 'Client Form',
          headerTintColor: colors.titleColor,
          headerStyle: {
              backgroundColor: "rgb(6, 3, 2)",
          },
        }}
        />
      <Drawer.Screen 
        name={ "Client Report" } 
        component={ ClientReport }
        options={{
          title: 'Client Report',
          headerTintColor: colors.titleColor,
          headerStyle: {
              backgroundColor: "rgb(6, 3, 2)",
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