import { useTheme } from '../../theme/theme-provider';
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

export interface BarChartDataPoint {
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

function AnimatedBar({
  x, barWidth, barHeight, fill, totalHeight, padding, animationProgress,
}: {
  x: number; barWidth: number; barHeight: number; fill: string;
  totalHeight: number; padding: number; animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    height: animationProgress.value * barHeight,
    y: totalHeight - padding - animationProgress.value * barHeight,
  }));
  return <AnimatedRect x={x} width={barWidth} fill={fill} rx={4} animatedProps={animatedProps} />;
}

type Props = {
  data: BarChartDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function BarChart({ data, config = {}, style }: Props) {
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
  const barWidth = (innerChartWidth / data.length) * 0.8;
  const barSpacing = (innerChartWidth / data.length) * 0.2;

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
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
          return (
            <G key={`bar-${index}`}>
              <AnimatedBar
                x={x} barWidth={barWidth} barHeight={barHeight}
                fill={item.color || theme.primary}
                totalHeight={height} padding={padding}
                animationProgress={animationProgress}
              />
              {showLabels && (
                <>
                  <SvgText x={x + barWidth / 2} y={height - 5} textAnchor="middle" fontSize={11} fill={theme.mutedForeground}>
                    {item.label}
                  </SvgText>
                  <SvgText x={x + barWidth / 2} y={height - padding - barHeight - 5} textAnchor="middle" fontSize={10} fill={theme.mutedForeground}>
                    {item.value}
                  </SvgText>
                </>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
