import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  className,
  style,
}: SwitchProps) {
  const translateX = useSharedValue(checked ? 20 : 2);

  useEffect(() => {
    translateX.value = withSpring(checked ? 20 : 2, { damping: 15, stiffness: 300 });
  }, [checked]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className={cn("flex-row items-center gap-3", className)} style={style}>
      <TouchableOpacity
        onPress={() => !disabled && onCheckedChange(!checked)}
        disabled={disabled}
        activeOpacity={0.8}
        className={cn(
          "w-12 h-7 rounded-full justify-center",
          checked ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700",
          disabled && "opacity-50"
        )}
      >
        <Animated.View
          className="w-5 h-5 rounded-full bg-white shadow-sm"
          style={thumbStyle}
        />
      </TouchableOpacity>
      {label && (
        <Text className="text-sm text-gray-900 dark:text-gray-100">{label}</Text>
      )}
    </View>
  );
}
