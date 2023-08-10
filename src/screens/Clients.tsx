import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Avatar, Card, Button as ButtonPaper } from 'react-native-paper';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';
import { clientJson } from './clientJson';

const Clients = ({ navigation }: any) => {

  return (
    <View style={ globalStyles.container }>
        { clientJson.map( (client, index) => (
            // <TouchableOpacity key={ index } 
            //     onPress={ () => navigation.navigate("Client Profile",{
            //         clientUid: client.uid
            //     })}
            // >
                <Card key={ index } style={{ alignItems: 'flex-start', margin: 10}}>
                    <Card.Title
                        title={ client.name }
                        subtitle={ client.uid }
                        left={(props) => <Avatar.Icon {...props} icon="account" />}
                    />
                    <Card.Actions style={{ flexDirection: 'row' }}>
                        <ButtonPaper onPress={ () => navigation.navigate("Client Profile",{
                            clientUid: client.uid
                        })}>Info</ButtonPaper>
                        <ButtonPaper onPress={ () => { console.log("Button Report") } }>Report</ButtonPaper>
                        <ButtonPaper onPress={ () => navigation.navigate("Client Form") }>Form</ButtonPaper>
                    </Card.Actions>
                </Card>
            // </TouchableOpacity>
        ))}

        <Button label={ "Create new staff" } buttonEvent={ () => navigation.navigate("Create Staff Members")} disabled={ false } />
        <Button label={ "Create new client" } buttonEvent={ () => navigation.navigate("ClientProfileForm")} disabled={ false } />

    </View>
  )
}

export default Clients;