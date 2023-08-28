import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart, LineChart } from "react-native-chart-kit";
import disabilityApi from '../api/disabilityApi';
import IconGoBack from '../components/IconGoBack';
import { ClientForm } from '../interfaces/appInterfaces';
import { globalStyles } from '../styles/globalStyles';

const ClientReport = ({ navigation }: any ) => {

  useEffect(() => {
    
  }, []);
  
  useEffect(() => {
    getFormsByClient();
  }, []);
  
  const getFormsByClient = async() => {
    const startDate = "2023/08/07 00:00";
    const endDate = "2023/08/09 00:00";
    const { data } = await disabilityApi.post<ClientForm>('/clients/getReportByClient/64def105bfc0dc665d293a5e', { startDate, endDate });

    console.log(data)

  };

  const screenWidth = Dimensions.get("window").width;

  const line = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2, // optional
      },
    ],
  };

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  return (
    <View>
      <IconGoBack navigation={ navigation } color={ 'black' } backgroundColor={ 'rgb(242, 242, 242)' }/>
      {/* <Text>Client Report</Text> */}
      <LineChart
        data={line}
        width={Dimensions.get('window').width} // from react-native
        height={220}
        yAxisLabel={'$'}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: 'rgb(247, 243, 249)',
          backgroundGradientTo: 'rgb(247, 243, 249)',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
      <BarChart
        data={{
          labels: [
            'Activity',
            'February',
            'March',
            'April',
            'May',
            'June',
          ],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43],
            },
          ],
        }}
        verticalLabelRotation={90}
        width={Dimensions.get('window').width - 16}
        height={300}
        yAxisLabel={'Rs'}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  )
}

export default ClientReport;