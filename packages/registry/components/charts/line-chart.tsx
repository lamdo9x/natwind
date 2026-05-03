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
  Circle, Defs, G, Line, LinearGradient, Path, Stop, Text as SvgText,
} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface LineChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

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
  gradient?: boolean;
}

function createLinePath(points: { x: number; y: number }[]): string {
  if (!points.length) return '';
  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2;
    path += ` Q${cpx},${points[i - 1].y} ${points[i].x},${points[i].y}`;
  }
  return path;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(0);
}

function AnimatedDot({ cx, cy, fill, animationProgress }: {
  cx: number; cy: number; fill: string; animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({ opacity: animationProgress.value }));
  return <AnimatedCircle cx={cx} cy={cy} r={4} fill={fill} animatedProps={animatedProps} />;
}

type Props = {
  data: LineChartDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function LineChart({ data, config = {}, style }: Props) {
  const [containerWidth, setContainerWidth] = useState(300);
  const theme = useTheme();

  const {
    height = 200, padding = 20, showGrid = true, showLabels = true,
    showYLabels = true, yLabelCount = 5, yAxisWidth = 30,
    animated = true, duration = 1000, gradient = false,
  } = config;

  const chartWidth = containerWidth || config.width || 300;
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animated, duration]);

  if (!data.length) return null;

  const leftPadding = showYLabels ? padding + yAxisWidth : padding;
  const innerW = chartWidth - leftPadding - padding;
  const innerH = height - padding * 2;
  const values = data.map((d) => d.y);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: leftPadding + (i / Math.max(data.length - 1, 1)) * innerW,
    y: padding + ((maxVal - d.y) / range) * innerH,
  }));

  const pathData = createLinePath(points);
  const areaPath = pathData + ` L${points[points.length - 1].x},${height - padding} L${points[0].x},${height - padding} Z`;

  const lineAnimatedProps = useAnimatedProps(() => ({
    strokeDasharray: animated ? `${animationProgress.value * 2000} 2000` : undefined,
  }));

  const yLabels = Array.from({ length: yLabelCount }, (_, i) => {
    const val = minVal + (range / (yLabelCount - 1)) * i;
    return { label: formatNum(val), y: padding + ((maxVal - val) / range) * innerH };
  });

  return (
    <View
      className="w-full" style={[{ height }, style]}
      onLayout={(e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}
    >
      <Svg width={chartWidth} height={height}>
        <Defs>
          {gradient && (
            <LinearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={theme.primary} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={theme.primary} stopOpacity="0.02" />
            </LinearGradient>
          )}
        </Defs>

        {showGrid && (
          <G>
            {yLabels.map((l, i) => (
              <Line key={`gh-${i}`} x1={leftPadding} y1={l.y} x2={chartWidth - padding} y2={l.y}
                stroke={theme.mutedForeground} strokeWidth={0.5} opacity={0.3} />
            ))}
            {points.map((p, i) => (
              <Line key={`gv-${i}`} x1={p.x} y1={padding} x2={p.x} y2={height - padding}
                stroke={theme.mutedForeground} strokeWidth={0.5} opacity={0.2} />
            ))}
          </G>
        )}

        {showYLabels && (
          <G>
            {yLabels.map((l, i) => (
              <SvgText key={`yl-${i}`} x={leftPadding - 5} y={l.y + 4} textAnchor="end" fontSize={10} fill={theme.mutedForeground}>
                {l.label}
              </SvgText>
            ))}
          </G>
        )}

        {gradient && <Path d={areaPath} fill="url(#areaGrad)" />}

        <AnimatedPath d={pathData} stroke={theme.primary} strokeWidth={2} fill="none"
          strokeLinecap="round" strokeLinejoin="round" animatedProps={lineAnimatedProps} />

        {points.map((p, i) => (
          <AnimatedDot key={`dot-${i}`} cx={p.x} cy={p.y} fill={theme.primary} animationProgress={animationProgress} />
        ))}

        {showLabels && (
          <G>
            {data.map((d, i) => (
              <SvgText key={`xl-${i}`} x={points[i].x} y={height - 5} textAnchor="middle" fontSize={10} fill={theme.mutedForeground}>
                {d.label || d.x.toString()}
              </SvgText>
            ))}
          </G>
        )}
      </Svg>
    </View>
  );
}
