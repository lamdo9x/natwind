import { useTheme } from '../theme/theme-provider';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export interface ColumnChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartConfig {
  width?: number;
  height?: number;
  padding?: number;
  showLabels?: boolean;
  animated?: boolean;
  duration?: number;
}

function AnimatedColumnBar({
  y, barHeight, maxBarWidth, fill, padding, animationProgress,
}: {
  y: number; barHeight: number; maxBarWidth: number; fill: string;
  padding: number; animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    width: animationProgress.value * maxBarWidth,
  }));
  return <AnimatedRect x={padding} y={y} height={barHeight} fill={fill} rx={4} animatedProps={animatedProps} />;
}

type Props = {
  data: ColumnChartDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function ColumnChart({ data, config = {}, style }: Props) {
  const [containerWidth, setContainerWidth] = useState(300);
  const theme = useTheme();

  const { height = 200, padding = 20, showLabels = true, animated = true, duration = 800 } = config;

  const chartWidth = containerWidth || config.width || 300;
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animated, duration]);

  if (!data.length) return null;

  const maxValue = Math.max(...data.map((d) => d.value));
  const innerChartWidth = chartWidth - padding * 2;
  const chartHeight = height - padding * 2;
  const barHeight = (chartHeight / data.length) * 0.8;
  const barSpacing = (chartHeight / data.length) * 0.2;
  const labelWidth = showLabels ? 60 : padding;

  return (
    <View
      className="w-full" style={[{ height }, style]}
      onLayout={(e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}
    >
      <Svg width={chartWidth} height={height}>
        {data.map((item, index) => {
          const maxBarWidth = ((item.value / maxValue) * (innerChartWidth - labelWidth));
          const y = padding + index * (barHeight + barSpacing) + barSpacing / 2;
          const startX = showLabels ? padding + labelWidth : padding;

          return (
            <G key={`col-${index}`}>
              {showLabels && (
                <SvgText
                  x={padding + labelWidth - 8}
                  y={y + barHeight / 2 + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill={theme.mutedForeground}
                >
                  {item.label}
                </SvgText>
              )}
              <AnimatedColumnBar
                y={y} barHeight={barHeight} maxBarWidth={maxBarWidth}
                fill={item.color || theme.primary}
                padding={startX} animationProgress={animationProgress}
              />
              {showLabels && (
                <SvgText
                  x={startX + maxBarWidth + 6}
                  y={y + barHeight / 2 + 4}
                  fontSize={10}
                  fill={theme.mutedForeground}
                >
                  {item.value}
                </SvgText>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
