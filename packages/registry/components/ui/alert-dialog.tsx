import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface AlertDialogProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  dismissible?: boolean;
  showCancelButton?: boolean;
  style?: ViewStyle;
}

export function AlertDialog({
  isVisible,
  onClose,
  title,
  description,
  children,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  dismissible = true,
  showCancelButton = true,
  style,
}: AlertDialogProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const backdropOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      backdropOpacity.value = withTiming(1, { duration: 200 });
      cardOpacity.value = withTiming(1, { duration: 200 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      cardOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) runOnJS(setModalVisible)(false);
      });
    }
  }, [isVisible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));
  const cardStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value }));

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    onClose();
  }, [onConfirm, onClose]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    onClose();
  }, [onCancel, onClose]);

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          },
          backdropStyle,
        ]}
      >
        {dismissible && (
          <Pressable
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={handleCancel}
          />
        )}

        <View
          className="w-full rounded-2xl overflow-hidden bg-white dark:bg-gray-900"
          style={style}
        >
          <Animated.View style={cardStyle}>
            {(title || description) && (
              <View className="px-6 pt-6 pb-2">
                {title && (
                  <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {title}
                  </Text>
                )}
                {description && (
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </Text>
                )}
              </View>
            )}

            {children && <View className="px-6 py-4">{children}</View>}

            <View className="flex-row gap-3 px-6 pb-6 pt-2">
              {showCancelButton && (
                <Pressable
                  onPress={handleCancel}
                  className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 items-center justify-center"
                >
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {cancelText}
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={handleConfirm}
                className="flex-1 h-11 rounded-xl bg-blue-500 items-center justify-center"
              >
                <Text className="text-sm font-medium text-white">
                  {confirmText}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

export function useAlertDialog() {
  const [isVisible, setIsVisible] = useState(false);
  const open = useCallback(() => setIsVisible(true), []);
  const close = useCallback(() => setIsVisible(false), []);
  return { isVisible, open, close };
}
