import React, { useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import disabilityApi from '../api/disabilityApi';
import IconGoBack from '../components/IconGoBack';
import Input from '../components/Input';
import { Client } from '../interfaces/appInterfaces';
import { globalStyles } from '../styles/globalStyles';

const ClientProfile = ({ route, navigation }: any ) => {

    const { height } = useWindowDimensions();
    const { clientUid } = route.params;

    const [dataClient, setDataClient] = useState<Client|null>(null);
    
    useEffect(() => {
        getClient();
    }, [clientUid]);
    
    const getClient = async() => {

        const { data } = await disabilityApi.get<Client>(`/clients/${clientUid}`);
        setDataClient(data);
    }

    if (!dataClient) return null;
    
    return (
    <View style={[ globalStyles.container, { minHeight: height }]}>
        <IconGoBack navigation={ navigation }/>
        <Input  
            label={ "Name" } 
            value={ dataClient.client.name } 
            disabled 
        />

        <Input  
            label={ "Date of Birth" } 
            value={ dataClient.client.dateOfBirth } 
            disabled 
        />

        <Input  
            label={ "Gender" } 
            value={ dataClient.client.gender } 
            disabled 
        />

        <Input 
            label={"NDIS Number"} 
            value={ JSON.stringify(dataClient.client.ndisNumber)}
            disabled 
        />
        
        <Input 
            label={"Emergency Contact"} 
            value={ JSON.stringify(dataClient.client.emergencyContact)}
            disabled 
        />
        
        <Input 
            label={"NDIS Goals"} 
            value={ dataClient.client.ndisGoals }
            disabled
        />
        
        <Input 
            label={"Assessment"} 
            value={ dataClient.client.assessment }
            disabled
        />
    </View>
  )
}

export default ClientProfile