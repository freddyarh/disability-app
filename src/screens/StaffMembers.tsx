import React, { useContext, useEffect, useState } from 'react'
import disabilityApi from '../api/disabilityApi';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { User } from '../interfaces/appInterfaces';
import Button from '../components/Button';
import { globalStyles } from '../styles/globalStyles';
import { color } from 'react-native-reanimated';
import { AuthContext } from '../context/AuthContext';
import IconGoBack from '../components/IconGoBack';

export const StaffMembers = ({ navigation }: any) => {

  const [superUsers, setSuperUsers] = useState<User[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);

  useEffect(() => {
    getStaffMembers();
    console.log('get staff running')
  }, [])

  const getStaffMembers = async() => {
    const { data: users } = await disabilityApi.get<any>('/users/getAllUsers');

    setStaffUsers( users.users );
  }
  const usersSuperAdmin = staffUsers.filter( (user: any) => user.role === 'SUPER_ADMIN' );
  const usersStaff = staffUsers.filter( (user: any) => user.role === 'STAFF' );

  if ( usersStaff.length === 0 ) return null;
  
  return (
    <ScrollView>
      <View style={ globalStyles.container }>
      <IconGoBack navigation={ navigation }/>
        <View>
          <Text style={ styles.title }>Super admin</Text>
          { usersSuperAdmin.map((user) => (
              <Card.Title key={ user.uid }
                  title={ `${ user.name } ${ user.lastName }` }
                  titleStyle={{ color: 'white' }}
                  subtitleStyle={{ color: 'white' }}
                  subtitle={ user.email }
                  left={(props) => <Avatar.Icon {...props} icon="account" />}
                  right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
                />
              ))}
        </View>
        <View>
          <Text style={ styles.title }>Staff</Text>
          { usersStaff.map((user) => (
            <Card.Title key={ user.uid }
            title={ `${ user.name } ${ user.lastName }` }
            titleStyle={{ color: 'white' }}
            subtitleStyle={{ color: 'white' }}
            subtitle={ user.email }
            left={(props) => <Avatar.Icon {...props} icon="account" />}
            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
            />
            ))}
        </View>
        <Button label={ "Create a new user" } buttonEvent={ () => navigation.navigate( "Create Staff Members" )} disabled={ false } />
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  title: {
    color: "rgb(133, 187, 157)",
    marginLeft: 10,
    fontSize: 20
  }
});

export default StaffMembers;