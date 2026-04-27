import { cn } from "@/lib/utils";
import { Pressable, Text, ViewStyle } from "react-native";

type ToggleVariant = "default" | "outline";
type ToggleSize = "sm" | "default" | "lg";

export interface ToggleProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

const sizeClasses: Record<ToggleSize, string> = {
  sm: "h-8 px-2 rounded-lg",
  default: "h-10 px-3 rounded-xl",
  lg: "h-12 px-4 rounded-xl",
};

export function Toggle({
  pressed = false,
  onPressedChange,
  variant = "default",
  size = "default",
  disabled = false,
  children,
  className,
  style,
}: ToggleProps) {
  return (
    <Pressable
      onPress={() => !disabled && onPressedChange?.(!pressed)}
      disabled={disabled}
      className={cn(
        "items-center justify-center flex-row",
        sizeClasses[size],
        variant === "default" &&
          (pressed
            ? "bg-blue-500"
            : "bg-gray-100 dark:bg-gray-800"),
        variant === "outline" &&
          (pressed
            ? "bg-blue-50 dark:bg-blue-950 border border-blue-500"
            : "border border-gray-200 dark:border-gray-700"),
        disabled && "opacity-50",
        className
      )}
      style={style}
    >
      {typeof children === "string" ? (
        <Text
          className={cn(
            "text-sm font-medium",
            pressed
              ? variant === "default"
                ? "text-white"
                : "text-blue-500"
              : "text-gray-700 dark:text-gray-300"
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
