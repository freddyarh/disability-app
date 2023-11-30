import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions, Text, Image, StyleSheet, ScrollViewComponent, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { BarChart, LineChart } from "react-native-chart-kit";
import { captureRef } from 'react-native-view-shot';
import { cacheDirectory, copyAsync, getInfoAsync, makeDirectoryAsync, uploadAsync } from 'expo-file-system';
import { getFormatedDate } from "react-native-modern-datepicker";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import IconGoBack from '../components/IconGoBack';
import { ClientForm } from '../interfaces/appInterfaces';
import { globalStyles } from '../styles/globalStyles';
import { Platform } from 'react-native';
import Datepicker from '../components/Datepicker';
import Input from '../components/Input';

const ClientReport = ({ route, navigation }: any ) => {

  const { clientUid, clientName } = route.params;

  const [startDate, setStartDate] = useState("2012/12/20");
  const [endDate, setEndDate] = useState("2022/12/20");
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [startedDate, setStartedDate] = useState("12/12/2023");
  const [endedDate, setEndedDate] = useState("12/12/2023");
  const [data, setData] = useState([]);
  const [functionalValues, setFunctionalValues] = useState<any>([0, 0, 0]);

  const today = new Date();
  const initDate = getFormatedDate(
  today.setDate(today.getDate()),
  "1900/01/01"
  );

  const maxiDate = getFormatedDate(
  today.setDate(today.getDate() - 1),
  "YYYY/MM/DD"
  );
  
  function handleChangeStartDate(propDate: any) {
      setStartedDate(propDate);
  }
  function handleChangeEndDate(propDate: any) {
    setEndedDate(propDate);
  }
  const handleOnPressStartDate = () => {
      setOpenStartDatePicker(!openStartDatePicker);
      Keyboard.dismiss();
  }
  const handleOnPressEndDate = () => {
      setOpenEndDatePicker(!openEndDatePicker);
      Keyboard.dismiss();
  }

  // useEffect(() => {
  //   getFormsByClient();
  // }, [clientUid]);
  
  const getFormsByClient = async() => {
    const { data } = await disabilityApi.post<ClientForm>(`/clients/getReportByClient/${clientUid}`, { startDate, endDate });
    setData( data.formsByClient );
    console.log(data.formsByClient);
    const functionalArr = ["WANT SOMETHING", "ESCAPE OR AVOID SOMETHING", "PROTEST OR SHOW DISLIKE FOR SOMETHING"];
    setFunctionalValues([]);
    for (const key in functionalArr) {
      const activity = data.formsByClient.filter((value: ClientForm) => value.functionality === functionalArr[key]);
      setFunctionalValues((val: any) => [...val, activity.length]);
    }
    console.log(functionalValues);
    // setWs(activity.length);
    // console.log('activity', activity.length)
  };
  
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    </head>
    <body style="text-align: center;">
      <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
        Hello Fredy!
      </h1>
      <img
        src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
        style="width: 90vw;" />
    </body>
  </html>
  `;
  const viewToSnapShotRef = useRef();
  const [snapshotImg, setSnapshotImg] = useState<any>();
  const [selectedPrinter, setSelectedPrinter] = useState<any>();
  
  const snapshot = async() => {
    
    const result = await captureRef( viewToSnapShotRef, {
      fileName: "prueba",
      result: 'tmpfile',
      height: 200,
      width: 160,
      quality: 1,
      format: 'jpg', }).then(
        async(uri) => {
          setSnapshotImg(uri);
          console.log("Image saved to", uri)
          const html = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              </head>
              <body style="text-align: center;">
                <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
                  Hello Fredy!
                </h1>
                <img
                  src=${ uri }
                  />
              </body>
            </html>
            `;
            await Print.printAsync({
              html,
              margins: {
                left: 10,
                top: 50,
                right: 10,
                bottom: 50,
              },
              printerUrl: selectedPrinter?.url, // iOS only
            }).catch(err => console.log('This is the error ', err))
        },
        (error) => console.error("Oops, snapshot failed", error)
      );

  }

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    // await Print.printAsync({
    //   html,
    //   printerUrl: selectedPrinter?.url, // iOS only
    // });
  };

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html, margins: {
      left: 20,
      top: 50,
      right: 20,
      bottom: 100,
    },});
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
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
    <ScrollView>
      <View style={{ padding: '4%' }}>
      <IconGoBack navigation={ navigation } color={ 'black' } backgroundColor={ 'rgb(242, 242, 242)' }/>
      <Text style={{ paddingVertical: '4%' }}>Client name: { clientName }</Text>
        <TouchableOpacity>
          <Input 
              label={"Start date"} 
              value={ startDate }
              onAccion={ handleOnPressStartDate }
          />
          </TouchableOpacity>
          <Datepicker 
              mode={ "calendar" }
              openStartDatePicker={ openStartDatePicker }
              startDate={ initDate }
              maxiDate={ maxiDate }
              startedDate={ startedDate }
              handleChangeStartDate={ handleChangeStartDate }
              setDate={ setStartDate }
              handleOnPressStartDate={ handleOnPressStartDate }
          />
          <TouchableOpacity>
              <Input 
                  label={"End date"} 
                  value={ endDate }
                  onAccion={ handleOnPressEndDate }
              />
          </TouchableOpacity>
          <Datepicker 
              mode={ "calendar" }
              openStartDatePicker={ openEndDatePicker }
              startDate={ startedDate }
              maxiDate={ maxiDate }
              startedDate={ endedDate }
              handleChangeStartDate={ handleChangeEndDate }
              setDate={ setEndDate }
              handleOnPressStartDate={ handleOnPressEndDate }
          />
          <Button 
            label={ "Create report" }
            // onPress={ snapshot }
            onPress={ getFormsByClient }
            disabled={ false }
          />
      </View>
      <View>
        <View ref={ viewToSnapShotRef }>
          <Text>Functionality</Text>
            <Text>Want somenthing: {`${12}`}</Text>
            <Text>Escape or avoid something: {`${12}`}</Text>
            <Text>Protest or show dislike for something: {`${12}`}</Text>
            <Text>Total: {`${12}`}</Text>
          
          {/* <LineChart
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
          /> */}
          <BarChart
            data={{
              labels: [
                "Want something",
                "Escape or avoid something",
                "Protest or show dislike for something",
              ],
              datasets: [
                {
                  data: functionalValues,
                },
              ],
            }}
            verticalLabelRotation={10}
            width={Dimensions.get('window').width}
            height={300}
            // yAxisLabel={'Rs'}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 90, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            />
          <Text>Prompt</Text>
            <Text>Redirect: {`${12}`}</Text>
            <Text>Identify trigger: {`${12}`}</Text>
            <Text>Remove trigger: {`${12}`}</Text>
            <Text>Negative reinforcement: {`${12}`}</Text>
            <Text>Rxtinction: {`${12}`}</Text>
            <Text>Total: {`${12}`}</Text>
          <BarChart
            data={{
              labels: [
                "Redirect",
                "Identify trigger",
                "Remove trigger",
                "Negative reinforcement",
                "Rxtinction",
                "Total",
              ],
              datasets: [
                {
                  data: [12, 5, 7, 13, 4, 13],
                },
              ],
            }}
            verticalLabelRotation={10}
            width={Dimensions.get('window').width}
            height={300}
            // yAxisLabel={'Rs'}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 0,
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
{/* 
          { snapshotImg && <Text>Preview:</Text> }
          { snapshotImg && <Image resizeMode='contain' style={ styles.snapshotImag } source={ {uri: snapshotImg} } />} */}
          </View>
          <Button 
            label={ "Create" }
            onPress={ snapshot }
            disabled={ false }
          />
          <Button 
            label={ "Print" }
            onPress={ print }
            disabled={ false }
          />
        <View style={styles.spacer} />
        <Button 
            label={ "Print to PDF file" }
            onPress={ printToFile }
            disabled={ false }
          />
        {Platform.OS === 'ios' && (
          <>
            <View style={styles.spacer} />
            <Button 
            label={ "Select printer" }
            onPress={ selectPrinter }
            disabled={ false }
          />
            <View style={styles.spacer} />
            {selectedPrinter ? (
              <Text style={styles.printer}>{`Selected printer: ${selectedPrinter.name}`}</Text>
            ) : undefined}
          </>
        )}
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  snapshotImag: {
      width: 300,
      height: 900,
      // margin: 16
  },
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: 'center',
  },
});

export default ClientReport;