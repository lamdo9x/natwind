import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { ActivityIndicator, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export type SpinnerVariant = "default" | "circle" | "dots" | "pulse" | "bars";
export type SpinnerSize = "sm" | "default" | "lg";

interface SpinnerProps {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  className?: string;
  style?: ViewStyle;
}

const sizeDef = {
  sm:      { activitySize: "small" as const, dotSize: 6,  barW: 3, barH: 14, circleSize: 20 },
  default: { activitySize: "small" as const, dotSize: 8,  barW: 4, barH: 18, circleSize: 28 },
  lg:      { activitySize: "large" as const, dotSize: 10, barW: 5, barH: 22, circleSize: 36 },
};

const DURATION = 800;

function CircleSpinner({ size, color }: { size: number; color: string }) {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, { duration: DURATION, easing: Easing.linear }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2.5,
          borderColor: `${color}33`,
          borderTopColor: color,
        },
      ]}
    />
  );
}

function DotsSpinner({ dotSize, color }: { dotSize: number; color: string }) {
  const anims = [useSharedValue(0.3), useSharedValue(0.3), useSharedValue(0.3)];

  useEffect(() => {
    anims.forEach((anim, i) => {
      anim.value = withRepeat(
        withSequence(
          withDelay(i * (DURATION / 6), withTiming(1, { duration: DURATION / 3 })),
          withTiming(0.3, { duration: DURATION / 3 })
        ),
        -1
      );
    });
  }, []);

  const styles = anims.map((a) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedStyle(() => ({ opacity: a.value }))
  );

  return (
    <View style={{ flexDirection: "row", gap: dotSize / 2, alignItems: "center" }}>
      {styles.map((s, i) => (
        <Animated.View
          key={i}
          style={[s, { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

function PulseSpinner({ size, color }: { size: number; color: string }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: DURATION / 2 }),
        withTiming(1, { duration: DURATION / 2 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[animatedStyle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}
    />
  );
}

function BarsSpinner({ barW, barH, color }: { barW: number; barH: number; color: string }) {
  const anims = [useSharedValue(0.3), useSharedValue(0.3), useSharedValue(0.3), useSharedValue(0.3)];

  useEffect(() => {
    anims.forEach((anim, i) => {
      anim.value = withRepeat(
        withSequence(
          withDelay(i * (DURATION / 8), withTiming(1, { duration: DURATION / 2 })),
          withTiming(0.3, { duration: DURATION / 2 })
        ),
        -1
      );
    });
  }, []);

  const styles = anims.map((a) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedStyle(() => ({ opacity: a.value }))
  );

  return (
    <View style={{ flexDirection: "row", gap: barW / 2, alignItems: "center" }}>
      {styles.map((s, i) => (
        <Animated.View
          key={i}
          style={[s, { width: barW, height: barH, borderRadius: barW / 2, backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

export function Spinner({ variant = "default", size = "default", className, style }: SpinnerProps) {
  const { colorScheme } = useColorScheme();
  const { activitySize, dotSize, barW, barH, circleSize } = sizeDef[size];
  const color = colorScheme === "dark" ? "#e5e7eb" : "#374151";

  return (
    <View className={cn("items-center justify-center", className)} style={style}>
      {variant === "default" && <ActivityIndicator size={activitySize} color={color} />}
      {variant === "circle" && <CircleSpinner size={circleSize} color={color} />}
      {variant === "dots"   && <DotsSpinner dotSize={dotSize} color={color} />}
      {variant === "pulse"  && <PulseSpinner size={circleSize} color={color} />}
      {variant === "bars"   && <BarsSpinner barW={barW} barH={barH} color={color} />}
    </View>
  );
}
