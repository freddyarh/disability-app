import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import ClientProfileForm from './src/screens/FormClientProfile';
import { SafeAreaView as SafeAreaViewAndroid } from 'react-native-safe-area-context';
// import Client from './src/screens/Client';
import { generalStyles } from './src/styles/generalStyle';

export default function App() {
  return (
    <>
      { Platform.OS === 'android' ? (
        <SafeAreaViewAndroid style={ generalStyles.fondo }>
          <KeyboardAvoidingView
            behavior= "padding"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
            }}
          >
          <View>
            <ClientProfileForm />
            <StatusBar style="auto" />
          </View>
          </KeyboardAvoidingView>
        </SafeAreaViewAndroid>
      ):(
        <SafeAreaView style={ generalStyles.fondo }>
          {/* <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : ""}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
            }}
          > */}
          <View>
            <ClientProfileForm />
            <StatusBar style="auto" />
          </View>
          {/* </KeyboardAvoidingView> */}
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
