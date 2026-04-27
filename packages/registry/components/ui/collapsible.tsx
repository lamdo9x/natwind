import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  style?: ViewStyle;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className,
  style,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const rotation = useSharedValue(defaultOpen ? 90 : 0);

  useEffect(() => {
    rotation.value = withTiming(isOpen ? 90 : 0, { duration: 200 });
  }, [isOpen]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className={cn("w-full", className)} style={style}>
      <TouchableOpacity
        className="flex-row items-center gap-2 py-2"
        onPress={() => setIsOpen((v) => !v)}
        activeOpacity={0.7}
      >
        <Animated.View style={chevronStyle}>
          <ChevronRight size={18} color="#6b7280" />
        </Animated.View>
        <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</Text>
      </TouchableOpacity>

      {isOpen && <View className="mt-1 ml-6">{children}</View>}
    </View>
  );
}
