import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ProgressProps {
  value: number;
  height?: number;
  className?: string;
  barClassName?: string;
  style?: ViewStyle;
}

export function Progress({ value, height = 8, className, barClassName, style }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const containerWidth = useSharedValue(0);
  const progress = useSharedValue(clamped);

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: 300 });
  }, [clamped]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: (progress.value / 100) * containerWidth.value,
  }));

  return (
    <View
      className={cn("w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700", className)}
      style={[{ height }, style]}
      onLayout={(e) => {
        containerWidth.value = e.nativeEvent.layout.width;
      }}
    >
      <Animated.View
        className={cn("h-full rounded-full bg-blue-500", barClassName)}
        style={animatedStyle}
      />
    </View>
  );
}
