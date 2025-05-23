import React from 'react';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './src/navigator/Navigator';
import { StatusBar } from 'react-native';
import { colors } from './src/styles/colors';
import { AuthProvider } from './src/context/AuthContext';
import { LoadingScreen } from './src/screens/LoadingScreen';

const AppState = ({ children }: any ) => {
  return(
    <AuthProvider>
      { children }
    </AuthProvider>
  )
}

const App = () => {
  const [loaded] = useFonts({
    'Roboto': require('./assets/fonts/Roboto/Roboto-VariableFont.ttf'), // Replace with your font file path
    // You can load multiple fonts here
  });

  if (!loaded) {
    return <LoadingScreen />; // Prevent showing content until fonts are loaded
  }
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