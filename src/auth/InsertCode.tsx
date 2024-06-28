import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import Input from '../components/Input';
import { globalStyles } from '../styles/globalStyles';

export const InsertCode = ({ route, navigation }: any) => {

  
  const { id } = route.params;
  
  const [code, setCode] = useState("");
  
  const pattern = /\b\d{5}\b/;
  const regex = new RegExp(pattern);
  const codeValidate = regex.test(code);


  const handleCode = async() => {
    
    try {
      const resp = await disabilityApi.post<any>(`/auth/codeReview/${id}/${code}`)
    
      
      if( resp.status !== 200 ){
          return Alert.alert("Error", "Error nuevamente");
      }
      
      navigation.replace('ChangePassword', {
        userId: resp.data.id
      });
      
    } catch (error: any) {
      console.log('error', error.response.data.msg);
      Alert.alert('Invalid information', error.response.data.msg || 'Code invalid');
    }
    
  }
  return (
    <View style={ globalStyles.login }>
        <Text style={{ color: 'white', marginVertical: 20, fontSize: 16 }}>Please insert the code</Text>
        <Input 
          label="Code" 
          value={ code }
          placeholder={ "Insert code" }
          backgroundInputColor={"black"}
          inputTextColor="white"
          keyboardType={ "numeric" } 
          setValue={ (val : string) => {
            if( val.length <= 6  ) return setCode(val);
          }}
        />
        <Button label="Send" onPress={ handleCode } disabled={false}/>
    </View>
  )
}

export default InsertCode;