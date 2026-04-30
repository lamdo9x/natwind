import { cn } from "@/lib/utils";
import { X } from "lucide-react-native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (item: Omit<ToastData, "id">) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const variantBg: Record<ToastVariant, string> = {
  default: "bg-foreground",
  success: "bg-success",
  error:   "bg-destructive",
  warning: "bg-warning",
  info:    "bg-info",
};

const variantText: Record<ToastVariant, string> = {
  default: "text-background",
  success: "text-success-foreground",
  error:   "text-destructive-foreground",
  warning: "text-warning-foreground",
  info:    "text-info-foreground",
};

interface ToastItemProps {
  item: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ item, onDismiss }: ToastItemProps) {
  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);
  const variant = item.variant ?? "default";

  const dismiss = useCallback(() => {
    translateY.value = withTiming(-80, { duration: 250 });
    opacity.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) runOnJS(onDismiss)(item.id);
    });
  }, [item.id, onDismiss]);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });

    const timer = setTimeout(dismiss, item.duration ?? 4000);
    return () => clearTimeout(timer);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animStyle}
      className={cn(
        "mx-4 mb-2 px-4 py-3 rounded-xl flex-row items-center shadow-lg",
        variantBg[variant]
      )}
    >
      <View className="flex-1 mr-3">
        {item.title && (
          <Text className={cn("text-sm font-semibold", variantText[variant])}>
            {item.title}
          </Text>
        )}
        {item.description && (
          <Text className={cn("text-xs mt-0.5", variantText[variant])}>
            {item.description}
          </Text>
        )}
      </View>
      <Pressable onPress={dismiss} hitSlop={8}>
        <X size={16} color="#ffffff" />
      </Pressable>
    </Animated.View>
  );
}

interface ToastProviderProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function ToastProvider({ children, containerStyle }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((item: Omit<ToastData, "id">): string => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev, { ...item, id }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const createVariant =
    (variant: ToastVariant) =>
    (title: string, description?: string): string =>
      addToast({ title, description, variant });

  const ctx: ToastContextType = {
    toast: addToast,
    success: createVariant("success"),
    error: createVariant("error"),
    warning: createVariant("warning"),
    info: createVariant("info"),
    dismiss,
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <View
        style={[
          {
            position: "absolute",
            top: 56,
            left: 0,
            right: 0,
            zIndex: 9999,
            pointerEvents: "box-none",
          },
          containerStyle,
        ]}
        pointerEvents="box-none"
      >
        {toasts.map((item) => (
          <ToastItem key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>");
  return ctx;
}
