import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { getFormatedDate } from "react-native-modern-datepicker";
import * as Print from 'expo-print';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import { LoadingScreen } from './LoadingScreen';
import IconGoBack from '../components/IconGoBack';
import { ClientForm } from '../interfaces/appInterfaces';
import { globalStyles } from '../styles/globalStyles';
import { Platform } from 'react-native';
import Datepicker from '../components/Datepicker';
import Input from '../components/Input';
import { colors } from '../styles/colors';
import BarChartComponent from '../components/BarChartComponent';
import { setNewFormatDate } from '../helpers/setNewFormatDate';

const ClientReport = ({ route, navigation }: any ) => {

  const { clientUid, clientName } = route.params;
  const today = new Date();
  const today_ = setNewFormatDate(today);
  const newDate = new Date(today.setFullYear(today.getFullYear() - 1));
  const dateOneYearLess = setNewFormatDate(newDate);

  const [startDate, setStartDate] = useState(dateOneYearLess);
  const [endDate, setEndDate] = useState(today_);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [startedDate, setStartedDate] = useState(dateOneYearLess);
  const [endedDate, setEndedDate] = useState<string>("12/12/2023");
  const [createReport, setCreateReport] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ClientForm[]>([]);
  const [dataComments, setDataComments] = useState<ClientForm[]>([]);
  const [totalForms, setTotalForms] = useState<number>(0)
  const [str, setStr] = useState<string>("")
  const [functionalValues, setFunctionalValues] = useState<Array<number>>([0, 0, 0]);
  const [promptValues, setPromptValues] = useState<Array<number>>([0, 0, 0, 0, 0]);
  const [activitiesValues1, setActivitiesValues1] = useState<Array<number>>([0, 0, 0, 0, 0]);
  const [activitiesValues2, setActivitiesValues2] = useState<Array<number>>([0, 0, 0, 0, 0]);

  let viewToSnapShotRef0 = useRef<number>(null);
  let viewToSnapShotRef1 = useRef<number>(null);
  let viewToSnapShotRef2 = useRef<number>(null);
  let viewToSnapShotRef3 = useRef<number>(null);
  let viewToSnapShotRef4 = useRef<number>(null);
  let viewToSnapShotRef5 = useRef<number>(null);
  let viewToSnapShotRef6 = useRef<number>(null);
  const [selectedPrinter, setSelectedPrinter] = useState<any>();

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

    setLoading(true);
    const { data, status } = await disabilityApi.post<ClientForm>(`/clients/getReportByClient/${clientUid}`, { startDate, endDate });
    if( status === 200 ){
      setLoading( false );
      setCreateReport(true);
    }
    setTotalForms(data.total);
    setData( data.formsByClient );
    setDataComments(data.dataComments);
    const htmlData = data.dataComments.map(value => (
     "<div  style='margin-top: 18px;'>"+
        "<p style='font-weight: bold; margin: 0px;'>Date: " + "<span style='font-weight: normal;'>" + value.date + "</span>" + "</p>"+
        "<p style='font-weight: bold; margin: 0px;'>Comment: " + "<span style='font-weight: normal;'>" + value.comment + "</span>" +"</p>"+
      "</div>"
    ))
    const str = htmlData.join("");
    setStr(str)
    console.log(str)

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
  
  const snapshot = async() => {

      let arrUrl: string[] = [];

      interface Props {
        fileName: string
        result: 'tmpfile'
        height: number
        width: number
        quality: number
        format: 'jpg'
      }

      const ScreenShotDetails: Props = {
        fileName: "prueba",
        result: 'tmpfile',
        height: 120,
        width: 120,
        quality: 1,
        format: 'jpg', 
      };
      
        await captureRef( viewToSnapShotRef0, ScreenShotDetails).then(
          async(uri) => {
            console.log(uri)
            arrUrl.push(uri)
          },
          (error) => console.error("Oops, snapshot failed", error)
          );
        await captureRef( viewToSnapShotRef1, ScreenShotDetails).then(
          async(uri) => {
          arrUrl.push(uri)
        },
        (error) => console.error("Oops, snapshot failed", error)
        );
        await captureRef( viewToSnapShotRef2, ScreenShotDetails).then(
          async(uri) => {
          arrUrl.push(uri)
        },
        (error) => console.error("Oops, snapshot failed", error)
        );
        await captureRef( viewToSnapShotRef3, ScreenShotDetails).then(
          async(uri) => {
          arrUrl.push(uri)
        },
        (error) => console.error("Oops, snapshot failed", error)
        );
        await captureRef( viewToSnapShotRef4, ScreenShotDetails).then(
          async(uri) => {
          arrUrl.push(uri)
        },
        (error) => console.error("Oops, snapshot failed", error)
        );
        await captureRef( viewToSnapShotRef5, ScreenShotDetails).then(
          async(uri) => {
          arrUrl.push(uri)
        },
        (error) => console.error("Oops, snapshot failed", error)
        );
        await captureRef( viewToSnapShotRef6, ScreenShotDetails).then(
            async(uri) => {
              arrUrl.push(uri);
            
            const html = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              </head>
              <body>
                <div style="text-align: center;">
                  <div style="padding: 3px; background-color: rgba(100, 156, 198, 0.15);">
                    <h1 style="text-align: center;">
                      Report ${clientName}
                    </h1>
                  </div>
                  <p style="font-size: 18px; font-family: Helvetica Neue; font-weight: normal; margin-left: 23px;">
                    <span style="font-weight: bold;">From:</span> ${startDate} <span style="font-weight: bold;">To:</span> ${endDate}
                  </p>
                  </div>
                  <div>
                    <p style="font-size: 18px; font-family: Helvetica Neue; font-weight: normal; margin-left: 23px;">
                    <span style="font-weight: bold;">Total:</span> ${ totalForms } forms
                    </p>
                  </div>
                  <table>
                  <tr>
                    <td><img src=${ arrUrl[0] }/></td>
                    <td><img src=${ arrUrl[1] }/></td>
                  </tr>
                  <tr>
                    <td><img src=${ arrUrl[2] }/></td>
                    <td><img src=${ arrUrl[3] }/></td>
                  </tr>
                  <tr>
                    <td><img src=${ arrUrl[4] }/></td>
                    <td><img src=${ arrUrl[5] }/></td>
                  </tr>
                  <tr>
                    <td><img src=${ arrUrl[6] }/></td>
                  </tr>
                  </table>
                  <div style="margin-top: 10">
                    <h2 style="text-align: center;">
                      Comments
                    </h2>
                    ${str}
                  </div>
              </body>
            </html>
            `;

          await Print.printAsync({
              html,
              margins: {
                  left: 15,
                  top: 15,
                  right: 14,
                  bottom: 20,
                },
                printerUrl: selectedPrinter?.url, // iOS only
              }).catch(err => console.log('This is the error ', err))
          },
            (error) => console.error("Oops, snapshot failed", error)
          );
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  return (
    <>
      <View style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.white 
      }}/>
          
      <ScrollView>
        <View style={{ padding: '4%' }}>
        <IconGoBack navigation={ navigation } color={ 'black' } backgroundColor={ 'rgb(242, 242, 242)' }/>
        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', backgroundColor: 'rgba(100, 156, 198, 0.15)', padding: 10, marginVertical: 15 }}>{ clientName }</Text>
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
                maximumDate={ today_ }
                minimumDate={ dateOneYearLess }
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
                startDate={ today_ }
                maximumDate={ today_ }
                minimumDate={ startDate }
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
        { loading && (
          <View>
            <LoadingScreen color={ colors.firstColor } />
          </View>
        )}
        {
          createReport && (
          <View style={{ backgroundColor: '#ffff'}}>
            <Text style={{ paddingVertical: '4%', paddingHorizontal: '4%', fontSize: 18, fontWeight: 'bold'}}>Total: {`${ totalForms }`} forms</Text>
            <View ref={ viewToSnapShotRef0 } collapsable={false}>
              <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Functionality</Text>
              <Text style={{ paddingLeft: '4%' }}>Want somenthing (WS): {`${functionalValues[0]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Escape or avoid something (EAS): {`${functionalValues[1]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Protest or show dislike for something (PSDS): {`${functionalValues[2]}`}</Text>
              <BarChartComponent 
                labels={ ["WS","EAS","PSDS"] } 
                data={ functionalValues } 
                fromNumber={ data.length } 
              />
            </View>
            <View ref={ viewToSnapShotRef1 } collapsable={false}>
              <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Prompt</Text>
              <Text style={{ paddingLeft: '4%' }}>Redirect (R): {`${promptValues[0]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Identify trigger (IT): {`${promptValues[1]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Remove trigger (RT): {`${promptValues[2]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Negative reinforcement (NR): {`${promptValues[3]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Rxtinction (RX): {`${promptValues[4]}`}</Text>
              <BarChartComponent 
                labels={["R","IT","RT","NR","RX"]} 
                data={ promptValues } 
                fromNumber={ data.length }
              />
            </View>
            <View ref={ viewToSnapShotRef2 } collapsable={false}>
              <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Activities</Text>
              <Text style={{ paddingLeft: '4%' }}>At home inside (HI): {`${activitiesValues1[0]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>At home inside with others (HIWO): {`${activitiesValues1[1]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>At home outside (HO): {`${activitiesValues1[2]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>At home outside with others (HOWO): {`${activitiesValues1[3]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>In community (C): {`${activitiesValues1[4]}`}</Text>
              <BarChartComponent 
                labels={["HI","HIWO","HO","HOWO","C"]} 
                data={ activitiesValues1 } 
                fromNumber={ data.length }
              />
            </View>
            <View ref={ viewToSnapShotRef3 } collapsable={false}>
              <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Activities</Text>
              <Text style={{ paddingLeft: '4%' }}>In community with others (CWO): {`${activitiesValues2[0]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>At specific activity (SA): {`${activitiesValues2[1]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>At specific activity with others (SAWO): {`${activitiesValues2[2]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>At work (W): {`${activitiesValues2[3]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>In transport (T): {`${activitiesValues2[4]}`}</Text>
              <BarChartComponent 
                labels={[ "CWO","SA","SAWO","W","T"]} 
                data={ activitiesValues2 } 
                fromNumber={ data.length }
                />
            </View>  
            <View ref={ viewToSnapShotRef4 } collapsable={false}>
              <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Displayed Behaviour</Text>
              <Text style={{ paddingLeft: '4%' }}>SELF injury (SID): {`${promptValues[0]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>PICA (Pic): {`${promptValues[1]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Physical Aggression (PAG): {`${promptValues[2]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Anal poking (AP): {`${promptValues[3]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Verbal Aggression (VA): {`${promptValues[4]}`}</Text>
              <BarChartComponent 
                labels={["SID","Pic","PAG","AP","VA"]} 
                data={ promptValues } 
                fromNumber={ data.length }
                />
            </View>  
            <View ref={ viewToSnapShotRef5 } collapsable={false}>
              <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Displayed Behaviour</Text>
              <Text style={{ paddingLeft: '4%' }}>Disruption and destruction of property or environment (DST): {`${promptValues[0]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Stereotyped behaviours (SB): {`${promptValues[1]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Inappropriate vocalisations (IV): {`${promptValues[2]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Innappropriate removal of clothing (IRC): {`${promptValues[3]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Innapropriate or unacceptable sexual behaviour (ISB): {`${promptValues[4]}`}</Text>
              <BarChartComponent 
                labels={["DST","SB","IV","IRC","ISB"]} 
                data={ promptValues } 
                fromNumber={ data.length }
                />
            </View>  
            <View ref={ viewToSnapShotRef6 } collapsable={false}>
              <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Displayed Behaviour</Text>
              <Text style={{ paddingLeft: '4%' }}>Smearing (SMR): {`${promptValues[0]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Stealing (STL): {`${promptValues[1]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Self-induced vomiting and regurgitation (SIV): {`${promptValues[2]}`}</Text>
              <Text style={{ paddingLeft: '4%' }}>Other: {`${promptValues[3]}`}</Text>
              <BarChartComponent 
                labels={["SMR","STL","SIV","Other"]} 
                data={ [0,0,0,0] } 
                fromNumber={ data.length }
                />
            </View>  
    {/* 
              { snapshotImg && <Text>Preview:</Text> }
              { snapshotImg && <Image resizeMode='contain' style={ styles.snapshotImag } source={ {uri: snapshotImg} } />} */}
            <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Comments</Text>

            {
              dataComments.length === 0 ? (
                <Text style={{ paddingVertical: '4%', paddingHorizontal: '4%', fontSize: 15 }}>There are no comments to display</Text>
              ): (
              
                dataComments.map( (val: ClientForm, index) => (
                  <View key={ index } style={{ marginHorizontal: "4%", marginVertical: "3%"  }}>
                    <Text style={{ fontWeight: "bold", marginTop: "0%" }}>Date: <Text style={{ fontWeight: "normal" }}>{ val.date }</Text></Text>
                    <Text style={{ fontWeight: "bold", marginTop: "1%"  }}>Comment:</Text>
                    <Text>{ val.comment }</Text>
                  </View>
                ))
              )
            }

            <View style={{ paddingHorizontal: '4%' }}>
              <Button 
                label={ "Create PDF" }
                onPress={ snapshot }
                disabled={ false }
              />
              <View style={styles.spacer} />
            </View>
          </View>
          )
        }
      </ScrollView>
    </>
  )
};

const styles = StyleSheet.create({
  snapshotImag: {
    width: 300,
    height: 900,
  },
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: 'center',
  },
});

export default ClientReport;