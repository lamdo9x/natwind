import { ViewStyle } from 'react-native';
import { LineChart, LineChartDataPoint } from './line-chart';

interface ChartConfig {
  width?: number;
  height?: number;
  padding?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  showYLabels?: boolean;
  yLabelCount?: number;
  yAxisWidth?: number;
  animated?: boolean;
  duration?: number;
}

type Props = {
  data: LineChartDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function AreaChart({ data, config = {}, style }: Props) {
  return <LineChart data={data} config={{ ...config, gradient: true }} style={style} />;
}
