import { useTheme } from '../../theme/theme-provider';
import { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ChartConfig {
  animated?: boolean;
  duration?: number;
  gradient?: boolean;
}

type Props = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  config?: ChartConfig;
  style?: ViewStyle;
  showLabel?: boolean;
  label?: string;
  centerText?: string;
};

export function ProgressRingChart({
  progress, size = 120, strokeWidth = 8,
  config = {}, style, showLabel = true, label, centerText,
}: Props) {
  const theme = useTheme();
  const { animated = true, duration = 1000, gradient = false } = config;

  const animProgress = useSharedValue(0);

  useEffect(() => {
    animProgress.value = animated ? withTiming(1, { duration }) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, animated, duration]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const progressAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - animProgress.value * (progress / 100) * circumference,
  }));

  return (
    <View className="items-center" style={style}>
      <Svg width={size} height={size}>
        <Defs>
          {gradient && (
            <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={theme.primary} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={theme.primary} stopOpacity="1" />
            </LinearGradient>
          )}
        </Defs>

        <Circle cx={center} cy={center} r={radius}
          stroke={theme.mutedForeground} strokeWidth={strokeWidth} fill="none" opacity={0.2} />

        <AnimatedCircle
          cx={center} cy={center} r={radius}
          stroke={gradient ? 'url(#ringGrad)' : theme.primary}
          strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          transform={`rotate(-90 ${center} ${center})`}
          animatedProps={progressAnimatedProps}
        />

        <SvgText x={center} y={center + 5} textAnchor="middle" fontSize={16} fontWeight="700" fill={theme.foreground}>
          {centerText || `${Math.round(progress)}%`}
        </SvgText>
      </Svg>

      {showLabel && label && (
        <SvgText>{label}</SvgText>
      )}
    </View>
  );
}
