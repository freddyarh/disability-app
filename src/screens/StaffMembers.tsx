import React, { useEffect, useState } from 'react'
import disabilityApi from '../api/disabilityApi';
import { ScrollView, Text, View } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { User } from '../interfaces/appInterfaces';
import Button from '../components/Button';
import { globalStyles } from '../styles/globalStyles';

export const StaffMembers = ({ navigation }: any) => {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getStaffMembers();
  }, [users])

  const getStaffMembers = async() => {
    const { data } = await disabilityApi.get<User[]>('/users/getAllUsers');
    setUsers( data.users );
  }

  if ( users.length === 0 ) return null;
  
  return (
    <View style={ globalStyles.container }>
      <ScrollView>
        { users.map((user) => (
            <Card.Title key={ user.uid }
                title={ `${ user.name } ${ user.lastName }` }
                subtitle={ user.email }
                left={(props) => <Avatar.Icon {...props} icon="account" />}
                right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
              />
            ))}
        <Button label={ "Create new staff" } buttonEvent={ () => navigation.navigate("Create Staff Members")} disabled={ false } />
      </ScrollView>
    </View>
  )
}

export default StaffMembers;