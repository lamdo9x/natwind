import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, Text, View, ViewStyle } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface ActionSheetAction {
  label: string;
  onPress: () => void;
  variant?: "default" | "destructive" | "cancel";
  disabled?: boolean;
}

export interface ActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actions: ActionSheetAction[];
  style?: ViewStyle;
}

export function ActionSheet({
  isVisible,
  onClose,
  title,
  message,
  actions,
  style,
}: ActionSheetProps) {
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(300);

  const dismiss = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 250 });
    translateY.value = withTiming(300, { duration: 300 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      backdropOpacity.value = withTiming(0.5, { duration: 250 });
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 250 });
      translateY.value = withTiming(300, { duration: 300 });
    }
  }, [isVisible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const mainActions = actions.filter((a) => a.variant !== "cancel");
  const cancelAction = actions.find((a) => a.variant === "cancel");

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={dismiss}
    >
      <View className="flex-1 justify-end">
        <Animated.View
          style={[
            { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#000" },
            backdropStyle,
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={dismiss} />
        </Animated.View>

        <Animated.View style={[sheetStyle, style]}>
          <View className="mx-4 mb-2 rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
            {(title || message) && (
              <View className="px-4 pt-4 pb-3 items-center border-b border-gray-100 dark:border-gray-700">
                {title && (
                  <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">
                    {title}
                  </Text>
                )}
                {message && (
                  <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                    {message}
                  </Text>
                )}
              </View>
            )}

            {mainActions.map((action, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  if (!action.disabled) {
                    action.onPress();
                    dismiss();
                  }
                }}
                disabled={action.disabled}
                className={cn(
                  "px-4 py-4 items-center justify-center",
                  index < mainActions.length - 1 &&
                    "border-b border-gray-100 dark:border-gray-700",
                  action.disabled && "opacity-40"
                )}
              >
                <Text
                  className={cn(
                    "text-base",
                    action.variant === "destructive"
                      ? "text-red-500 dark:text-red-400"
                      : "text-blue-500"
                  )}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {cancelAction && (
            <Pressable
              onPress={() => {
                cancelAction.onPress();
                dismiss();
              }}
              className="mx-4 mb-8 rounded-2xl bg-white dark:bg-gray-800 py-4 items-center"
            >
              <Text className="text-base font-semibold text-blue-500">
                {cancelAction.label}
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

export function useActionSheet() {
  const [isVisible, setIsVisible] = useState(false);
  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);
  return { isVisible, open, close };
}
