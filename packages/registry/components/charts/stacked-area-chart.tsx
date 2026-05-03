import { useTheme } from '../../theme/theme-provider';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ChartConfig {
  width?: number;
  height?: number;
  padding?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  duration?: number;
}

export interface StackedAreaDataPoint {
  x: number;
  y: number[];
  label?: string;
}

type Props = {
  data: StackedAreaDataPoint[];
  colors?: string[];
  config?: ChartConfig;
  style?: ViewStyle;
  categories?: string[];
};

const createSmoothPath = (points: { x: number; y: number }[]): string => {
  if (points.length === 0) return '';
  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currentPoint = points[i];
    const cpx = (prevPoint.x + currentPoint.x) / 2;
    const cpy = prevPoint.y;
    path += ` Q${cpx},${cpy} ${currentPoint.x},${currentPoint.y}`;
  }
  return path;
};

const createAreaPath = (
  topPoints: { x: number; y: number }[],
  bottomPoints: { x: number; y: number }[]
): string => {
  if (topPoints.length === 0 || bottomPoints.length === 0) return '';
  const topPath = createSmoothPath(topPoints);
  const reversedBottomPoints = [...bottomPoints].reverse();
  let areaPath = topPath;
  areaPath += ` L${reversedBottomPoints[0].x},${reversedBottomPoints[0].y}`;
  if (reversedBottomPoints.length > 1) {
    for (let i = 1; i < reversedBottomPoints.length; i++) {
      const prevPoint = reversedBottomPoints[i - 1];
      const currentPoint = reversedBottomPoints[i];
      const cpx = (prevPoint.x + currentPoint.x) / 2;
      const cpy = prevPoint.y;
      areaPath += ` Q${cpx},${cpy} ${currentPoint.x},${currentPoint.y}`;
    }
  }
  areaPath += ' Z';
  return areaPath;
};

function AnimatedArea({
  d,
  fill,
  stroke,
  seriesIndex,
  animationProgress,
}: {
  d: string;
  fill: string;
  stroke: string;
  seriesIndex: number;
  animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    opacity: animationProgress.value * (seriesIndex === 0 ? 1 : 0.7),
  }));
  return (
    <AnimatedPath
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
      animatedProps={animatedProps}
    />
  );
}

export function StackedAreaChart({
  data,
  colors = [],
  config = {},
  style,
  categories = [],
}: Props) {
  const [containerWidth, setContainerWidth] = useState(300);

  const {
    height = 200,
    padding = 20,
    showGrid = true,
    showLabels = true,
    animated = true,
    duration = 1000,
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

  const stackedData = data.map((point) => {
    const cumulative = point.y.reduce((acc, val) => {
      acc.push((acc[acc.length - 1] || 0) + val);
      return acc;
    }, [] as number[]);
    return { ...point, cumulative };
  });

  const maxValue = Math.max(...stackedData.map((d) => Math.max(...d.cumulative)));
  const seriesCount = data[0]?.y.length || 0;

  const innerChartWidth = chartWidth - padding * 2;
  const chartHeight = height - padding * 2;

  const defaultColors = [
    primaryColor,
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
    '#00ff00',
    '#0088fe',
  ];

  const seriesColors =
    colors.length >= seriesCount
      ? colors
      : [...colors, ...defaultColors].slice(0, seriesCount);

  return (
    <View className="w-full" style={[{ height }, style]} onLayout={handleLayout}>
      <Svg width={chartWidth} height={height}>
        <Defs>
          {seriesColors.map((color, index) => (
            <LinearGradient
              key={`gradient-${index}`}
              id={`areaGradient-${index}`}
              x1='0%'
              y1='0%'
              x2='0%'
              y2='100%'
            >
              <Stop offset='0%' stopColor={color} stopOpacity='0.8' />
              <Stop offset='100%' stopColor={color} stopOpacity='0.3' />
            </LinearGradient>
          ))}
        </Defs>

        {showGrid && (
          <G>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <Line
                key={`grid-${index}`}
                x1={padding}
                y1={padding + ratio * chartHeight}
                x2={chartWidth - padding}
                y2={padding + ratio * chartHeight}
                stroke={mutedColor}
                strokeWidth={0.5}
                opacity={0.3}
              />
            ))}
          </G>
        )}

        {Array.from({ length: seriesCount }, (_, seriesIndex) => {
          const topPoints = stackedData.map((point, pointIndex) => ({
            x: padding + (pointIndex / Math.max(data.length - 1, 1)) * innerChartWidth,
            y:
              padding +
              ((maxValue - point.cumulative[seriesIndex]) / maxValue) *
                chartHeight,
          }));

          const bottomPoints = stackedData.map((_, pointIndex) => ({
            x: padding + (pointIndex / Math.max(data.length - 1, 1)) * innerChartWidth,
            y: height - padding,
          }));

          const areaPath = createAreaPath(topPoints, bottomPoints);

          return (
            <AnimatedArea
              key={`area-${seriesIndex}`}
              d={areaPath}
              fill={`url(#areaGradient-${seriesIndex})`}
              stroke={seriesColors[seriesIndex]}
              seriesIndex={seriesIndex}
              animationProgress={animationProgress}
            />
          );
        })}

        {showLabels && (
          <G>
            {data.map((point, index) => (
              <SvgText
                key={`label-${index}`}
                x={padding + (index / Math.max(data.length - 1, 1)) * innerChartWidth}
                y={height - 5}
                textAnchor='middle'
                fontSize={12}
                fill={mutedColor}
              >
                {point.label || point.x.toString()}
              </SvgText>
            ))}
          </G>
        )}

        {categories.length > 0 && (
          <G>
            {categories.map((category, index) => (
              <G key={`legend-${index}`}>
                <Path
                  d={`M${padding + index * 80},${padding - 15} L${
                    padding + index * 80 + 15
                  },${padding - 15}`}
                  stroke={seriesColors[index]}
                  strokeWidth={3}
                />
                <SvgText
                  x={padding + index * 80 + 20}
                  y={padding - 10}
                  fontSize={11}
                  fill={mutedColor}
                >
                  {category}
                </SvgText>
              </G>
            ))}
          </G>
        )}
      </Svg>
    </View>
  );
}
