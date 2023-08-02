import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigator/Navigator';
import { StatusBar } from 'react-native';
import { colors } from './src/styles/colors';
import { AuthProvider } from './src/context/AuthContext';
import DrawerNavigator2 from './src/navigator/Navigator2';

const AppState = ({ children }: any ) => {
  return(
    <AuthProvider>
      { children }
    </AuthProvider>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar 
        backgroundColor={ colors.black }
      />
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  );
}

export default App;