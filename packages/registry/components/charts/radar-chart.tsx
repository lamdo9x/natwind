import { useTheme } from '../../theme/theme-provider';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface RadarChartDataPoint {
  label: string;
  value: number;
}

interface ChartConfig {
  width?: number;
  height?: number;
  showLabels?: boolean;
  animated?: boolean;
  duration?: number;
  maxValue?: number;
}

function AnimatedDot({ cx, cy, fill, animationProgress }: {
  cx: number; cy: number; fill: string; animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({ opacity: animationProgress.value }));
  return <AnimatedCircle cx={cx} cy={cy} r={4} fill={fill} animatedProps={animatedProps} />;
}

type Props = {
  data: RadarChartDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function RadarChart({ data, config = {}, style }: Props) {
  const [containerWidth, setContainerWidth] = useState(300);
  const theme = useTheme();

  const { height = 220, showLabels = true, animated = true, duration = 1000, maxValue } = config;

  const chartWidth = containerWidth || config.width || 300;
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animated, duration]);

  if (!data.length) return null;

  const cx = chartWidth / 2;
  const cy = height / 2;
  const radius = Math.min(chartWidth, height) / 2 - 40;
  const maxVal = maxValue || Math.max(...data.map((d) => d.value));
  const angleStep = (2 * Math.PI) / data.length;

  const points = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const dist = (item.value / maxVal) * radius;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
      labelX: cx + (radius + 20) * Math.cos(angle),
      labelY: cy + (radius + 20) * Math.sin(angle),
      label: item.label,
    };
  });

  const radarPath = `M${points[0].x},${points[0].y} ` +
    points.slice(1).map((p) => `L${p.x},${p.y}`).join(' ') + ' Z';

  const fillProps = useAnimatedProps(() => ({ opacity: animationProgress.value * 0.25 }));
  const strokeProps = useAnimatedProps(() => ({ opacity: animationProgress.value }));

  return (
    <View
      className="w-full" style={[{ height }, style]}
      onLayout={(e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}
    >
      <Svg width={chartWidth} height={height}>
        {[0.2, 0.4, 0.6, 0.8, 1].map((ratio, i) => (
          <Circle key={`gc-${i}`} cx={cx} cy={cy} r={ratio * radius}
            stroke={theme.mutedForeground} strokeWidth={0.5} fill="none" opacity={0.3} />
        ))}

        {points.map((p, i) => (
          <Line key={`gl-${i}`} x1={cx} y1={cy} x2={cx + radius * Math.cos(i * angleStep - Math.PI / 2)}
            y2={cy + radius * Math.sin(i * angleStep - Math.PI / 2)}
            stroke={theme.mutedForeground} strokeWidth={0.5} opacity={0.3} />
        ))}

        <AnimatedPath d={radarPath} fill={theme.primary} animatedProps={fillProps} />
        <AnimatedPath d={radarPath} stroke={theme.primary} strokeWidth={2} fill="none" animatedProps={strokeProps} />

        {points.map((p, i) => (
          <AnimatedDot key={`dot-${i}`} cx={p.x} cy={p.y} fill={theme.primary} animationProgress={animationProgress} />
        ))}

        {showLabels && points.map((p, i) => (
          <SvgText key={`label-${i}`} x={p.labelX} y={p.labelY} textAnchor="middle" fontSize={11} fill={theme.mutedForeground}>
            {p.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
