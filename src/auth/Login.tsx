import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';
import  CustomTextInputIcon  from '../components/CustomTextInputIcon';

interface Props extends NativeStackScreenProps<any, any> {}

export const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const { signIn, errorMessage, removeError } = useContext( AuthContext );
  
  useEffect(() => {

    if( errorMessage.length === 0 ) return;
    
    Alert.alert( "Login Error", errorMessage, [{ text: 'Ok', onPress: removeError }] );
    
  }, [ errorMessage ]);
  
  const handleLogin = () => {
    
    signIn({ email , password });
    
  };
  
  const { height, width } = useWindowDimensions();
  const aspectRatio = height/width;

  return (
    // <Animated.ScrollView entering={ FadeIn.duration(500) }>
      <Animated.View style={[ globalStyles.container, { marginTop: -10 }]} entering={ FadeIn.duration(500) }>
          <View style={styles.containerImg}>
            <Image
              style={[styles.logo, aspectRatio > 1.6 ? { maxHeight: 200, height: height * 0.3  } : { maxHeight: 270, height: height * 0.3  }]}
              source={require('../../assets/images/logo.jpg')}
              resizeMode="contain"
            /> 
          </View>
          <View 
            style={styles.containLoginInput}
            accessibilityLabel="Login form container"
            accessibilityRole="none"
            testID="login-form-container"
          >
            <View 
              style={[styles.iconInputLogin, { flexGrow: 1.3 }]}
              accessibilityLabel="Email icon container"
              testID="email-icon-container"
              accessible={true}
              accessibilityRole="none"
            >
              <CustomTextInputIcon  
                nativeID="formLoginEmail" 
                icon="email" 
                color={colors.titleColor} 
                size={29}
                accessibilityLabel="Email input icon"
              /> 
            </View>
            <View  style={ [styles.inputLogin, aspectRatio > 1.6 ? { maxWidth: '89%'} : { maxWidth: '94%'} ] }>
              <Input
                accessibilityLabel="Email input field"
                accessibilityHint="Enter your email address"
                textContentType={"emailAddress"}
                label={ "Email" }
                placeholder={ "Email" }
                value={ email }
                setValue={ setEmail }
                backgroundInputColor={"black"}
                inputTextColor="white"
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <View style={[ styles.iconInputLogin, { flexGrow: 1.5 }]}>
              <CustomTextInputIcon 
                nativeID="formLoginPassword" 
                icon="lock" 
                color={colors.titleColor} 
                size={29}
                accessibilityLabel="Password input icon"
              /> 
            </View>
            <View  style={ [styles.inputLogin, aspectRatio > 1.6 ? { maxWidth: '89%'} : { maxWidth: '94%'} ] }>
              <Input
                accessibilityLabel="Password input field"
                accessibilityHint="Enter your password"
                textContentType={"password"}
                label={ "Password" }
                placeholder={ "Your password" }
                value={ password }
                setValue={ setPassword }
                rightEye={ true }
                backgroundInputColor={"black"}
                inputTextColor="white"
              />
            </View>
          </View>
          <Button 
            label={ "Sign in" }
            onPress={ handleLogin }
            disabled={ false }
          />
          <TouchableOpacity
            onPress={ () => navigation.navigate('ForgotPassword') }
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
      </Animated.View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  forgotPassword:{
    fontSize: Platform.OS === 'android' ? 17 : 17,
    color: colors.titleColor,
    marginTop: 24,
    fontWeight: "bold",
    alignSelf: 'flex-end'
  },
  containerImg: {
    alignItems: 'center'
  },
  logo: {
    marginBottom: Platform.OS === 'android' ? 7 : 15,
    minWidth: 300,
  },
  title: {
    color: colors.titleColor,
    fontSize: 30
  },
  containLoginInput: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 4
  },
  iconInputLogin: {
    height: '45%', 
    marginRight: 7
  },
  inputLogin: {
    flexGrow: 10, 
    minWidth: '89%'
  }
});

export default Login;