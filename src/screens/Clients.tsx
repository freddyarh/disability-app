import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Avatar, Card, Button as ButtonPaper } from 'react-native-paper';
import Button from '../components/Button';
import { clientJson } from './clientJson';

const Clients = ({ navigation }: any) => {
  return (
    <>
        { clientJson.map( (client, index) => (
            // <TouchableOpacity key={ index } 
            //     onPress={ () => navigation.navigate("Client Profile",{
            //         clientUid: client.uid
            //     })}
            // >
                <Card key={ index } style={{ alignItems: 'flex-start', marginBottom: 10, marginTop: 10}}>
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
                        <ButtonPaper onPress={ () => { console.log("Button Form") } }>Form</ButtonPaper>
                    </Card.Actions>
                </Card>
            // </TouchableOpacity>
        ))}
        <Button label={ "Create new client" } buttonEvent={ () => navigation.navigate("Form Client")} disabled={ false } />
        <Button label={ "Create new staff" } buttonEvent={ () => navigation.navigate("Staff Members")} disabled={ false } />
    </>
  )
}

export default Clients;