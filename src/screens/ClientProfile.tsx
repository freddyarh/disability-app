import React, { useEffect, useState } from 'react';
import { useWindowDimensions, View, Alert, Keyboard, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import DropDown from '../components/DropDown';
import IconGoBack from '../components/IconGoBack';
import Input from '../components/Input';
import { Client } from '../interfaces/appInterfaces';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { LoadingScreen } from './LoadingScreen';

const ClientProfile = ({ route, navigation }: any ) => {

    const { height } = useWindowDimensions();
    const { clientUid } = route.params;

    const [dataClient, setDataClient] = useState<Client|null>(null);
    const [dataUsers, setDataUsers] = useState([]);
    const [emergency, setEmergency] = useState<number | any>("");
    const [NDISGoals, setNDISGoals] = useState<string>("");
    const [valueUsers, setValueUsers ] = useState([]);
    const [open1, setOpen1] = useState(false);
    
    useEffect(() => {
        getClient();
    }, [clientUid]);
    
    useEffect(() => {
        getAllStaff();
    }, [clientUid]);
    
    const getClient = async() => {

        const { data } = await disabilityApi.get<Client | any>(`/clients/${clientUid}`);
        const staffClient: any = data.client.user.map((client: Client) => {
            return  client.uid;
        });
        setEmergency(JSON.stringify(data.client.emergencyContact));
        setNDISGoals(data.client.ndisGoals );
        setValueUsers(staffClient);
        setDataClient(data);
    }
    const getAllStaff = async() => {
        const { data: { users }} = await disabilityApi.get<any>('/users/getAllUsers');
        const usersList = await users.filter( (item: any) => item.role === 'STAFF' ).map((item: any) => {
            return {
              ...item,
              label: item.email,
              value: item.uid
            }
          });
        setDataUsers( usersList );
    }
    const updateClient = async() => {

        Keyboard.dismiss();
        setOpen1(false);

        try {

            const { data: { msg }} = await disabilityApi.put<any>(`/clients/updateClient/${clientUid}`, { emergencyContact: Number(emergency), ndisGoals: NDISGoals, user: valueUsers });
            Alert.alert("Success", msg)
            
        } catch (error) {
            console.log(error);
        }
    }

    if (!dataClient) return <LoadingScreen />;
    
    return (
    <Animated.ScrollView entering={ FadeIn.duration(500)}>
        <View style={[ globalStyles.container ]}>
            <View style={{ marginBottom: 10 }}>
                <IconGoBack navigation={ navigation } backgroundColor={ colors.aquaMist }/>
            </View>
            <Text style={ globalStyles.label }>Name</Text>
            <Input  
                label={ "Name" } 
                value={ dataClient.client.name } 
                disabled
            />
            <Text style={ globalStyles.label }>Date of Birth</Text>            
            <Input  
                label={ "Date of Birth" }
                value={ dataClient.client.dateOfBirth } 
                disabled 
            />
            <Text style={ globalStyles.label }>Gender</Text>
            <Input  
                label={ "Gender" }
                value={ dataClient.client.gender } 
                disabled 
            />
            <Text style={ globalStyles.label }>NDIS Number</Text>
            <Input 
                label={"NDIS Number"}
                value={ JSON.stringify(dataClient.client.ndisNumber)}
                disabled 
            />
            <Text style={ globalStyles.label }>Emergency Contact</Text>      
            <Input 
                label={"Emergency Contact"}
                value={ emergency }
                setValue={ setEmergency }
                keyboardType={ "numeric" }
            />
            <Text style={ globalStyles.label }>NDIS Goals</Text>      
            <Input 
                label={"NDIS Goals"}
                value={ NDISGoals }
                setValue={ setNDISGoals }
            />
            <Text style={ globalStyles.label }>Assessment</Text>
            <Input 
                label={"Assessment"}
                value={ dataClient.client.assessment }
                disabled
            />
            <Text style={ globalStyles.label }>Staffs</Text>
            <View >
                <DropDown
                    title={"Select Staff"}
                    items={dataUsers}
                    value={ valueUsers }
                    setItems={setDataUsers}
                    setValue={ setValueUsers }
                    open={ open1 }
                    setOpen={(val: boolean) => {
                        setOpen1(val);
                    }}
                    multiple
                />
            </View>
            <Button
                label={ "Update client" }
                onPress={ updateClient }
                disabled={ false }
            />
        </View>
    </Animated.ScrollView>
  )
}

export default ClientProfile