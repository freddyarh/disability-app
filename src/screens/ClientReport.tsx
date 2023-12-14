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
  const today = new Date();
  const today_ = today.toISOString().split('T')[0].split("-").join("/");
  const [startDate, setStartDate] = useState(today_);
  const [endDate, setEndDate] = useState(today_);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [startedDate, setStartedDate] = useState("12/12/2023");
  const [endedDate, setEndedDate] = useState("12/12/2023");
  const [createReport, setCreateReport] = useState(false);
  const [data, setData] = useState([]);
  const [functionalValues, setFunctionalValues] = useState<any>([0, 0, 0]);
  const [promptValues, setPromptValues] = useState<any>([0, 0, 0, 0, 0]);
  const [activitiesValues1, setActivitiesValues1] = useState<any>([0, 0, 0, 0, 0]);
  const [activitiesValues2, setActivitiesValues2] = useState<any>([0, 0, 0, 0, 0]);

  const initDate = getFormatedDate(
  today.setDate(today.getDate()),
  "1900/01/01"
  );

  const maxiDate = getFormatedDate(
  today.setDate(today.getDate() + 1),
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

  useEffect(() => {
    setCreateReport(false);
  }, [clientUid]);
  
  const createReportByClient = async() => {

    setCreateReport(true);
    const { data } = await disabilityApi.post<ClientForm>(`/clients/getReportByClient/${clientUid}`, { startDate, endDate });

    setData( data.formsByClient );

    const functionalArr = ["WANT SOMETHING", "ESCAPE OR AVOID SOMETHING", "PROTEST OR SHOW DISLIKE FOR SOMETHING"];
    setFunctionalValues([]);
    for (const key in functionalArr) {
      const activity = data.formsByClient.filter((value: ClientForm) => value.functionality === functionalArr[key]);
      setFunctionalValues((val: any) => [...val, activity.length]);
    }
   
    const promptArr = ["REDIRECT",
    "IDENTIFY TRIGGER",
    "REMOVE TRIGGER",
    "NEGATIVE REINFORCEMENT",
    "RXTINCTION"];
    setPromptValues([]);
    for (const key in promptArr) {
      const activity = data.formsByClient.filter((value: ClientForm) => value.prompt === promptArr[key]);
      setPromptValues((val: any) => [...val, activity.length]);
    }
    
    const activitiesArr1 = ["AT HOME INSIDE",
    "AT HOME INSIDE WITH OTHERS",
    "AT HOME OUTSIDE",
    "AT HOME OUTSIDE WITH OTHERS",
    "IN COMMUNITY"];

    const activitiesArr2 = ["IN COMMUNITY WITH OTHERS",
    "AT SPECIFIC ACTIVITY",
    "AT SPECIFIC ACTIVITY WITH OTHERS",
    "AT WORK",
    "IN TRANSPORT",];
    setActivitiesValues1([]);
    setActivitiesValues2([]);
    for (const key in activitiesArr1) {
      const activity1 = data.formsByClient.filter((value: ClientForm) => value.activity === activitiesArr1[key]);
      setActivitiesValues1((val: any) => [...val, activity1.length]);
    }
    for (const key in activitiesArr2) {
      const activity2 = data.formsByClient.filter((value: ClientForm) => value.activity === activitiesArr2[key]);
      setActivitiesValues2((val: any) => [...val, activity2.length]);
    }
  };
  
  // const html = `
  // <html>
  //   <head>
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  //   </head>
  //   <body style="text-align: center;">
  //     <h5 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
  //       Report Fredy!
  //     </h5>
  //     <img
  //       src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
  //       style="width: 90vw;" />
  //   </body>
  // </html>
  // `;
  const viewToSnapShotRef = useRef();
  const [snapshotImg, setSnapshotImg] = useState<any>();
  const [selectedPrinter, setSelectedPrinter] = useState<any>();
  
  const snapshot = async() => {
    
    await captureRef( viewToSnapShotRef, {
      fileName: "prueba",
      result: 'tmpfile',
      height: 730,
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
              <div>
                <h4 style="font-size: 30px; font-family: Helvetica Neue; font-weight: normal; text-align: center;">
                  Report ${clientName}
                </h4>
                <p style="font-size: 18px; font-family: Helvetica Neue; font-weight: normal; margin-left: 23px;">
                  From: ${startDate} To: ${endDate}
                </p>
              </div>
              <img
                  src=${ uri }
                  />
              </body>
            </html>
            `;
            await Print.printAsync({
              html,
              margins: {
                left: 8,
                top: 0,
                right: 8,
                bottom: 0,
              },
              printerUrl: selectedPrinter?.url, // iOS only
            }).catch(err => console.log('This is the error ', err))
        },
        (error) => console.error("Oops, snapshot failed", error)
      );
  }

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView>
      <View style={{ padding: '4%', backgroundColor: '#ffff' }}>
      <IconGoBack navigation={ navigation } color={ 'black' } backgroundColor={ 'rgb(242, 242, 242)' }/>
      <Text style={{ paddingVertical: '4%', fontSize: 18 }}>Client name: { clientName }</Text>
      <Text style={ globalStyles.label }>Start date</Text>
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
          <Text style={ globalStyles.label }>End date</Text>
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
              // startedDate={ endedDate }
              handleChangeStartDate={ handleChangeEndDate }
              setDate={ setEndDate }
              handleOnPressStartDate={ handleOnPressEndDate }
          />
          <Button 
            label={ "Create report" }
            onPress={ createReportByClient }
            disabled={ false }
          />
      </View>
      {
        createReport && (
        <View style={{ backgroundColor: '#ffff'}}>
          <View ref={ viewToSnapShotRef }>
            <Text style={{ paddingLeft: '4%' }}>Total: {`${data.length}`} forms</Text>
            <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Functionality</Text>
            <Text style={{ paddingLeft: '4%' }}>Want somenthing (WS): {`${functionalValues[0]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Escape or avoid something (EAS): {`${functionalValues[1]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Protest or show dislike for something (PSDS): {`${functionalValues[2]}`}</Text>
            <BarChart
              data={{
                labels: [
                  "WS",
                  "EAS",
                  "PSDS",
                ],
                datasets: [
                  {
                    data: functionalValues,
                  },
                ],
              }}
              verticalLabelRotation={0}
              width={Dimensions.get('window').width}
              height={300}
              // yAxisLabel={'Rs'}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#ffff',
                backgroundGradientTo: '#ffff',
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
            <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Prompt</Text>
            <Text style={{ paddingLeft: '4%' }}>Redirect (R): {`${promptValues[0]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Identify trigger (IT): {`${promptValues[1]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Remove trigger (RT): {`${promptValues[2]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Negative reinforcement (NR): {`${promptValues[3]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Rxtinction (RX): {`${promptValues[4]}`}</Text>
            <BarChart
              data={{
                labels: [
                  "R",
                  "IT",
                  "RT",
                  "NR",
                  "RX"
                ],
                datasets: [
                  {
                    data: promptValues,
                  },
                ],
              }}
              verticalLabelRotation={0}
              width={Dimensions.get('window').width}
              height={300}
              // yAxisLabel={'Rs'}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#ffff',
                backgroundGradientTo: '#ffff',
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
            <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Activities</Text>
            <Text style={{ paddingLeft: '4%' }}>At home inside (HI): {`${activitiesValues1[0]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>At home inside with others (HIWO): {`${activitiesValues1[1]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>At home outside (HO): {`${activitiesValues1[2]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>At home outside with others (HOWO): {`${activitiesValues1[3]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>In community (C): {`${activitiesValues1[4]}`}</Text>
            <BarChart
              data={{
                labels: [
                  "HI",
                  "HIWO",
                  "HO",
                  "HOWO",
                  "C"
                ],
                datasets: [
                  {
                    data: activitiesValues1,
                  },
                ],
              }}
              verticalLabelRotation={0}
              width={Dimensions.get('window').width}
              height={300}
              // yAxisLabel={'Rs'}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#ffff',
                backgroundGradientTo: '#ffff',
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
            <Text style={{ paddingLeft: '4%' }}>In community with others (CWO): {`${activitiesValues2[0]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>At specific activity (SA): {`${activitiesValues2[1]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>At specific activity with others (SAWO): {`${activitiesValues2[2]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>At work (W): {`${activitiesValues2[3]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>In transport (T): {`${activitiesValues2[4]}`}</Text>
            <BarChart
              data={{
                labels: [
                  "CWO",
                  "SA",
                  "SAWO",
                  "W",
                  "T"
                ],
                datasets: [
                  {
                    data: activitiesValues2,
                  },
                ],
              }}
              verticalLabelRotation={0}
              width={Dimensions.get('window').width}
              height={300}
              // yAxisLabel={'Rs'}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#ffff',
                backgroundGradientTo: '#ffff',
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
            <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Displayed Behaviour</Text>
            {/* <Text style={{ paddingLeft: '4%' }}>Redirect: {`${promptValues[0]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Identify trigger: {`${promptValues[1]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Remove trigger: {`${promptValues[2]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Negative reinforcement: {`${promptValues[3]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Rxtinction: {`${promptValues[4]}`}</Text>
            <BarChart
              data={{
                labels: [
                  "Redirect",
                  "Identify trigger",
                  "Remove trigger",
                  "Negative reinforcement",
                  "Rxtinction"
                ],
                datasets: [
                  {
                    data: promptValues,
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
                backgroundGradientTo: '#ffff',
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
            <Text style={{ paddingVertical: '2%', textAlign: 'center', fontSize: 18}}>Prompt</Text>
            <Text style={{ paddingLeft: '4%' }}>Redirect: {`${promptValues[0]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Identify trigger: {`${promptValues[1]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Remove trigger: {`${promptValues[2]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Negative reinforcement: {`${promptValues[3]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Rxtinction: {`${promptValues[4]}`}</Text>
            <BarChart
              data={{
                labels: [
                  "Redirect",
                  "Identify trigger",
                  "Remove trigger",
                  "Negative reinforcement",
                  "Rxtinction"
                ],
                datasets: [
                  {
                    data: promptValues,
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
                backgroundGradientTo: '#ffff',
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
            <Text style={{ paddingVertical: '2%', textAlign: 'center', fontSize: 18}}>Prompt</Text>
            <Text style={{ paddingLeft: '4%' }}>Redirect: {`${promptValues[0]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Identify trigger: {`${promptValues[1]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Remove trigger: {`${promptValues[2]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Negative reinforcement: {`${promptValues[3]}`}</Text>
            <Text style={{ paddingLeft: '4%' }}>Rxtinction: {`${promptValues[4]}`}</Text>
            <BarChart
              data={{
                labels: [
                  "Redirect",
                  "Identify trigger",
                  "Remove trigger",
                  "Negative reinforcement",
                  "Rxtinction"
                ],
                datasets: [
                  {
                    data: promptValues,
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
                backgroundGradientTo: '#ffff',
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
              /> */}
  {/* 
            { snapshotImg && <Text>Preview:</Text> }
            { snapshotImg && <Image resizeMode='contain' style={ styles.snapshotImag } source={ {uri: snapshotImg} } />} */}
          </View>
          <View style={{ paddingHorizontal: '4%' }}>
            <Button 
              label={ "Create PDF" }
              onPress={ snapshot }
              disabled={ false }
            />
            <View style={styles.spacer} />
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
        </View>
        )
      }
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