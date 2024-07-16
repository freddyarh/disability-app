import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts';
import { Text as TextSVG } from 'react-native-svg';
import * as scale from 'd3-scale';
import { captureRef } from 'react-native-view-shot';
import { getFormatedDate } from "react-native-modern-datepicker";
import * as Print from 'expo-print';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import { LoadingScreen } from './LoadingScreen';
import { ClientForm } from '../interfaces/appInterfaces';
import { globalStyles } from '../styles/globalStyles';
import Datepicker from '../components/Datepicker';
import Input from '../components/Input';
import { colors } from '../styles/colors';
import { setNewFormatDate } from '../helpers/setNewFormatDate';
import ScreenTitle from '../components/ScreenTitle';

const ClientReport = ({ route, navigation }: any ) => {

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  let imgGraphPdfHeight = 25;
  let imgGraphPdfWidth = 80;

  if( windowWidth > 700 && windowHeight > 1000 ){
    imgGraphPdfWidth = 140;
    imgGraphPdfHeight = 60;
  }
  if( windowWidth > windowHeight ){
    imgGraphPdfWidth = 230;
    imgGraphPdfHeight = 70;
  }
  
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
  const [dataComments, setDataComments] = useState<ClientForm[]>([]);
  const [totalForms, setTotalForms] = useState<number>(0)
  const [str, setStr] = useState<string>("")
  const [functionalValues, setFunctionalValues] = useState<Array<any>>([]);
  const [functionalityLabels, setFunctionalityLabels] = useState<string>("")
  const [functionalityMaxCounts, setFunctionalityMaxCounts] = useState<number>(0)
  const [activitiesLabels, setActivitiesLabels] = useState<string>("")
  const [activitiesMaxCounts, setActivitiesMaxCounts] = useState<number>(0)
  const [activitiesValues, setActivitiesValues] = useState<Array<any>>([]);
  const [behaviourLabels, setBehaviourLabels] = useState<string>("")
  const [behaviourMaxCounts, setBehaviourMaxCounts] = useState<number>(0)
  const [behaviour, setBehaviour] = useState<Array<any>>([]);
  const [promptLabels, setPromptLabels] = useState<string>("")
  const [promptValues, setPromptValues] = useState<Array<any>>([]);
  const [promptMaxCounts, setPromptMaxCounts] = useState<number>(0)

  let viewToSnapShotRef0 = useRef<number>(null);
  let viewToSnapShotRef1 = useRef<number>(null);
  let viewToSnapShotRef2 = useRef<number>(null);
  let viewToSnapShotRef3 = useRef<number>(null);
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

  const graphDescription = (labels: any): string => {

    const dataLabels = labels.map((value: any) => (
      `<p style='margin: 0px;'> - ${value.alias} (${value.label}): ${value.value}</p>`
    ));

    return dataLabels.join("");
  }
  
  const createReportByClient = async() => {
    
    setLoading(true);    
    const { data, status } = await disabilityApi.post<ClientForm>(`/clients/getReportByClient/${clientUid}`, { startDate, endDate });
    if( status === 200 ){
      setLoading( false );
      setCreateReport(true);
    }
    setTotalForms(data.total);
    setFunctionalValues(data.functionality.formObjectGraph);
    setFunctionalityMaxCounts(data.functionality.maxNumCounts);
    setActivitiesValues(data.activity.formObjectGraph);
    setActivitiesMaxCounts(data.activity.maxNumCounts);
    setPromptValues(data.prompt.formObjectGraph);
    setPromptMaxCounts(data.prompt.maxNumCounts);
    setBehaviour(data.behaviour.formObjectGraph);
    setBehaviourMaxCounts(data.behaviour.maxNumCounts);
    setDataComments(data.dataComments);

    const functionalityLabels = graphDescription(data.functionality.formObjectGraph);
    setFunctionalityLabels(functionalityLabels);

    const promptLabels = graphDescription(data.prompt.formObjectGraph);
    setPromptLabels(promptLabels);

    const activityLabels = graphDescription(data.activity.formObjectGraph);
    setActivitiesLabels(activityLabels);

    const behaviourLabels = graphDescription(data.behaviour.formObjectGraph);
    setBehaviourLabels(behaviourLabels);

    const htmlData = data.dataComments.map((value: any) => {
      return {
        date: value.date,
        comment: value.comment,
        incidentReport: value.incidentReport ? "Yes" : "No"
      }
    }).map((value: any) => (
     "<div  style='margin-top: 18px;'>"+
        "<p style='font-weight: bold; margin: 0px;'>Dat: " + "<span style='font-weight: normal;'>" + value.date + "</span>" + "</p>"+
        "<p style='font-weight: bold; margin: 0px;'>Comment: " + "<span style='font-weight: normal;'>" + value.comment + "</span>" +"</p>"+
        "<p style='font-weight: bold; margin: 0px;'>Incident Report: " + "<span style='font-weight: normal;'>" + value.incidentReport + "</span>" +"</p>"+
      "</div>"
    ));
    const str = htmlData.join("");
    setStr(str)
  };
  
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
      const screenShotDetails = (graphRows: number) => {
        let graphHeight = imgGraphPdfHeight + (graphRows * 10);
        let graphWidth = imgGraphPdfWidth + (graphRows * 10);
        const ScreenShotDetails: Props = {
          fileName: "prueba",
          result: 'tmpfile',
          height: graphHeight,
          width: graphWidth,
          quality: 1,
          format: 'jpg', 
        };
        return ScreenShotDetails;
      }
      
        await captureRef( viewToSnapShotRef0, screenShotDetails(functionalValues.length)).then(
          async(uri) => {
            
            arrUrl.push(uri)
          },
          (error) => console.error("Oops, snapshot failed", error)
          );
        await captureRef( viewToSnapShotRef1, screenShotDetails(activitiesValues.length)).then(
          async(uri) => {
          arrUrl.push(uri)
        },
        (error) => console.error("Oops, snapshot failed", error)
        );
        await captureRef( viewToSnapShotRef2, screenShotDetails(promptValues.length)).then(
          async(uri) => {
          arrUrl.push(uri)
        },
        (error) => console.error("Oops, snapshot failed", error)
        );
        await captureRef( viewToSnapShotRef3, screenShotDetails(behaviour.length)).then(
            async(uri) => {
              arrUrl.push(uri);
            
            const html = `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
              </head>
              <body>
                <div style="text-align: center;">
                  <div style="padding: 3px; background-color: rgba(37, 190, 50, 0.2);">
                    <h1 style="text-align: center;">
                      Report ${clientName}
                    </h1>
                  </div>
                  <p style="font-size: 18px; font-family: Helvetica Neue; font-weight: normal; margin-left: 23px;">
                    <span style="font-weight: bold;">From:</span> ${startDate} <span style="font-weight: bold;">To:</span> ${endDate}
                  </p>
                  </div>
                  <div>
                    <p style="font-size: 18px; font-family: Helvetica Neue; font-weight: normal;;">
                    <span style="font-weight: bold;">Total:</span> ${ totalForms } forms
                    </p>
                  </div>
                  <table>
                    <tr>
                      <h3>Functionality</h3>
                      ${functionalityLabels}
                      <img src=${ arrUrl[0] } width="500" height=${ functionalValues.length * 60 } />
                    </tr>
                    <tr>
                      <h3>Activities</h3>
                      ${activitiesLabels}
                      <img src=${ arrUrl[1] } width="500" height=${ activitiesValues.length * 60 }/>
                    </tr>
                    <tr>
                      <h3>Prompt</h3>
                      ${promptLabels}
                      <img src=${ arrUrl[2] } width="500" height=${ promptValues.length * 60 } />
                    </tr>
                    <tr>
                      <h3>Behaviour</h3>
                      ${behaviourLabels}
                      <img src=${ arrUrl[3] } width="500" height=${ behaviour.length * 55 } />
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

  const CUT_OFF = 50
  const Labels = ({  x, y, bandwidth, data }: any) => (
    data.map((value: any , index: number) => (
      <TextSVG
          key={ index }
          x={ value.value > CUT_OFF ? x(0) + 10 : x(value.value) + 10 }
          y={ y(index) + (bandwidth / 2) }
          fontSize={ 14 }
          fill={ value.value > CUT_OFF ? 'white' : 'black' }
          alignmentBaseline={ 'middle' }
      >
          {value.value}
      </TextSVG>
  )));

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
       <ScreenTitle navigation={ navigation } clientName={ clientName } />
        <View style={{ padding: '4%' }}>
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
            totalForms === 0 ? (
              <Text style={{ paddingVertical: '4%', paddingHorizontal: '4%', fontSize: 18, fontWeight: 'bold'}}>Total: {`${ totalForms }`} forms</Text>
            ) : (
            <View style={{ backgroundColor: '#ffff'}}>
              <Text style={{ paddingVertical: '4%', paddingHorizontal: '4%', fontSize: 18, fontWeight: 'bold'}}>Total: {`${ totalForms }`} forms</Text>
                <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Functionality</Text>
                {
                  functionalValues.map((name, index) => (
                    <View key={index}>
                      <Text style={{ paddingLeft: '4%' }}>{ `- ${name.alias} (${name.label}): ${name.value}` }</Text>
                    </View>
                  ))
                }
                <View ref={ viewToSnapShotRef0 } collapsable={false}>
                <View style={{ flexDirection: 'row', height: functionalValues.length * 50, paddingVertical: 8, paddingLeft: 5 }}>
                  <YAxis
                      data={functionalValues}
                      yAccessor={({ index }) => index}
                      scale={scale.scaleBand}
                      contentInset={{ top: 10, bottom: 10 }}
                      spacing={0.2}
                      formatLabel={(_, index) => functionalValues[ index ].label}
                  />
                  <BarChart
                      style={{ flex: 1, marginLeft: 8 }}
                      data={functionalValues}
                      horizontal={true}
                      yAccessor={({ item }) => item.value}
                      yMax={ functionalityMaxCounts > 0 ? functionalityMaxCounts + 0.7 : totalForms + 0.2 }
                      yMin={0}
                      svg={{ fill: colors.forestGreen }}
                      contentInset={{ top: 10, bottom: 10 }}
                      spacing={0.2}
                      gridMin={0}
                  >
                      <Grid direction={Grid.Direction.VERTICAL}/>
                      <Labels />
                  </BarChart>
                </View>
              </View>
                <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Activities</Text>
                {
                  activitiesValues.map((name, index) => (
                    <View key={index}>
                      <Text style={{ paddingLeft: '4%' }}>{ `- ${name.alias} (${name.label}): ${name.value}` }</Text>
                    </View>
                  ))
                }
                <View ref={ viewToSnapShotRef1 } collapsable={false}>
                <View style={{ flexDirection: 'row', height: activitiesValues.length * 50, paddingVertical: 8, paddingLeft: 5 }}>
                  <YAxis
                      data={activitiesValues}
                      yAccessor={({ index }) => index}
                      scale={scale.scaleBand}
                      contentInset={{ top: 10, bottom: 10 }}
                      spacing={0.2}
                      formatLabel={(_, index) => activitiesValues[ index ].label}
                  />
                  <BarChart
                      style={{ flex: 1, marginLeft: 8 }}
                      data={activitiesValues}
                      horizontal={true}
                      yAccessor={({ item }) => item.value}
                      yMax={ activitiesMaxCounts > 0 ? activitiesMaxCounts + 0.7 : totalForms + 0.2 }
                      yMin={0}
                      svg={{ fill: colors.forestGreen }}
                      contentInset={{ top: 10, bottom: 10 }}
                      spacing={0.2}
                      gridMin={0}
                  >
                      <Grid direction={Grid.Direction.VERTICAL}/>
                      <Labels />
                  </BarChart>
                </View>
              </View>

                <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Prompt</Text>
                  {
                    promptValues.map((name, index) => (
                      <View key={index}>
                      <Text style={{ paddingLeft: '4%' }}>{ `- ${name.alias} (${name.label}): ${name.value}` }</Text>
                    </View>
                    ))
                  }
                  <View ref={ viewToSnapShotRef2 } collapsable={false}>
                  <View style={{ flexDirection: 'row', height: promptValues.length * 50, paddingVertical: 8, paddingLeft: 5 }}>
                    <YAxis
                        data={promptValues}
                        yAccessor={({ index }) => index}
                        scale={scale.scaleBand}
                        contentInset={{ top: 10, bottom: 10 }}
                        spacing={0.2}
                        formatLabel={(_, index) => promptValues[ index ].label}
                    />
                    <BarChart
                        style={{ flex: 1, marginLeft: 8 }}
                        data={promptValues}
                        horizontal={true}
                        yAccessor={({ item }) => item.value}
                        yMax={ promptMaxCounts > 0 ? promptMaxCounts + 0.7 : totalForms + 0.2 }
                        yMin={0}
                        svg={{ fill: colors.forestGreen }}
                        contentInset={{ top: 10, bottom: 10 }}
                        spacing={0.2}
                        gridMin={0}
                    >
                        <Grid direction={Grid.Direction.VERTICAL}/>
                        <Labels />
                    </BarChart>
                </View>
              </View>
              
                <Text style={{ paddingVertical: '4%', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>Behaviour</Text>
                  {
                    behaviour.map((name, index) => (
                      <View key={index}>
                        <Text style={{ paddingLeft: '4%' }}>{ `- ${name.alias} (${name.label}): ${name.value}` }</Text>
                      </View>
                    ))
                  }
                  <View ref={ viewToSnapShotRef3 } collapsable={false}>
                  <View style={{ flexDirection: 'row', height: behaviour.length * 45, paddingVertical: 8, paddingLeft: 5 }}>
                    <YAxis
                        data={behaviour}
                        yAccessor={({ index }) => index}
                        scale={scale.scaleBand}
                        contentInset={{ top: 10, bottom: 10 }}
                        spacing={0.2}
                        formatLabel={(_, index) => behaviour[ index ].label}
                    />
                    <BarChart
                        style={{ flex: 1, marginLeft: 8 }}
                        data={behaviour}
                        horizontal={true}
                        yAccessor={({ item }) => item.value}
                        yMax={ behaviourMaxCounts > 0 ? behaviourMaxCounts + 0.7 : totalForms + 0.2 }
                        yMin={0}
                        svg={{ fill: colors.forestGreen }}
                        contentInset={{ top: 10, bottom: 10 }}
                        spacing={0.2}
                        gridMin={0}
                    >
                        <Grid direction={Grid.Direction.VERTICAL}/>
                        <Labels />
                    </BarChart>
                </View>
              </View>  
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
                      <Text style={{ fontWeight: "bold", marginTop: "1%"  }}>Incident report: <Text style={{ fontWeight: "normal" }}>{ val.incidentReport ? "Yes" : "No" }</Text></Text>
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