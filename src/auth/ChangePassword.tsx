
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import Input from '../components/Input';
import { globalStyles } from '../styles/globalStyles';

const ChangePassword = ({ route, navigation }: any) => {

  const { userId } = route.params;

  const [newPassword, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const navigateToLogin = () => {
    navigation.navigate('Login');
  }

  const handleChangePassword = async() => {
    
    try {

      const resp = await disabilityApi.put<any>(`/auth/updateUserPassword/${ userId }`, { newPassword, repeatPassword });

      if( resp.status === 200 ){
        Alert.alert("Success", "Your password has changed succesfully", [{ text: 'Ok', onPress: navigateToLogin }]);
      }

    } catch (error: any) {
      console.log('Error', error);
      Alert.alert("Error", error.response.data.msg);
    }
  }
  return (
    <View style={ globalStyles.login }>
        <Input label="New password" value={ newPassword } setValue={ setPassword } />
        <Input label="Repeat password" value={ repeatPassword } setValue={ setRepeatPassword } />
        <Button label="Change password" onPress={ handleChangePassword } disabled={false}/>
    </View>
  )
}

export default ChangePassword;