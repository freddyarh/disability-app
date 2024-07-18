import React, { useCallback, useEffect, useState } from 'react'
import disabilityApi from '../api/disabilityApi';
import { StyleSheet, Text, View, useWindowDimensions, RefreshControl } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { User } from '../interfaces/appInterfaces';
import Button from '../components/Button';
import { globalStyles } from '../styles/globalStyles';
import IconGoBack from '../components/IconGoBack';
import { LoadingScreen } from './LoadingScreen';
import { colors } from '../styles/colors';
import Animated, { FadeIn } from 'react-native-reanimated';

export const StaffMembers = ({ navigation }: any) => {
  
  const { height } = useWindowDimensions();
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    getStaffMembers();
  }, []);

  const getStaffMembers = async() => {
    const { data: users } = await disabilityApi.get<any>('/users/getAllUsers');
    setStaffUsers( users.users );
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
    
        getStaffMembers();
        setRefreshing(false);
        
    }, 1000);
  }, []);
  const usersSuperAdmin = staffUsers.filter( (user: any) => user?.role === "SUPER_ADMIN" );
  const usersStaff = staffUsers.filter( (user: any) => user?.role === "STAFF" );

  if ( usersSuperAdmin.length === 0 ) return <LoadingScreen />;
  
  return (
    <Animated.ScrollView
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      } entering={ FadeIn.duration(500)}>
      <View style={[ globalStyles.container ]}>
        <IconGoBack navigation={ navigation } backgroundColor={ colors.aquaMist } />
        <Button label={ "Create new staff" } onPress={ () => navigation.navigate( "Create Staff Members" )} disabled={ false } />
        <View style={{ marginTop: 20 }}>
          <View>
            <Text style={ styles.title }>Super admin</Text>
            { usersSuperAdmin.map((user) => (
                <Card.Title key={ user.uid }
                    title={ `${ user.name } ${ user.lastName }` }
                    titleStyle={{ color: colors.black }}
                    subtitleStyle={{ color: colors.black }}
                    subtitle={ user.email }
                    left={(props) => <Avatar.Icon {...props} color={ "white" } style={{ backgroundColor: colors.aquaMist }} icon="account" />}
                    // right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
                  />
                ))}
          </View>
          <View>
            <Text style={ styles.title }>Staff</Text>
            { usersStaff.map((user) => (
              <Card.Title key={ user.uid }
              title={ `${ user.name } ${ user.lastName }` }
              titleStyle={{ color: colors.black }}
              subtitleStyle={{ color: colors.black }}
              subtitle={ user.email }
              left={(props) => <Avatar.Icon {...props} color={ "white" } style={{ backgroundColor: colors.aquaMist }} icon="account" />}
              // right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
              />
              ))}
          </View>
        </View>
      </View> 
    </Animated.ScrollView>
  )
};

const styles = StyleSheet.create({
  title: {
    color: colors.black,
    marginLeft: 10,
    fontSize: 20
  }
});

export default StaffMembers;