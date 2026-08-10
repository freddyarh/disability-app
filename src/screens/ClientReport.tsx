import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Dimensions, Platform } from 'react-native';
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
import Datepicker from '../components/Datepicker';
import Input from '../components/Input';
import { setNewFormatDate } from '../helpers/setNewFormatDate';
import ScreenTitle from '../components/ScreenTitle';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAppTheme } from '../context/ThemeContext';
import { ThemePalette } from '../styles/theme';

const chartColorsDefault = {
  functionality: '#2383E2',
  activities: '#0F7B6C',
  prompt: '#9065B0',
  behaviour: '#D9730D',
};

/** Brighter categorical colors for visibility on dark high-contrast backgrounds */
const chartColorsHighContrast = {
  functionality: '#5EB1FF',
  activities: '#3DDC97',
  prompt: '#D4A5FF',
  behaviour: '#FFB347',
};

interface ChartDataItem {
  alias: string;
  label: string;
  value: number;
}

interface StatChartProps {
  title: string;
  subtitle: string;
  data: ChartDataItem[];
  maxCount: number;
  totalForms: number;
  barColor: string;
  chartRef: React.RefObject<View>;
}

const CUT_OFF = 50;

const ChartLabels = ({ x, y, bandwidth, data }: any) => {
  const { theme } = useAppTheme();

  return data.map((value: ChartDataItem, index: number) => (
    <TextSVG
      key={index}
      x={value.value > CUT_OFF ? x(0) + 10 : x(value.value) + 10}
      y={y(index) + (bandwidth / 2)}
      fontSize={12}
      fill={value.value > CUT_OFF ? '#FFFFFF' : theme.text}
      alignmentBaseline={'middle'}
    >
      {value.value}
    </TextSVG>
  ));
};

