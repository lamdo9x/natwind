import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  variant?: "default" | "rounded";
  className?: string;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 100,
  variant = "default",
  className,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  return (
    <Animated.View
      className={cn(
        "bg-gray-200 dark:bg-gray-700",
        variant === "rounded" ? "rounded-full" : "rounded-xl",
        className
      )}
      style={[animatedStyle, { width: width as any, height }, style]}
    />
  );
}
