import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar, Card, Button as ButtonPaper } from 'react-native-paper';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';

const Clients = ({ navigation }: any) => {
    const { height } = useWindowDimensions();

    const [dataClients, setDataClients] = useState<[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getAllClients();
    }, []);

    const getAllClients = async() => {
        const { data: { clients }} = await disabilityApi.get<any>('/clients/getAllClients');
        setDataClients( clients );
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getAllClients();
            setRefreshing(false);
        }, 2000);
      }, []);
    
    if ( dataClients.length === 0 ) return null;

    return (
        <ScrollView
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            <View style={[globalStyles.container, { minHeight: height }]}>
                { dataClients.map( (client, index): any => (
                    // <TouchableOpacity key={ index } 
                    //     onPress={ () => navigation.navigate("Client Profile",{
                    //         clientUid: client.uid
                    //     })}
                    // >
                        <Card key={ index } style={{ alignItems: 'flex-start', margin: 10}}>
                            <Card.Title
                                title={ client.name }
                                subtitle={ client._id }
                                left={(props) => <Avatar.Icon {...props} icon="account" />}
                            />
                            <Card.Actions style={{ flexDirection: 'row' }}>
                                <ButtonPaper onPress={ () => navigation.navigate("Client Profile", {
                                    clientUid: client._id
                                })}>Info</ButtonPaper>
                                <ButtonPaper onPress={ () => navigation.navigate("Client Report", {
                                    clientUid: client._id,
                                    clientName: client.name
                                }) }>Report</ButtonPaper>
                                <ButtonPaper onPress={ () => navigation.navigate("Client Form", {
                                    clientUid: client._id,
                                    clientName: client.name
                                }) }>Form</ButtonPaper>
                            </Card.Actions>
                        </Card>
                    // </TouchableOpacity>
                ))}
                <Button label={ "Create new client" } buttonEvent={ () => navigation.navigate("CreateClientProfile")} disabled={ false } />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        color: "rgb(133, 187, 157)",
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -10,
        marginLeft: 10
    }
  });

export default Clients;