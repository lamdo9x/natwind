import { cn } from "@/lib/utils";
import { X } from "lucide-react-native";
import { useTheme } from "../../theme/theme-provider";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Modal, Pressable, Text, View, ViewStyle } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export type SheetSide = "bottom" | "top" | "left" | "right";

export interface SheetProps {
  isVisible: boolean;
  onClose: () => void;
  side?: SheetSide;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  size?: number;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

function getInitialTranslate(side: SheetSide, size: number) {
  switch (side) {
    case "bottom": return { x: 0, y: size };
    case "top": return { x: 0, y: -size };
    case "left": return { x: -size, y: 0 };
    case "right": return { x: size, y: 0 };
  }
}

export function Sheet({
  isVisible,
  onClose,
  side = "bottom",
  title,
  description,
  showCloseButton = true,
  size,
  children,
  className,
  style,
}: SheetProps) {
  const tokens = useTheme();
  const iconColor = tokens.mutedForeground;

  const isHorizontal = side === "left" || side === "right";
  const defaultSize = isHorizontal ? SCREEN_WIDTH * 0.8 : SCREEN_HEIGHT * 0.5;
  const sheetSize = size ?? defaultSize;

  const backdropOpacity = useSharedValue(0);
  const translateX = useSharedValue(getInitialTranslate(side, sheetSize).x);
  const translateY = useSharedValue(getInitialTranslate(side, sheetSize).y);

  const dismiss = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 250 });
    const initial = getInitialTranslate(side, sheetSize);
    translateX.value = withTiming(initial.x, { duration: 300 });
    translateY.value = withTiming(initial.y, { duration: 300 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  }, [onClose, side, sheetSize]);

  useEffect(() => {
    if (isVisible) {
      backdropOpacity.value = withTiming(0.5, { duration: 250 });
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    } else {
      const initial = getInitialTranslate(side, sheetSize);
      backdropOpacity.value = withTiming(0, { duration: 250 });
      translateX.value = withTiming(initial.x, { duration: 300 });
      translateY.value = withTiming(initial.y, { duration: 300 });
    }
  }, [isVisible, side, sheetSize]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const positionStyle: ViewStyle = (() => {
    switch (side) {
      case "bottom":
        return { position: "absolute", bottom: 0, left: 0, right: 0, height: sheetSize };
      case "top":
        return { position: "absolute", top: 0, left: 0, right: 0, height: sheetSize };
      case "left":
        return { position: "absolute", left: 0, top: 0, bottom: 0, width: sheetSize };
      case "right":
        return { position: "absolute", right: 0, top: 0, bottom: 0, width: sheetSize };
    }
  })();

  const roundedClass = (() => {
    switch (side) {
      case "bottom": return "rounded-t-3xl";
      case "top": return "rounded-b-3xl";
      case "left": return "rounded-r-3xl";
      case "right": return "rounded-l-3xl";
    }
  })();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={dismiss}
    >
      <View className="flex-1">
        <Animated.View
          style={[
            { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#000" },
            backdropStyle,
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={dismiss} />
        </Animated.View>

        <Animated.View style={[positionStyle, sheetAnimStyle]}>
          <View
            className={cn(
              "flex-1 bg-background overflow-hidden",
              roundedClass,
              className
            )}
            style={style}
          >
            {(title || description || showCloseButton) && (
              <View className="px-6 pt-6 pb-4 border-b border-border">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-4">
                    {title && (
                      <Text className="text-lg font-semibold text-foreground">
                        {title}
                      </Text>
                    )}
                    {description && (
                      <Text className="text-sm text-muted-foreground mt-1">
                        {description}
                      </Text>
                    )}
                  </View>
                  {showCloseButton && (
                    <Pressable onPress={dismiss} hitSlop={8} className="mt-0.5">
                      <X size={20} color={iconColor} />
                    </Pressable>
                  )}
                </View>
              </View>
            )}
            <View className="flex-1">{children}</View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function useSheet() {
  const [isVisible, setIsVisible] = useState(false);
  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);
  return { isVisible, open, close };
}
