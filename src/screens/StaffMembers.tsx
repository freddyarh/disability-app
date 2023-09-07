import React, { useContext, useEffect, useState } from 'react'
import disabilityApi from '../api/disabilityApi';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { User } from '../interfaces/appInterfaces';
import Button from '../components/Button';
import { globalStyles } from '../styles/globalStyles';
import { color } from 'react-native-reanimated';
import { AuthContext } from '../context/AuthContext';
import IconGoBack from '../components/IconGoBack';
import { LoadingScreen } from './LoadingScreen';

export const StaffMembers = ({ navigation }: any) => {
  
  const { height } = useWindowDimensions();
  const [staffUsers, setStaffUsers] = useState<User[]>([]);

  useEffect(() => {
    getStaffMembers();
  }, []);

  const getStaffMembers = async() => {
    const { data: users } = await disabilityApi.get<any>('/users/getAllUsers');
    console.log(users.users)
    setStaffUsers( users.users );
  }
  const usersSuperAdmin = staffUsers.filter( (user: any) => user?.role === "SUPER_ADMIN" );
  const usersStaff = staffUsers.filter( (user: any) => user?.role === "STAFF" );

  if ( usersSuperAdmin.length === 0 ) return <LoadingScreen />;
  
  return (
    <ScrollView>
      <View style={[ globalStyles.container, { minHeight: height } ]}>
      <IconGoBack navigation={ navigation }/>
      <Button label={ "Create new staff" } onPress={ () => navigation.navigate( "Create Staff Members" )} disabled={ false } />
      <View style={{ marginTop: 20 }}>
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
      </View>
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