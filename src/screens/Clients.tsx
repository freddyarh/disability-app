import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar, Card, Button as ButtonPaper } from 'react-native-paper';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import { Client, Clients as ClientsInterface } from '../interfaces/appInterfaces';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { LoadingScreen } from './LoadingScreen';
    

const Clients = ({ navigation }: any ) => {
    const { user } = useContext(AuthContext);
    const { height } = useWindowDimensions();

    const [dataClients, setDataClients] = useState<Client | Client[]>([]);
    const [status, setStatus] = useState<Number>();
    const [statusByStaff, setStatusByStaff] = useState<Number>();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user?.role === "SUPER_ADMIN" ) {
            getAllClients();
        }else{
            getClientsByStaff();
        }
    }, []);

    const getAllClients = async() => {
        const { data: { clients }, status } = await disabilityApi.get<ClientsInterface>('/clients/getAllClients');
        setDataClients( clients );
        setStatus( status );
    }
    
    const getClientsByStaff = async() => {
        const { data: { clients }, status} = await disabilityApi.get<ClientsInterface>(`/clients/getClientsByStaff/${user?.uid}`);
        setDataClients( clients );
        setStatusByStaff( status );
    }
    
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getAllClients();
            setRefreshing(false);
        }, 1000);
      }, []);
    
    if ( (statusByStaff !== 200) && (status !== 200) ) return <LoadingScreen />;

    interface Props {
        label: string,
        onPress: () => void,
        backgroundColor: string
    }

    const BtnBoxClient = ({ label, onPress, backgroundColor }: Props) => {
        return (
            <TouchableOpacity 
                style={
                    [
                        styles.button,
                        user?.role === "STAFF" ? { width: '100%' } : { width: '33%' }, 
                        { backgroundColor: backgroundColor }
                    ]
                }
                onPress={ onPress }
                disabled={ false }
             >
                <Text style={styles.btnText}>{ label }</Text>
            </TouchableOpacity>
        )
    }

    return (
        
        <ScrollView
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            <View style={[globalStyles.container, { minHeight: height }]}>

                { user?.role === "SUPER_ADMIN" && (
                    <View style={{ marginBottom: 10 }}>
                        <Button label={ "Create new client" } onPress={ () => navigation.navigate("CreateClientProfile")} disabled={ false } />
                    </View>
                )}

                { dataClients.map((client: Client, index: number): Client[] | any => (

                    <View key={ index } style={[ styles.clientBox, { marginTop: 10 } ]}>
                        <View style={ styles.btnRow }>
                            <Text style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                                <Avatar.Icon icon="account" color={ 'white' } size={ 40 } style={{ backgroundColor: colors.aquaGreen }} />
                            </Text>
                            <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                                <Text style={{ fontSize: 18, marginBottom: 10, }}>{ client.name }</Text>
                                { user?.role === "SUPER_ADMIN" && (
                                    <>
                                    <Text style={{ marginBottom: 7 }}>Staff</Text>
                                        { client.user.map(( user, index ): any => (
                                            <View key={ index } style={{  flexDirection: 'row' }}>
                                                <Avatar.Icon icon="account-tie" color={ colors.aquaGreen } size={ 30 } style={{ backgroundColor: colors.white, paddingBottom: 10 }} />
                                                <Text> { user.name }</Text>
                                            </View>
                                        ))}
                                    </>
                                )}
                            </View>
                        </View>            
                        <View style={ styles.btnRow }>
                            <BtnBoxClient 
                                    label={"Form"} 
                                    backgroundColor={ colors.aquaDark } 
                                    onPress={ () => navigation.navigate("Client Form", {
                                        clientUid: client._id,
                                        clientName: client.name
                                    }) }/>
                            { user?.role === "SUPER_ADMIN" && (
                                <>
                                    <BtnBoxClient 
                                        label={"Report"} 
                                        backgroundColor={ colors.aquaGreen } 
                                        onPress={ () => navigation.navigate("Client Report", {
                                            clientUid: client._id,
                                            clientName: client.name
                                        }) }/>
                                    <BtnBoxClient 
                                        label={"Info"} backgroundColor={ colors.aquaMiddle } 
                                        onPress={ () => navigation.navigate("Client Profile", {
                                            clientUid: client._id
                                    }) }/>
                                </>
                            )}
                        </View>            
                    </View>
                ))}
            </View>
        </ScrollView>
    
    )
}

const styles = StyleSheet.create({
    title: {
        color: colors.titleColor,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: -10,
        marginLeft: 10
    },
    clientBox: {
        flexDirection: 'column',
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        // Box shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    btnRow: {
        flexDirection: 'row',
    },
    button: {
        marginTop: 20,
        marginRight: 5,
        height: 50,
        borderRadius: 30,
        color: colors.black,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    }
  });

export default Clients;