const StatChart = ({ title, subtitle, data, maxCount, totalForms, barColor, chartRef }: StatChartProps) => {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const chartHeight = Math.max(data.length * 44, 80);

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{title}</Text>
        <Text style={styles.chartSubtitle}>{subtitle}</Text>
      </View>

      {data.length === 0 ? (
        <Text style={styles.emptyChartText}>No data for this period</Text>
      ) : (
        <>
          <View style={styles.legendList}>
            {data.map((item, index) => (
              <View key={index} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: barColor }]} />
                <Text style={styles.legendText} numberOfLines={1}>
                  {item.alias} · {item.label}
                </Text>
                <Text style={styles.legendValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View ref={chartRef} collapsable={false} style={styles.chartCapture}>
            <View style={[styles.chartRow, { height: chartHeight }]}>
              <YAxis
                data={data}
                yAccessor={({ index }) => index}
                scale={scale.scaleBand}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.25}
                formatLabel={(_, index) => data[index].label}
                svg={{ fill: theme.textMuted, fontSize: 11 }}
              />
              <BarChart
                style={styles.barChart}
                data={data}
                horizontal={true}
                yAccessor={({ item }) => item.value}
                yMax={maxCount > 0 ? maxCount + 0.7 : totalForms + 0.2}
                yMin={0}
                svg={{ fill: barColor, rx: 4 }}
                contentInset={{ top: 10, bottom: 10 }}
                spacing={0.25}
                gridMin={0}
              >
                <Grid direction={Grid.Direction.VERTICAL} svg={{ stroke: theme.border, strokeWidth: 1 }} />
                <ChartLabels />
              </BarChart>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const CommentCard = ({ date, comment, incidentReport }: { date: string; comment: string; incidentReport: boolean }) => {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.commentCard}>
      <Text style={styles.commentDate}>{date}</Text>
      <Text style={styles.commentBody}>{comment}</Text>
      <View style={styles.commentFooter}>
        <Text style={styles.commentMetaLabel}>Incident report</Text>
        <View style={[styles.badge, incidentReport ? styles.badgeWarning : styles.badgeNeutral]}>
          <Text style={[styles.badgeText, incidentReport ? styles.badgeTextWarning : styles.badgeTextNeutral]}>
            {incidentReport ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const ClientReport = ({ route, navigation }: any) => {
  const { theme, highContrast } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const chartColors = highContrast ? chartColorsHighContrast : chartColorsDefault;

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  let imgGraphPdfHeight = 25;
  let imgGraphPdfWidth = 80;

  if (windowWidth > 700 && windowHeight > 1000) {
    imgGraphPdfWidth = 140;
    imgGraphPdfHeight = 60;
  }
  if (windowWidth > windowHeight) {
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
  const [exporting, setExporting] = useState<boolean>(false);
  const [dataComments, setDataComments] = useState<ClientForm[]>([]);
  const [totalForms, setTotalForms] = useState<number>(0);
  const [str, setStr] = useState<string>("");
  const [functionalValues, setFunctionalValues] = useState<ChartDataItem[]>([]);
  const [functionalityLabels, setFunctionalityLabels] = useState<string>("");
  const [functionalityMaxCounts, setFunctionalityMaxCounts] = useState<number>(0);
  const [activitiesLabels, setActivitiesLabels] = useState<string>("");
  const [activitiesMaxCounts, setActivitiesMaxCounts] = useState<number>(0);
  const [activitiesValues, setActivitiesValues] = useState<ChartDataItem[]>([]);
  const [behaviourLabels, setBehaviourLabels] = useState<string>("");
  const [behaviourMaxCounts, setBehaviourMaxCounts] = useState<number>(0);
  const [behaviour, setBehaviour] = useState<ChartDataItem[]>([]);
  const [promptLabels, setPromptLabels] = useState<string>("");
  const [promptValues, setPromptValues] = useState<ChartDataItem[]>([]);
  const [promptMaxCounts, setPromptMaxCounts] = useState<number>(0);

  const viewToSnapShotRef0 = useRef<View>(null);
  const viewToSnapShotRef1 = useRef<View>(null);
  const viewToSnapShotRef2 = useRef<View>(null);
  const viewToSnapShotRef3 = useRef<View>(null);
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
  };
  const handleOnPressEndDate = () => {
    setOpenEndDatePicker(!openEndDatePicker);
    Keyboard.dismiss();
  };

  useEffect(() => {
    setCreateReport(false);
  }, [clientUid]);

  const graphDescription = (labels: ChartDataItem[]): string => {
    const dataLabels = labels.map((value) => (
      `<p style='margin: 0px; color: #37352F; font-size: 14px;'> · ${value.alias} (${value.label}): ${value.value}</p>`
    ));
    return dataLabels.join("");
  };

  const createReportByClient = async () => {
    setLoading(true);
    const { data, status } = await disabilityApi.post<ClientForm>(`/clients/getReportByClient/${clientUid}`, { startDate, endDate });
    if (status === 200) {
      setLoading(false);
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

    setFunctionalityLabels(graphDescription(data.functionality.formObjectGraph));
    setPromptLabels(graphDescription(data.prompt.formObjectGraph));
    setActivitiesLabels(graphDescription(data.activity.formObjectGraph));
    setBehaviourLabels(graphDescription(data.behaviour.formObjectGraph));

    const htmlData = data.dataComments.map((value: any) => ({
      date: value.date,
      comment: value.comment,
      incidentReport: value.incidentReport ? "Yes" : "No",
    })).map((value: any) => (
      "<div style='margin-top: 16px; padding: 12px; border: 1px solid #E9E9E7; border-radius: 6px;'>" +
      "<p style='font-weight: 600; margin: 0 0 4px; color: #37352F; font-size: 13px;'>" + value.date + "</p>" +
      "<p style='margin: 0 0 8px; color: #37352F; font-size: 14px;'>" + value.comment + "</p>" +
      "<p style='margin: 0; color: #787774; font-size: 12px;'>Incident report: " + value.incidentReport + "</p>" +
      "</div>"
    ));
    setStr(htmlData.join(""));
  };

  const snapshot = async () => {
    if (exporting) return;
    setExporting(true);

    const captureOptions = (graphRows: number) => ({
      fileName: "chart",
      result: 'data-uri' as const,
      height: Platform.OS === 'ios' ? imgGraphPdfHeight + (graphRows * 10) : 800,
      width: Platform.OS === 'ios' ? imgGraphPdfWidth + (graphRows * 10) : 800,
      quality: 0.7,
      format: 'jpg' as const,
      scale: 1,
    });

    try {
      const [img0, img1, img2, img3] = await Promise.all([
        captureRef(viewToSnapShotRef0, captureOptions(functionalValues.length)),
        captureRef(viewToSnapShotRef1, captureOptions(activitiesValues.length)),
        captureRef(viewToSnapShotRef2, captureOptions(promptValues.length)),
        captureRef(viewToSnapShotRef3, captureOptions(behaviour.length)),
      ]);

      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F7F6F3; color: #37352F; margin: 0; padding: 24px; }
              h1 { font-size: 24px; font-weight: 600; margin: 0 0 8px; }
              h2 { font-size: 18px; font-weight: 600; margin: 24px 0 12px; }
              h3 { font-size: 15px; font-weight: 600; margin: 20px 0 8px; color: #37352F; }
              .header { background: #FFFFFF; border: 1px solid #E9E9E7; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px; }
              .meta { color: #787774; font-size: 14px; }
              .stat { background: #E8F3FC; display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 600; color: #2383E2; margin-top: 12px; }
              .section { background: #FFFFFF; border: 1px solid #E9E9E7; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${clientName}</h1>
              <p class="meta">${startDate} → ${endDate}</p>
              <span class="stat">${totalForms} forms recorded</span>
            </div>
            <div class="section">
              <h3>Functionality</h3>
              ${functionalityLabels}
              <img src="${img0}" width="500" height="${functionalValues.length * 60}" />
            </div>
            <div class="section">
              <h3>Activities</h3>
              ${activitiesLabels}
              <img src="${img1}" width="500" height="${activitiesValues.length * 60}" />
            </div>
            <div class="section">
              <h3>Prompt</h3>
              ${promptLabels}
              <img src="${img2}" width="500" height="${promptValues.length * 60}" />
            </div>
            <div class="section">
              <h3>Behaviour</h3>
              ${behaviourLabels}
              <img src="${img3}" width="500" height="${behaviour.length * 55}" />
            </div>
            <h2>Comments</h2>
            ${str}
          </body>
        </html>
      `;

      await Print.printAsync({
        html,
        margins: {
          top: Platform.OS === 'ios' ? 15 : 130,
          bottom: Platform.OS === 'ios' ? 20 : 130,
          left: Platform.OS === 'ios' ? 15 : 15,
          right: Platform.OS === 'ios' ? 14 : 15,
        },
        printerUrl: selectedPrinter?.url,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Animated.ScrollView
      entering={FadeIn.duration(500)}
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <ScreenTitle navigation={navigation} clientName={clientName} />

      <View style={styles.filterCard}>
        <Text style={styles.sectionLabel}>Date range</Text>
        <Text style={styles.sectionHint}>Select a period to generate disability statistics</Text>

        <Text style={styles.fieldLabel}>Start date</Text>
        <TouchableOpacity>
          <Input
            label={"Start date"}
            value={startDate}
            onPressIn={handleOnPressStartDate}
          />
        </TouchableOpacity>
        <Datepicker
          mode={"calendar"}
          openStartDatePicker={openStartDatePicker}
          startDate={initDate}
          maximumDate={today_}
          minimumDate={dateOneYearLess}
          startedDate={startedDate}
          handleChangeStartDate={handleChangeStartDate}
          setDate={setStartDate}
          handleOnPressStartDate={handleOnPressStartDate}
        />

        <Text style={styles.fieldLabel}>End date</Text>
        <TouchableOpacity>
          <Input
            label={"End date"}
            value={endDate}
            onPressIn={handleOnPressEndDate}
          />
        </TouchableOpacity>
        <Datepicker
          mode={"calendar"}
          openStartDatePicker={openEndDatePicker}
          startDate={today_}
          maximumDate={today_}
          minimumDate={startDate}
          handleChangeStartDate={handleChangeEndDate}
          setDate={setEndDate}
          handleOnPressStartDate={handleOnPressEndDate}
        />

        <Button
          iconName="chart-bar"
          label={"Generate dashboard"}
          onPress={createReportByClient}
          disabled={false}
        />
      </View>

      {loading && (
        <View style={styles.loadingWrap}>
          <LoadingScreen color={theme.accent} />
        </View>
      )}

      {createReport && (
        totalForms === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No forms found</Text>
            <Text style={styles.emptyStateText}>
              No data was recorded for {clientName} between {startDate} and {endDate}.
            </Text>
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(500)} style={styles.dashboard}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Overview</Text>
              <Text style={styles.summaryTitle}>{clientName}</Text>
              <Text style={styles.summaryPeriod}>{startDate} → {endDate}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{totalForms}</Text>
                  <Text style={styles.statLabel}>Forms</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{dataComments.length}</Text>
                  <Text style={styles.statLabel}>Comments</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {dataComments.filter(c => c.incidentReport).length}
                  </Text>
                  <Text style={styles.statLabel}>Incidents</Text>
                </View>
              </View>
            </View>

            <Text style={styles.dashboardHeading}>Disability statistics</Text>
            <Text style={styles.dashboardSubheading}>
              Visual breakdown of functionality, activities, prompts, and behaviour
            </Text>

            <StatChart
              title="Functionality"
              subtitle="Daily living and functional skills"
              data={functionalValues}
              maxCount={functionalityMaxCounts}
              totalForms={totalForms}
              barColor={chartColors.functionality}
              chartRef={viewToSnapShotRef0}
            />
            <StatChart
              title="Activities"
              subtitle="Participation and engagement"
              data={activitiesValues}
              maxCount={activitiesMaxCounts}
              totalForms={totalForms}
              barColor={chartColors.activities}
              chartRef={viewToSnapShotRef1}
            />
            <StatChart
              title="Prompt"
              subtitle="Support and prompting levels"
              data={promptValues}
              maxCount={promptMaxCounts}
              totalForms={totalForms}
              barColor={chartColors.prompt}
              chartRef={viewToSnapShotRef2}
            />
            <StatChart
              title="Behaviour"
              subtitle="Behavioural observations"
              data={behaviour}
              maxCount={behaviourMaxCounts}
              totalForms={totalForms}
              barColor={chartColors.behaviour}
              chartRef={viewToSnapShotRef3}
            />

            <Text style={styles.dashboardHeading}>Comments</Text>
            {dataComments.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No comments for this period</Text>
              </View>
            ) : (
              dataComments.map((val: ClientForm, index) => (
                <CommentCard
                  key={index}
                  date={val.date}
                  comment={val.comment}
                  incidentReport={!!val.incidentReport}
                />
              ))
            )}

            <View style={styles.exportSection}>
              <Button
                iconName="file-chart-outline"
                label={exporting ? "Exporting..." : "Export PDF"}
                onPress={snapshot}
                disabled={exporting}
              />
            </View>
          </Animated.View>
        )
      )}
    </Animated.ScrollView>
  );
};

const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    screenContent: {
      paddingBottom: 32,
    },
    filterCard: {
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginTop: 16,
      padding: 20,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    sectionHint: {
      fontSize: 13,
      color: theme.textMuted,
      marginBottom: 16,
    },
    fieldLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.textMuted,
      marginTop: 8,
      marginBottom: 4,
    },
    loadingWrap: {
      paddingVertical: 40,
    },
    dashboard: {
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    summaryCard: {
      backgroundColor: theme.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20,
      marginBottom: 24,
    },
    summaryLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    summaryTitle: {
      fontSize: 22,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    summaryPeriod: {
      fontSize: 13,
      color: theme.textMuted,
      marginBottom: 20,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background,
      borderRadius: 6,
      paddingVertical: 16,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textMuted,
    },
    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: theme.border,
    },
    dashboardHeading: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    dashboardSubheading: {
      fontSize: 13,
      color: theme.textMuted,
      marginBottom: 16,
    },
    chartCard: {
      backgroundColor: theme.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      marginBottom: 12,
    },
    chartHeader: {
      marginBottom: 12,
    },
    chartTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    chartSubtitle: {
      fontSize: 12,
      color: theme.textMuted,
    },
    legendList: {
      marginBottom: 12,
      gap: 6,
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 2,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    legendText: {
      flex: 1,
      fontSize: 13,
      color: theme.text,
    },
    legendValue: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textMuted,
      marginLeft: 8,
    },
    chartCapture: {
      backgroundColor: theme.card,
    },
    chartRow: {
      flexDirection: 'row',
      paddingVertical: 4,
    },
    barChart: {
      flex: 1,
      marginLeft: 8,
    },
    emptyChartText: {
      fontSize: 13,
      color: theme.textMuted,
      fontStyle: 'italic',
    },
    commentCard: {
      backgroundColor: theme.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      marginBottom: 8,
    },
    commentDate: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textMuted,
      marginBottom: 8,
    },
    commentBody: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
      marginBottom: 12,
    },
    commentFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    commentMetaLabel: {
      fontSize: 12,
      color: theme.textMuted,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 12,
    },
    badgeNeutral: {
      backgroundColor: theme.background,
    },
    badgeWarning: {
      backgroundColor: theme.errorBg,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '500',
    },
    badgeTextNeutral: {
      color: theme.textMuted,
    },
    badgeTextWarning: {
      color: theme.errorText,
    },
    emptyState: {
      backgroundColor: theme.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 24,
      marginHorizontal: 16,
      marginTop: 8,
      alignItems: 'center',
    },
    emptyStateTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 6,
    },
    emptyStateText: {
      fontSize: 13,
      color: theme.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
    exportSection: {
      marginTop: 16,
      marginBottom: 8,
    },
  });

export default ClientReport;
