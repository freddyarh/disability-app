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
  const [open1, setOpen1] = useState(false);
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
        <IconGoBack navigation={ navigation } color={ 'black' } backgroundColor={ 'rgb(242, 242, 242)' } />
        <View style={{ marginTop: 20 }} >
          <Text style={ globalStyles.label }>Name</Text>
          <Input
            label={ "Name" }
            value={ name }
            setValue={ setName }
          />
          <Text style={ globalStyles.label }>Last name</Text>
          <Input 
            label={ "Last name" }
            value={ lastName }
            setValue={ setLastName }
          />
          <Text style={ globalStyles.label }>Email</Text>
          <Input 
            label={ "Email" }
            value={ email }
            setValue={ setEmail }
          />
          <Text style={ globalStyles.label }>Password</Text>
          <Input 
            label={ "Password" }
            value={ password }
            setValue={ setPassword }
          />
          <Text style={ globalStyles.label }>Repeat password</Text>
          <Input 
            label={ "Repeat password" }
            value={ repeatPassword }
            setValue={ setRepeatPassword }
          />
          <Text style={ globalStyles.label }>Select role</Text>
          <DropDown
              title={"Select role"}
              items={ role }
              value={ valueRole }
              open={ open1 }
              setOpen={ (val: boolean) => {
                setOpen1(val);
              }}
              setItems={ setRole }
              setValue={ setValueRole }
          />
          <Button label="Create Staff" onPress={ handleCreateStaff } disabled={false}/>
        </View>
    </View>
  )
}

export default CreateStaffMembers;