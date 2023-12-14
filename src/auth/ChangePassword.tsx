
import React, { useContext, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import Input from '../components/Input';
import { globalStyles } from '../styles/globalStyles';

const ChangePassword = ({ route, navigation }: any) => {

  const { userId } = route.params;

  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const handleChangePassword = async() => {
    
    try {

      const resp = await disabilityApi.put<any>(`/auth/updateUserPassword/${ userId }`, { password });

      if( resp.status === 200 ){
        Alert.alert("Info", "Your password has changed succesfully");
        navigation.navigate('Login');
      }

    } catch (error: any) {
      console.log('Error', error);
    }
  }
  return (
    <View style={ globalStyles.login }>
        <Input label="Password" value={ password } setValue={ setPassword } />
        <Input label="Repeat password" value={ repeatPassword } setValue={ setRepeatPassword } />
        <Button label="Change password" onPress={ handleChangePassword } disabled={false}/>
    </View>
  )
}

export default ChangePassword;