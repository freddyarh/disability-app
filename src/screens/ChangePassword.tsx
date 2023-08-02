
import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { AuthContext } from '../context/AuthContext';

const ChangePassword = () => {

    const { forgotId } = useContext( AuthContext );

    console.log('change', forgotId === "")

  return (
    <View>
        <Text>ChangePassword</Text>
    </View>
  )
}

export default ChangePassword;