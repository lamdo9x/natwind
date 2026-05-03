import { useTheme } from '../theme/theme-provider';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface PolarAreaDataPoint {
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
}

const PALETTE = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ec4899', '#eab308'];

function AnimatedPolarSlice({ pathData, fill, animationProgress }: {
  pathData: string; fill: string; animationProgress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({ opacity: 0.2 + animationProgress.value * 0.6 }));
  return <AnimatedPath d={pathData} fill={fill} animatedProps={animatedProps} />;
}

type Props = {
  data: PolarAreaDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function PolarAreaChart({ data, config = {}, style }: Props) {
  const [containerWidth, setContainerWidth] = useState(300);
  const theme = useTheme();

  const { height = 220, showLabels = true, animated = true, duration = 1000 } = config;

  const chartWidth = containerWidth || config.width || 300;
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animated, duration]);

  if (!data.length) return null;

  const cx = chartWidth / 2;
  const cy = height / 2;
  const maxR = Math.min(chartWidth, height) / 2 - 30;
  const maxVal = Math.max(...data.map((d) => d.value));
  const angleStep = (2 * Math.PI) / data.length;
  const palette = [theme.primary, ...PALETTE.slice(1)];

  const slices = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const nextAngle = (index + 1) * angleStep - Math.PI / 2;
    const r = (item.value / maxVal) * maxR;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(nextAngle);
    const y2 = cy + r * Math.sin(nextAngle);
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
    const midAngle = angle + angleStep / 2;
    const lr = (maxR + 12);
    return {
      pathData,
      fill: item.color || palette[index % palette.length],
      labelX: cx + lr * Math.cos(midAngle),
      labelY: cy + lr * Math.sin(midAngle),
      label: item.label,
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
        {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <Circle key={`grid-${i}`} cx={cx} cy={cy} r={ratio * maxR}
            stroke={theme.mutedForeground} strokeWidth={0.5} fill="none" opacity={0.3} />
        ))}

        {slices.map((s, i) => (
          <G key={`polar-${i}`}>
            <AnimatedPolarSlice pathData={s.pathData} fill={s.fill} animationProgress={animationProgress} />
            {showLabels && (
              <SvgText x={s.labelX} y={s.labelY} textAnchor="middle" fontSize={10} fill={theme.mutedForeground}>
                {s.label}
              </SvgText>
            )}
          </G>
        ))}
      </Svg>
    </View>
  );
}
