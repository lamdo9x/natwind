import { useTheme } from '../../theme/theme-provider';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ChartConfig {
  width?: number;
  height?: number;
  padding?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  duration?: number;
}

export type ChartDataPoint = {
  x: number;
  y: number;
  label?: string;
};

type Props = {
  data: ChartDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

function AnimatedScatterPoint({
  cx,
  cy,
  fill,
  index,
  animationProgress,
}: {
  cx: number;
  cy: number;
  fill: string;
  index: number;
  animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    opacity: animationProgress.value,
    r: withDelay(index * 50, withSpring(animationProgress.value * 5)),
  }));
  return <AnimatedCircle cx={cx} cy={cy} fill={fill} animatedProps={animatedProps} />;
}

export function ScatterChart({ data, config = {}, style }: Props) {
  const [containerWidth, setContainerWidth] = useState(300);

  const {
    height = 200,
    padding = 20,
    showGrid = true,
    showLabels = true,
    animated = true,
    duration = 800,
  } = config;

  const chartWidth = containerWidth || config.width || 300;

  const theme = useTheme();
  const primaryColor = theme.primary;
  const mutedColor = theme.mutedForeground;

  const animationProgress = useSharedValue(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width: measuredWidth } = event.nativeEvent.layout;
    if (measuredWidth > 0) setContainerWidth(measuredWidth);
  };

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animated, duration]);

  if (!data.length) return null;

  const maxX = Math.max(...data.map((d) => d.x));
  const minX = Math.min(...data.map((d) => d.x));
  const maxY = Math.max(...data.map((d) => d.y));
  const minY = Math.min(...data.map((d) => d.y));

  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;

  const innerChartWidth = chartWidth - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((point) => ({
    x: padding + ((point.x - minX) / xRange) * innerChartWidth,
    y: padding + ((maxY - point.y) / yRange) * chartHeight,
  }));

  return (
    <View className="w-full" style={[{ height }, style]} onLayout={handleLayout}>
      <Svg width={chartWidth} height={height}>
        {showGrid && (
          <G>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <G key={`grid-${index}`}>
                <Line
                  x1={padding}
                  y1={padding + ratio * chartHeight}
                  x2={chartWidth - padding}
                  y2={padding + ratio * chartHeight}
                  stroke={mutedColor}
                  strokeWidth={0.5}
                  opacity={0.3}
                />
                <Line
                  x1={padding + ratio * innerChartWidth}
                  y1={padding}
                  x2={padding + ratio * innerChartWidth}
                  y2={height - padding}
                  stroke={mutedColor}
                  strokeWidth={0.5}
                  opacity={0.3}
                />
              </G>
            ))}
          </G>
        )}

        {points.map((point, index) => (
          <AnimatedScatterPoint
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            fill={primaryColor}
            index={index}
            animationProgress={animationProgress}
          />
        ))}

        {showLabels && (
          <G>
            {[minX, (minX + maxX) / 2, maxX].map((value, index) => (
              <SvgText
                key={`x-label-${index}`}
                x={padding + (index * innerChartWidth) / 2}
                y={height - 5}
                textAnchor='middle'
                fontSize={12}
                fill={mutedColor}
              >
                {Math.round(value)}
              </SvgText>
            ))}
            {[maxY, (minY + maxY) / 2, minY].map((value, index) => (
              <SvgText
                key={`y-label-${index}`}
                x={15}
                y={padding + (index * chartHeight) / 2}
                textAnchor='middle'
                fontSize={12}
                fill={mutedColor}
                alignmentBaseline='middle'
              >
                {Math.round(value)}
              </SvgText>
            ))}
          </G>
        )}
      </Svg>
    </View>
  );
}
