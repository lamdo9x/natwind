import { useTheme } from '../../theme/theme-provider';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface BubbleChartDataPoint {
  x: number;
  y: number;
  size: number;
  label?: string;
  color?: string;
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

const PALETTE = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ec4899', '#eab308'];

function AnimatedBubble({ cx, cy, r, fill, animationProgress }: {
  cx: number; cy: number; r: number; fill: string; animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({ r: animationProgress.value * r }));
  return <AnimatedCircle cx={cx} cy={cy} fill={fill} opacity={0.7} animatedProps={animatedProps} />;
}

type Props = {
  data: BubbleChartDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function BubbleChart({ data, config = {}, style }: Props) {
  const [containerWidth, setContainerWidth] = useState(300);
  const theme = useTheme();

  const { height = 220, padding = 30, showGrid = true, showLabels = true, animated = true, duration = 800 } = config;

  const chartWidth = containerWidth || config.width || 300;
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animated, duration]);

  if (!data.length) return null;

  const maxX = Math.max(...data.map((d) => d.x));
  const minX = Math.min(...data.map((d) => d.x));
  const maxY = Math.max(...data.map((d) => d.y));
  const minY = Math.min(...data.map((d) => d.y));
  const maxSize = Math.max(...data.map((d) => d.size));
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;
  const innerW = chartWidth - padding * 2;
  const innerH = height - padding * 2;

  const bubbles = data.map((point, index) => ({
    x: padding + ((point.x - minX) / xRange) * innerW,
    y: padding + ((maxY - point.y) / yRange) * innerH,
    r: (point.size / maxSize) * 20 + 5,
    color: point.color || PALETTE[index % PALETTE.length],
    label: point.label,
  }));

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
          <G key={`grid-${i}`}>
            <Line x1={padding} y1={padding + ratio * innerH} x2={chartWidth - padding} y2={padding + ratio * innerH}
              stroke={theme.mutedForeground} strokeWidth={0.5} opacity={0.3} />
            <Line x1={padding + ratio * innerW} y1={padding} x2={padding + ratio * innerW} y2={height - padding}
              stroke={theme.mutedForeground} strokeWidth={0.5} opacity={0.3} />
          </G>
        ))}

        {bubbles.map((b, i) => (
          <G key={`bubble-${i}`}>
            <AnimatedBubble cx={b.x} cy={b.y} r={b.r} fill={b.color} animationProgress={animationProgress} />
            {showLabels && b.label && (
              <SvgText x={b.x} y={b.y - b.r - 4} textAnchor="middle" fontSize={10} fill={theme.mutedForeground}>
                {b.label}
              </SvgText>
            )}
          </G>
        ))}
      </Svg>
    </View>
  );
}
