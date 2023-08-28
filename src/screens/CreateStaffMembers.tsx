import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import DropDown from '../components/DropDown';
import IconGoBack from '../components/IconGoBack';
import Input from '../components/Input';
import { AuthContext } from '../context/AuthContext'
import { globalStyles } from '../styles/globalStyles';

const CreateStaffMembers = ({ navigation }: any) => {

  const [name, setName] = useState("staff");
  const [lastName, setLastName] = useState("staff lastName");
  const [email, setEmail] = useState("staff@gmail.com");
  const [password, setPassword] = useState("123456");
  const [repeatPassword, setRepeatPassword] = useState("123456");
  const [role, setRole] = useState([]);
  const [valueRole, setValueRole] = useState([]);
  const { signUp } = useContext( AuthContext );


  useEffect(() => {
    getAllRoles();
  }, []);

  const getAllRoles = async() => {
    const { data } = await disabilityApi.get<any>('/users/getAllRoles');
    
    const roleList = await data.roles.map((item: any) => {
      return {
        ...item,
        label: item.role,
        value: item.role
      }
    });
    setRole( roleList );
  };
  
  const handleCreateStaff = () => {
    
    signUp({ name, lastName, email, password, role: valueRole });
  };

  return (
    <View style={ globalStyles.container }>
        <IconGoBack navigation={ navigation }/>
        {/* <Text>Create staff memeber</Text> */}
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
        <DropDown
            title={"Select role"}
            items={ role }
            value={ valueRole }
            setItems={ setRole }
            setValue={ setValueRole }
        />

        <Button label="Create Staff" buttonEvent={ handleCreateStaff } disabled={false}/>

    </View>
  )
}

export default CreateStaffMembers;