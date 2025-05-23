import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Avatar, TextInput, Button as ButtonPaper } from 'react-native-paper';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import { Client, Clients as ClientsInterface } from '../interfaces/appInterfaces';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { LoadingScreen } from './LoadingScreen';
import Input from '../components/Input';
    

const Clients = ({ navigation }: any ) => {
    const { user } = useContext(AuthContext);
    const { height } = useWindowDimensions();

    const [dataClients, setDataClients] = useState<Client[]>([]);
    const [searchClient, setSearchClient] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchClient);
    const [status, setStatus] = useState<Number>();
    const [statusByStaff, setStatusByStaff] = useState<Number>();
    const [refreshing, setRefreshing] = useState<boolean>(false);

    useEffect(() => {
        if (user?.role === "SUPER_ADMIN" ) {
            getAllClients();
        }else{
            getClientsByStaff();
        }
    }, []);

    useEffect(() => {
    const handler = setTimeout(() => {
        setDebouncedSearch(searchClient);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
}, [searchClient]);

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
            if (user?.role === "SUPER_ADMIN" ) {
                getAllClients();
                setRefreshing(false);
            }else{
                getClientsByStaff();
                setRefreshing(false);
            }
        }, 1000);
      }, []);
    
    const filteringClients = useMemo(() => {
        const search = debouncedSearch.toLowerCase();
        return dataClients.filter((client: Client) =>
            client.name.toLowerCase().includes(search)
        );
    }, [dataClients, debouncedSearch]);
    
    if ( (statusByStaff !== 200) && (status !== 200) ) return <LoadingScreen />;

    interface Props {
        label: string,
        onPress: () => void,
        iconName: string,
        backgroundColor: string
    }

    const BtnBoxClient = ({ label, onPress, iconName, backgroundColor }: Props) => {
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
                <Avatar.Icon icon={iconName} size={24} color="#fff" style={{ backgroundColor: 'rgba(0,0,0,0)' }}/>
                <Text style={styles.btnText}>{ label }</Text>
            </TouchableOpacity>
        )
    }

    return (
        
        <Animated.ScrollView
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } entering={ FadeIn.duration(500)}>
            <View style={[globalStyles.container]}>

                { user?.role === "SUPER_ADMIN" && (
                    <>
                        <View style={{ marginBottom: 18 }}>
                            <Button label={ "Create new client" } iconName="account-plus" onPress={ () => navigation.navigate("CreateClientProfile")} disabled={ false } />
                        </View>
                        <View style={{ marginBottom: 6 }}>
                            <Input
                                label="Search Client"
                                placeholder=""
                                value={ searchClient }
                                setValue={ setSearchClient }
                                onAccion={ () => {} }
                                rightEye={ false }
                                multiline={ false }
                                disabled={ false }
                                keyboardType="default"
                                backgroundInputColor="white"
                                inputTextColor="black"
                                accessibilityLabel="Search input field"
                                accessibilityHint="Enter the name of the client you want to search"
                                left={<TextInput.Icon icon="magnify" color={colors.aquaDark} />}
                            />
                        </View>
                    </>
                )}

                { filteringClients.map((client: Client, index: number): Client[] | any => (

                    <View key={ index } style={[ styles.clientBox, { marginTop: 10 } ]}>
                        <View style={ styles.btnRow }>
                            <Text style={{ alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                                <Avatar.Icon icon="account" color={ colors.white } size={ 40 } style={{ backgroundColor: colors.aquaGreen }} />
                            </Text>
                            <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                                <Text style={{ fontSize: Platform.OS === 'android' ? 20 : 17, marginBottom: 10, fontFamily: 'Roboto'}}>{ client.name }</Text>
                                { user?.role === "SUPER_ADMIN" && (
                                    <>
                                    <Text style={{ marginBottom: 7, fontSize: Platform.OS === 'android' ? 17 : 15, color: 'rgba(52, 92, 184, 1)', fontFamily: 'Roboto' }}>Staff</Text>
                                        { client.user.map(( user, index ): any => (
                                            <View key={ index } style={{  flexDirection: 'row' }}>
                                                <Avatar.Icon icon="account-tie" color={ colors.aquaGreen } size={ 30 } style={{ backgroundColor: colors.white, paddingBottom: 10 }} />
                                                <Text style={{ fontSize: Platform.OS === 'android' ? 17 : 15, fontFamily: 'Roboto' }}> { user.name }</Text>
                                            </View>
                                        ))}
                                    </>
                                )}
                            </View>
                        </View>            
                        <View style={ styles.btnRow }>
                            <BtnBoxClient 
                                    label={"Form"} 
                                    iconName="pencil"
                                    backgroundColor={ colors.aquaDark } 
                                    onPress={ () => navigation.navigate("Client Form", {
                                        clientUid: client._id,
                                        clientName: client.name
                                    }) }/>
                            { user?.role === "SUPER_ADMIN" && (
                                <>
                                    <BtnBoxClient 
                                        label={"Report"} 
                                        iconName="chart-bar"
                                        backgroundColor={ colors.aquaGreen } 
                                        onPress={ () => navigation.navigate("Client Report", {
                                            clientUid: client._id,
                                            clientName: client.name
                                        }) }/>
                                    <BtnBoxClient 
                                        label={"Info"} 
                                        iconName="information-variant"
                                        backgroundColor={ colors.aquaMiddle } 
                                        onPress={ () => navigation.navigate("Client Profile", {
                                            clientUid: client._id
                                    }) }/>
                                </>
                            )}
                        </View>            
                    </View>
                ))}
            </View>
        </Animated.ScrollView>
    
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
        height: 45,
        borderRadius: 20,
        color: colors.black,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontSize: Platform.OS === 'android' ? 18 : 16,
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Roboto'
    }
  });

export default Clients;