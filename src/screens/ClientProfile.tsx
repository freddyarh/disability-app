import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Input from '../components/Input';
import { Client } from '../interfaces/appInterfaces';
import { clientJson } from './clientJson';

const ClientProfile = ({ route }: any ) => {

    const { clientUid } = route.params;
    const [dataClient, setDataClient] = useState<Client|null>(null);
    
    useEffect(() => {
        const user = clientJson.find((item) => item.uid === clientUid );
        setDataClient( user );
    }, []);

    if (!dataClient) return null;
    
    return (
    <View>
        <Input  
            label={ "Name" } 
            value={ dataClient.name } 
            disabled 
        />

        <Input  
            label={ "Date of Birth" } 
            value={ dataClient.dateOfBirth } 
            disabled 
        />

        <Input  
            label={ "Gender" } 
            value={ dataClient.gender } 
            disabled 
        />

        <Input 
            label={"NDIS Number"} 
            value={ dataClient.ndisNumber }
            disabled 
        />
        
        <Input 
            label={"Emergency Contact"} 
            value={ dataClient.emergencyContact }
            disabled 
        />
        
        <Input 
            label={"NDIS Goals"} 
            value={ dataClient.ndisGoals }
            disabled 
        />
        
        <Input 
            label={"Assessment"} 
            value={ dataClient.assessment }
            disabled
        />
        <Text>
            { `The state is ${ dataClient.state }` }
        </Text>
    </View>
  )
}

export default ClientProfile