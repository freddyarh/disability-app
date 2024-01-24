import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from "react-native-chart-kit";

interface Props {
    labels: Array<string>,
    data: number[],
    fromNumber: number
}
const { width: screenWidth } = Dimensions.get('window');
const BarChartComponent = ({ labels, data, fromNumber }: Props) : React.ReactElement => {

  return (
    <BarChart
        data={{
        labels,
        datasets: [
            {
              data: data,
            }
          ],
        }}
        fromNumber={ fromNumber % 2 === 0 ? fromNumber + 2 : fromNumber + 3 }
        fromZero={true}
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