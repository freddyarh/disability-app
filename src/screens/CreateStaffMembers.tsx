import React, { useContext, useEffect, useState } from 'react';
import { Text, View, useWindowDimensions, Alert, Keyboard } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import DropDown from '../components/DropDown';
import IconGoBack from '../components/IconGoBack';
import Input from '../components/Input';
import { AuthContext } from '../context/AuthContext'
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const CreateStaffMembers = ({ navigation }: any) => {

  const { height } = useWindowDimensions();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
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

  const resetFields = () => {

    setName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setValueRole([]);
    Keyboard.dismiss();

  };
  
  const handleCreateStaff = async() => {

    if( password !== repeatPassword ) return Alert.alert("Invalid information","Password and repeat password are not the same");
    
    const resp = await signUp({ name, lastName, email, password, role: valueRole });
    if( resp === 200 ) return resetFields();
  };

  return (
    <Animated.ScrollView entering={ FadeIn.duration(500) }>
      <View style={[ globalStyles.container ]}>
          <IconGoBack navigation={ navigation } backgroundColor={ colors.aquaMist } />
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
            <Button label="Create Staff" iconName="account-plus" onPress={ handleCreateStaff } disabled={false}/>
          </View>
      </View>
    </Animated.ScrollView>
  )
}

export default CreateStaffMembers;