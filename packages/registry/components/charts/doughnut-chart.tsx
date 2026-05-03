import { useTheme } from '../../theme/theme-provider';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface DoughnutChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartConfig {
  width?: number;
  height?: number;
  showLabels?: boolean;
  animated?: boolean;
  duration?: number;
  innerRadius?: number;
}

const PALETTE = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ec4899', '#eab308'];

function AnimatedDonutSlice({ pathData, fill, animationProgress }: {
  pathData: string; fill: string; animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({ opacity: animationProgress.value }));
  return <AnimatedPath d={pathData} fill={fill} animatedProps={animatedProps} />;
}

type Props = {
  data: DoughnutChartDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function DoughnutChart({ data, config = {}, style }: Props) {
  const [containerWidth, setContainerWidth] = useState(300);
  const theme = useTheme();

  const { height = 220, showLabels = true, animated = true, duration = 1000, innerRadius = 0.5 } = config;

  const chartWidth = containerWidth || config.width || 300;
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animated, duration]);

  if (!data.length) return null;

  const total = data.reduce((s, d) => s + d.value, 0);
  const outerR = Math.min(chartWidth, height) / 2 - 20;
  const innerR = outerR * innerRadius;
  const cx = chartWidth / 2;
  const cy = height / 2;

  const palette = [theme.primary, ...PALETTE.slice(1)];
  let currentAngle = -Math.PI / 2;

  const slices = data.map((item, index) => {
    const angle = (item.value / total) * 2 * Math.PI;
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle = end;

    const largeArc = angle > Math.PI ? 1 : 0;
    const x1 = cx + outerR * Math.cos(start);
    const y1 = cy + outerR * Math.sin(start);
    const x2 = cx + outerR * Math.cos(end);
    const y2 = cy + outerR * Math.sin(end);
    const x3 = cx + innerR * Math.cos(end);
    const y3 = cy + innerR * Math.sin(end);
    const x4 = cx + innerR * Math.cos(start);
    const y4 = cy + innerR * Math.sin(start);

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');

    const midAngle = start + angle / 2;
    const lr = (outerR + innerR) / 2;

    return {
      pathData,
      fill: item.color || palette[index % palette.length],
      labelX: cx + lr * Math.cos(midAngle),
      labelY: cy + lr * Math.sin(midAngle),
      label: item.label,
      pct: Math.round((item.value / total) * 100),
    };
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
        {slices.map((s, i) => (
          <G key={`donut-${i}`}>
            <AnimatedDonutSlice pathData={s.pathData} fill={s.fill} animationProgress={animationProgress} />
            {showLabels && s.pct > 5 && (
              <SvgText x={s.labelX} y={s.labelY} textAnchor="middle" fontSize={10} fill="#fff" fontWeight="600">
                {`${s.pct}%`}
              </SvgText>
            )}
          </G>
        ))}
      </Svg>
    </View>
  );
}
