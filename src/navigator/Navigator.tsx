import React, { useContext } from 'react';
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
          contentStyle: {
            backgroundColor: colors.black
          },
          title: '',
          headerTintColor: colors.white,
          headerStyle: {
            backgroundColor: colors.black,
            borderBottomColor: colors.black,
            borderBottomWidth: 1,
          } as any,
        }}/>
      <Stack.Screen name="ForgotPassword" component={ ForgotPassword } options={{
          contentStyle: {
            backgroundColor: colors.black
          },
          title: 'Forgot Password',
          headerTintColor: colors.white,
          headerStyle: {
              backgroundColor: colors.black,
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
          } as any,
        }}/>
      <Stack.Screen name="InsertCode" component={ InsertCode } options={{
          contentStyle: {
            backgroundColor: colors.black
          },
          title: 'Insert Code',
          headerTintColor: colors.white,
          headerStyle: {
              backgroundColor: colors.black,
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
          } as any,
        }}/>
      <Stack.Screen name="ChangePassword" component={ ChangePassword } options={{
          contentStyle: {
            backgroundColor: colors.black
          },
          title: 'Change Password',
          headerTintColor: colors.white,
          headerStyle: {
              backgroundColor: colors.black,
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
          } as any,
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
          sceneContainerStyle: {
            backgroundColor: colors.white,
          },
          title: 'Participants',
          headerTintColor: colors.white,
          headerStyle: {
              backgroundColor: colors.black,
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
          } as any,
        }}
        />
      <Drawer.Screen 
        name={ "Create Staff Members" } 
        component={ CreateStaffMembers }
        options={{
          sceneContainerStyle: {
            backgroundColor: colors.white,
          },
          title: 'Create Staff Members',
          headerTintColor: colors.white,
          headerStyle: {
              backgroundColor: colors.black,
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
          } as any,
        }}
        />
      <Drawer.Screen 
        name={ "Staff Members" } 
        component={ StaffMembers }
        options={{
          sceneContainerStyle: {
            backgroundColor: colors.white,
          },
          title: 'Users',
          headerTintColor: colors.white,
          headerStyle: {
              backgroundColor: colors.black,
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
          } as any,
        }}
        />
      <Drawer.Screen 
        name={ "Client Profile" } 
        component={ ClientProfile }
        options={{
          sceneContainerStyle: {
            backgroundColor: colors.white,
          },
          title: 'Client Profile',
          headerTintColor: colors.white,
          headerStyle: {
              backgroundColor: colors.black,
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
          } as any,
        }}
        />
      <Drawer.Screen 
        name={ "CreateClientProfile" } 
        component={ CreateClientProfile }
        options={{
          sceneContainerStyle: {
            backgroundColor: colors.white,
          },
          title: 'Create Client Profile',
          headerTintColor: colors.white,
          headerStyle: {
              backgroundColor: colors.black,
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
          } as any,
        }}
        />
      <Drawer.Screen
        name={ "Client Form" } 
        component={ ClientForm }
        options={{
          sceneContainerStyle: {
            backgroundColor: colors.white,
          },
          title: 'Client Form',
          headerTintColor: colors.white,
          headerStyle: {
              backgroundColor: colors.black,
              borderBottomColor: colors.black,
              borderBottomWidth: 1,
          } as any,
        }}
        />
      <Drawer.Screen
        name={ "Client Report" } 
        component={ ClientReport }
        options={{
          sceneContainerStyle: {
            backgroundColor: colors.white,
          },
          title: 'Client Report',
          headerTintColor: colors.white,
          headerStyle: {
            backgroundColor: colors.black,
            borderBottomColor: colors.black,
            borderBottomWidth: 1,
          } as any,
        }}
        />
    </Drawer.Navigator>
  )
}

export const Navigator = () => {

  const { status } = useContext( AuthContext );

  if ( status === 'checking' ) return <LoadingScreen color={ colors.titleColor } backgroundColor={ colors.black } />

  return (
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
  );
}