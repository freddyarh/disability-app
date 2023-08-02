import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { AuthContext } from '../context/AuthContext'

const CreateStaffMembers = () => {
  const [name, setName] = useState("staff");
  const [lastName, setLastName] = useState("staff lastName");
  const [email, setEmail] = useState("staff@gmail.com");
  const [password, setPassword] = useState("123456");
  const [repeatPassword, setRepeatPassword] = useState("123456");
  const [role, setRole] = useState("STAFF");
  const { signUp } = useContext( AuthContext );

  const handleCreateStaff = () => {
    
    signUp({ name, lastName, email, password, role });

  }
  return (
    <View>
        <Text>Create staff memeber</Text>
        <Input 
          label={ "Name" }
          value={ name }
          setValue={ setName }
        />
        <Input 
          label={ "Last name" }
          value={ lastName }
          setValue={ setLastName }
        />
        <Input 
          label={ "Email" }
          value={ email }
          setValue={ setEmail }
        />
        <Input 
          label={ "Password" }
          value={ password }
          setValue={ setPassword }
        />
        <Input 
          label={ "Repeat password" }
          value={ repeatPassword }
          setValue={ setRepeatPassword }
        />
        <Input 
          label={ "Role" }
          value={ role }
          setValue={ setRole }
        />

        <Button label="Create Staff" buttonEvent={ handleCreateStaff } disabled={false}/>

    </View>
  )
}

export default CreateStaffMembers;