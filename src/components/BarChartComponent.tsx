import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from "react-native-chart-kit";

interface Props {
    labels: Array<string>,
    data: number[],
}
const screenWidth = Dimensions.get("window").width;
const BarChartComponent = ({ labels, data  }: Props) => {

  return (
    <BarChart
        data={{
        labels,
        datasets: [
            {
            data: data,
            },
        ],
        }}
        verticalLabelRotation={0}
        width={ screenWidth }
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
  )
}

export default BarChartComponent;