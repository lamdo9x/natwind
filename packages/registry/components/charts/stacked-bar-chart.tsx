import { useTheme } from '../../theme/theme-provider';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface ChartConfig {
  width?: number;
  height?: number;
  padding?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  duration?: number;
}

export interface StackedBarDataPoint {
  label: string;
  values: number[];
}

type Props = {
  data: StackedBarDataPoint[];
  colors?: string[];
  config?: ChartConfig;
  style?: ViewStyle;
  categories?: string[];
  horizontal?: boolean;
};

function AnimatedHorizontalSegment({
  x,
  y,
  height,
  fill,
  segmentWidth,
  animationProgress,
}: {
  x: number;
  y: number;
  height: number;
  fill: string;
  segmentWidth: number;
  animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    width: animationProgress.value * segmentWidth,
  }));
  return (
    <AnimatedRect
      x={x}
      y={y}
      height={height}
      fill={fill}
      rx={2}
      animatedProps={animatedProps}
    />
  );
}

function AnimatedVerticalSegment({
  x,
  width,
  fill,
  baseY,
  segmentHeight,
  animationProgress,
}: {
  x: number;
  width: number;
  fill: string;
  baseY: number;
  segmentHeight: number;
  animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    height: animationProgress.value * segmentHeight,
    y: baseY - animationProgress.value * segmentHeight,
  }));
  return (
    <AnimatedRect
      x={x}
      width={width}
      fill={fill}
      rx={2}
      animatedProps={animatedProps}
    />
  );
}

export function StackedBarChart({
  data,
  colors = [],
  config = {},
  style,
  categories = [],
  horizontal = false,
}: Props) {
  const [containerWidth, setContainerWidth] = useState(300);

  const {
    height = 200,
    padding = 20,
    showLabels = true,
    showGrid = true,
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

  const maxValue = Math.max(
    ...data.map((d) => d.values.reduce((sum, val) => sum + val, 0))
  );
  const seriesCount = data[0]?.values.length || 0;

  const innerChartWidth = chartWidth - padding * 2;
  const chartHeight = height - padding * 2;

  const defaultColors = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
    '#00ff00',
    '#0088fe',
    primaryColor,
  ];

  const seriesColors =
    colors.length >= seriesCount
      ? colors
      : [...colors, ...defaultColors].slice(0, seriesCount);

  if (horizontal) {
    const barHeight = (chartHeight / data.length) * 0.8;
    const barSpacing = (chartHeight / data.length) * 0.2;

    return (
      <View className="w-full" style={[{ height }, style]} onLayout={handleLayout}>
        <Svg width={chartWidth} height={height}>
          {showGrid && (
            <G>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                <Line
                  key={`grid-${index}`}
                  x1={padding + ratio * innerChartWidth}
                  y1={padding}
                  x2={padding + ratio * innerChartWidth}
                  y2={height - padding}
                  stroke={mutedColor}
                  strokeWidth={0.5}
                  opacity={0.3}
                />
              ))}
            </G>
          )}

          {data.map((item, itemIndex) => {
            let cumulativeWidth = 0;
            const y =
              padding + itemIndex * (barHeight + barSpacing) + barSpacing / 2;

            return (
              <G key={`bar-group-${itemIndex}`}>
                {item.values.map((value, valueIndex) => {
                  const segmentWidth = (value / maxValue) * innerChartWidth;
                  const x = padding + cumulativeWidth;
                  cumulativeWidth += segmentWidth;

                  return (
                    <AnimatedHorizontalSegment
                      key={`segment-${itemIndex}-${valueIndex}`}
                      x={x}
                      y={y}
                      height={barHeight}
                      fill={seriesColors[valueIndex]}
                      segmentWidth={segmentWidth}
                      animationProgress={animationProgress}
                    />
                  );
                })}

                {showLabels && (
                  <SvgText
                    x={padding - 10}
                    y={y + barHeight / 2 + 4}
                    textAnchor='end'
                    fontSize={12}
                    fill={mutedColor}
                  >
                    {item.label}
                  </SvgText>
                )}
              </G>
            );
          })}

          {categories.length > 0 && (
            <G>
              {categories.map((category, index) => (
                <G key={`legend-${index}`}>
                  <Rect
                    x={padding + index * 80}
                    y={height - padding + 10}
                    width={12}
                    height={8}
                    fill={seriesColors[index]}
                    rx={2}
                  />
                  <SvgText
                    x={padding + index * 80 + 18}
                    y={height - padding + 18}
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

  const barWidth = (innerChartWidth / data.length) * 0.8;
  const barSpacing = (innerChartWidth / data.length) * 0.2;

  return (
    <View className="w-full" style={[{ height }, style]} onLayout={handleLayout}>
      <Svg width={chartWidth} height={height}>
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

        {data.map((item, itemIndex) => {
          let cumulativeHeight = 0;
          const x =
            padding + itemIndex * (barWidth + barSpacing) + barSpacing / 2;

          return (
            <G key={`bar-group-${itemIndex}`}>
              {item.values.map((value, valueIndex) => {
                const segmentHeight = (value / maxValue) * chartHeight;
                const baseY = height - padding - cumulativeHeight;
                cumulativeHeight += segmentHeight;

                return (
                  <AnimatedVerticalSegment
                    key={`segment-${itemIndex}-${valueIndex}`}
                    x={x}
                    width={barWidth}
                    fill={seriesColors[valueIndex]}
                    baseY={baseY}
                    segmentHeight={segmentHeight}
                    animationProgress={animationProgress}
                  />
                );
              })}

              {showLabels && (
                <SvgText
                  x={x + barWidth / 2}
                  y={height - 5}
                  textAnchor='middle'
                  fontSize={12}
                  fill={mutedColor}
                >
                  {item.label}
                </SvgText>
              )}
            </G>
          );
        })}

        {categories.length > 0 && (
          <G>
            {categories.map((category, index) => (
              <G key={`legend-${index}`}>
                <Rect
                  x={padding + index * 80}
                  y={padding - 25}
                  width={12}
                  height={8}
                  fill={seriesColors[index]}
                  rx={2}
                />
                <SvgText
                  x={padding + index * 80 + 18}
                  y={padding - 17}
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
