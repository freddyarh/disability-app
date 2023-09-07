import React, { useContext } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    List,
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import{ AuthContext } from '../context/AuthContext';


export function DrawerContent(props: any) {
    
    const { logOut, user } = useContext(AuthContext);

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        {/* <View style={{flexDirection:'column',marginTop: 15}}> */}
                        {/* <Image
                            style={styles.logo}
                            source={require('../assets/images/logo.jpeg')}
                            resizeMode="contain"
                        />  */}
                        {/* </View> */}
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Icon {...props} icon="account" color="white" size={ 50 } />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>{ user?.name + " " + user?.lastName}</Title>
                                <Caption style={styles.caption}>{ user?.email }</Caption>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}></Paragraph>
                                <Caption style={styles.caption}>Menu</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem 
                            icon={({color, size}) => (
                                <Avatar.Icon {...props} icon="home-account" color="white" size={ size } />
                            )}

                            label="Participants"
                            onPress={() => {props.navigation.navigate('Clients')}}
                            labelStyle={ styles.listItem }
                        />
                        { user?.role === 'SUPER_ADMIN' && (
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Avatar.Icon {...props} icon="account-multiple" color="white" size={ size } />
                                )}

                                label="Users"
                                onPress={() => {props.navigation.navigate('Staff Members')}}
                                labelStyle={ styles.listItem }
                            />
                        )}
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Avatar.Icon {...props} icon="logout" color="white" size={ size } />
                    )}
                    label="Sign Out"
                    onPress={ logOut }
                    labelStyle={ styles.listItem }
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    logo: {
        width: '30%',
        minWidth: 240,
        maxHeight: 200,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    //   fontFamily: 'FieldGeoRegular', 
      color: "gray"
    },
    listItem: {
        fontSize: 15, 
        // fontFamily: 'FieldGeoRegular', 
        color: "gray"
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: "rgb(136, 131, 140)",
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });