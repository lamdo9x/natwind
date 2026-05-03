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

export interface CandlestickDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ChartConfig {
  width?: number;
  height?: number;
  padding?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  duration?: number;
}

function AnimatedCandle({
  x, candleWidth, bodyY, bodyHeight, wickX, wickTop, wickBottom,
  color, animationProgress,
}: {
  x: number; candleWidth: number; bodyY: number; bodyHeight: number;
  wickX: number; wickTop: number; wickBottom: number;
  color: string; animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    height: Math.max(1, animationProgress.value * bodyHeight),
    y: bodyY + bodyHeight - animationProgress.value * bodyHeight,
  }));
  return (
    <G>
      <Line x1={wickX} y1={wickTop} x2={wickX} y2={wickBottom} stroke={color} strokeWidth={1.5} />
      <AnimatedRect x={x} width={candleWidth} fill={color} rx={2} animatedProps={animatedProps} />
    </G>
  );
}

type Props = {
  data: CandlestickDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function CandlestickChart({ data, config = {}, style }: Props) {
  const [containerWidth, setContainerWidth] = useState(300);
  const theme = useTheme();

  const { height = 220, padding = 20, showGrid = true, showLabels = true, animated = true, duration = 800 } = config;

  const chartWidth = containerWidth || config.width || 300;
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animated, duration]);

  if (!data.length) return null;

  const allValues = data.flatMap((d) => [d.open, d.high, d.low, d.close]);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const valueRange = maxValue - minValue || 1;

  const innerW = chartWidth - padding * 2;
  const innerH = height - padding * 2;
  const candleWidth = (innerW / data.length) * 0.6;
  const candleSpacing = (innerW / data.length) * 0.4;

  const toY = (v: number) => padding + ((maxValue - v) / valueRange) * innerH;

  return (
    <View
      className="w-full" style={[{ height }, style]}
      onLayout={(e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}
    >
      <Svg width={chartWidth} height={height}>
        {showGrid && [0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <Line key={`grid-${i}`} x1={padding} y1={padding + ratio * innerH}
            x2={chartWidth - padding} y2={padding + ratio * innerH}
            stroke={theme.mutedForeground} strokeWidth={0.5} opacity={0.3} />
        ))}

        {data.map((item, index) => {
          const isBullish = item.close >= item.open;
          const color = isBullish ? theme.success : theme.destructive;
          const x = padding + index * (candleWidth + candleSpacing) + candleSpacing / 2;
          const wickX = x + candleWidth / 2;
          const bodyTop = toY(Math.max(item.open, item.close));
          const bodyBottom = toY(Math.min(item.open, item.close));
          const bodyHeight = Math.max(1, bodyBottom - bodyTop);

          return (
            <G key={`candle-${index}`}>
              <AnimatedCandle
                x={x} candleWidth={candleWidth}
                bodyY={bodyTop} bodyHeight={bodyHeight}
                wickX={wickX} wickTop={toY(item.high)} wickBottom={toY(item.low)}
                color={color} animationProgress={animationProgress}
              />
              {showLabels && (
                <SvgText x={wickX} y={height - 4} textAnchor="middle" fontSize={9} fill={theme.mutedForeground}>
                  {item.date}
                </SvgText>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
