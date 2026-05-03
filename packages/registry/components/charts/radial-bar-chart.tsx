import { useTheme } from '../theme/theme-provider';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface RadialBarDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartConfig {
  padding?: number;
  animated?: boolean;
  duration?: number;
  gradient?: boolean;
}

const PALETTE = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ec4899', '#eab308'];

function AnimatedRing({
  cx, cy, r, strokeWidth, color, maxValue, value, circumference, animationProgress, gradientId,
}: {
  cx: number; cy: number; r: number; strokeWidth: number; color: string;
  maxValue: number; value: number; circumference: number;
  animationProgress: SharedValue<number>; gradientId?: string;
}) {
  const targetOffset = circumference * (1 - value / maxValue);
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - animationProgress.value * (circumference - targetOffset),
  }));
  return (
    <>
      <Circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={strokeWidth}
        fill="none" opacity={0.15} strokeDasharray={circumference} />
      <AnimatedCircle cx={cx} cy={cy} r={r}
        stroke={gradientId ? `url(#${gradientId})` : color}
        strokeWidth={strokeWidth} fill="none"
        strokeLinecap="round" strokeDasharray={circumference}
        transform={`rotate(-90 ${cx} ${cy})`}
        animatedProps={animatedProps}
      />
    </>
  );
}

type Props = {
  data: RadialBarDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function RadialBarChart({ data, config = {}, style }: Props) {
  const [containerSize, setContainerSize] = useState(200);
  const theme = useTheme();

  const { padding = 10, animated = true, duration = 1000, gradient = false } = config;

  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = animated ? withTiming(1, { duration }) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, animated, duration]);

  if (!data.length) return null;

  const size = containerSize || 200;
  const center = size / 2;
  const maxVal = Math.max(...data.map((d) => d.value));
  const maxRadius = (size - padding * 2) / 2;
  const strokeWidth = Math.max(6, maxRadius / (data.length + 1));
  const palette = [theme.primary, ...PALETTE.slice(1)];

  return (
    <View
      className="w-full" style={style}
      onLayout={(e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        const s = Math.min(width, height);
        if (s > 0) setContainerSize(s);
      }}
    >
      <Svg width={size} height={size}>
        <Defs>
          {gradient && data.map((item, i) => {
            const color = item.color || palette[i % palette.length];
            return (
              <LinearGradient key={`rg-${i}`} id={`rgrad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </LinearGradient>
            );
          })}
        </Defs>

        {data.map((item, i) => {
          const r = maxRadius - i * (strokeWidth + 4);
          if (r <= 0) return null;
          const circumference = 2 * Math.PI * r;
          const color = item.color || palette[i % palette.length];
          return (
            <AnimatedRing
              key={`ring-${i}`}
              cx={center} cy={center} r={r}
              strokeWidth={strokeWidth} color={color}
              maxValue={maxVal} value={item.value}
              circumference={circumference}
              animationProgress={animationProgress}
              gradientId={gradient ? `rgrad-${i}` : undefined}
            />
          );
        })}

        {data.map((item, i) => {
          const r = maxRadius - i * (strokeWidth + 4);
          if (r <= 0) return null;
          return (
            <SvgText key={`rl-${i}`} x={center + r + strokeWidth / 2 + 4} y={center + 4}
              fontSize={10} fill={theme.mutedForeground}>
              {item.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
