import { cn } from "@/lib/utils";
import { X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const DISMISS_THRESHOLD = 150;

export interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  snapPoints?: number[];
  initialSnapIndex?: number;
  showHandle?: boolean;
  showCloseButton?: boolean;
  scrollable?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function BottomSheet({
  isVisible,
  onClose,
  title,
  snapPoints = [0.5],
  initialSnapIndex = 0,
  showHandle = true,
  showCloseButton = false,
  scrollable = false,
  children,
  className,
  style,
}: BottomSheetProps) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";

  const snapHeights = snapPoints.map((p) => SCREEN_HEIGHT * p);
  const initialHeight = snapHeights[initialSnapIndex] ?? snapHeights[0];

  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const currentHeight = useRef(initialHeight);
  const dragStart = useRef(0);
  const isDragging = useRef(false);

  const dismiss = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 250 });
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      currentHeight.current = initialHeight;
      backdropOpacity.value = withTiming(0.5, { duration: 250 });
      translateY.value = withSpring(SCREEN_HEIGHT - initialHeight, {
        damping: 20,
        stiffness: 200,
      });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 250 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    }
  }, [isVisible, initialHeight]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {
        dragStart.current = translateY.value as number;
        isDragging.current = true;
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = Math.max(
          SCREEN_HEIGHT - snapHeights[snapHeights.length - 1],
          dragStart.current + gestureState.dy
        );
        translateY.value = newY;
      },
      onPanResponderRelease: (_, gestureState) => {
        isDragging.current = false;
        const currentY = dragStart.current + gestureState.dy;
        const currentSheetHeight = SCREEN_HEIGHT - currentY;

        if (gestureState.dy > DISMISS_THRESHOLD || currentSheetHeight < 100) {
          runOnJS(dismiss)();
          return;
        }

        // Snap to nearest snap point
        const nearestSnap = snapHeights.reduce((prev, curr) =>
          Math.abs(curr - currentSheetHeight) < Math.abs(prev - currentSheetHeight)
            ? curr
            : prev
        );
        currentHeight.current = nearestSnap;
        translateY.value = withSpring(SCREEN_HEIGHT - nearestSnap, {
          damping: 20,
          stiffness: 200,
        });
      },
    })
  ).current;

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const ContentWrapper = scrollable ? ScrollView : View;

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

        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: SCREEN_HEIGHT,
            },
            sheetAnimStyle,
          ]}
        >
          <View
            className={cn(
              "flex-1 bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden",
              className
            )}
            style={style}
          >
            <View {...panResponder.panHandlers} className="pt-3 pb-2">
              {showHandle && (
                <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 self-center" />
              )}

              {(title || showCloseButton) && (
                <View className="flex-row items-center justify-between px-6 pt-3 pb-1">
                  {title ? (
                    <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 flex-1">
                      {title}
                    </Text>
                  ) : (
                    <View className="flex-1" />
                  )}
                  {showCloseButton && (
                    <Pressable onPress={dismiss} hitSlop={8}>
                      <X size={20} color={iconColor} />
                    </Pressable>
                  )}
                </View>
              )}
            </View>

            <ContentWrapper
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ContentWrapper>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function useBottomSheet() {
  const [isVisible, setIsVisible] = useState(false);
  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);
  return { isVisible, open, close };
}
