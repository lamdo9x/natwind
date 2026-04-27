import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import { LucideProps } from "lucide-react-native";
import { forwardRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "success"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends Omit<PressableProps, "style"> {
  label?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  animation?: boolean;
  haptic?: boolean;
  icon?: React.ComponentType<LucideProps>;
  className?: string;
  style?: ViewStyle;
}

const variantClasses: Record<ButtonVariant, { container: string; text: string }> = {
  default: {
    container: "bg-blue-500 active:bg-blue-600 dark:bg-blue-600 dark:active:bg-blue-700",
    text: "text-white",
  },
  destructive: {
    container: "bg-red-500 active:bg-red-600 dark:bg-red-600 dark:active:bg-red-700",
    text: "text-white",
  },
  success: {
    container: "bg-green-500 active:bg-green-600 dark:bg-green-600 dark:active:bg-green-700",
    text: "text-white",
  },
  outline: {
    container: "border border-gray-200 dark:border-gray-700 bg-transparent active:bg-gray-50 dark:active:bg-gray-800",
    text: "text-blue-500 dark:text-blue-400",
  },
  secondary: {
    container: "bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700",
    text: "text-gray-900 dark:text-gray-100",
  },
  ghost: {
    container: "bg-transparent active:bg-gray-100 dark:active:bg-gray-800",
    text: "text-blue-500 dark:text-blue-400",
  },
  link: {
    container: "bg-transparent",
    text: "text-blue-500 dark:text-blue-400 underline",
  },
};

const sizeClasses: Record<ButtonSize, { container: string; text: string; iconSize: number }> = {
  default: { container: "h-12 px-8 rounded-xl",  text: "text-base", iconSize: 18 },
  sm:      { container: "h-11 px-6 rounded-lg",  text: "text-sm",   iconSize: 16 },
  lg:      { container: "h-14 px-9 rounded-2xl", text: "text-lg",   iconSize: 20 },
  icon:    { container: "h-12 w-12 rounded-xl",  text: "text-base", iconSize: 18 },
};

const spinnerColor: Record<ButtonVariant, string> = {
  default:     "#ffffff",
  destructive: "#ffffff",
  success:     "#ffffff",
  outline:     "#3b82f6",
  secondary:   "#111827",
  ghost:       "#3b82f6",
  link:        "#3b82f6",
};

export const Button = forwardRef<View, ButtonProps>(
  (
    {
      label,
      children,
      variant = "default",
      size = "default",
      loading = false,
      animation = true,
      haptic = true,
      icon: IconComponent,
      disabled,
      className,
      style,
      onPressIn,
      onPressOut,
      ...props
    },
    ref
  ) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (e: any) => {
      if (animation) scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
      if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
      if (animation) scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      onPressOut?.(e);
    };

    const { container, text } = variantClasses[variant];
    const sizeStyle = sizeClasses[size];

    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          ref={ref}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          className={cn(
            "flex-row items-center justify-center",
            container,
            sizeStyle.container,
            (disabled || loading) && "opacity-50",
            className
          )}
          style={style}
          {...props}
        >
          {loading ? (
            <ActivityIndicator size="small" color={spinnerColor[variant]} />
          ) : (
            <>
              {IconComponent && (
                <IconComponent
                  size={sizeStyle.iconSize}
                  className={cn(text, (label || children) && "mr-2")}
                />
              )}
              {label ? (
                <Text className={cn("font-medium", text, sizeStyle.text)}>
                  {label}
                </Text>
              ) : (
                children
              )}
            </>
          )}
        </Pressable>
      </Animated.View>
    );
  }
);

Button.displayName = "Button";
