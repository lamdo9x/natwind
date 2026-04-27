import { cn } from "@/lib/utils";
import { Text, TextStyle, View, ViewStyle } from "react-native";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantClasses: Record<BadgeVariant, { container: string; text: string }> = {
  default:     { container: "bg-blue-500",                                                        text: "text-white" },
  secondary:   { container: "bg-gray-100 dark:bg-gray-800",                                       text: "text-gray-900 dark:text-gray-100" },
  destructive: { container: "bg-red-500",                                                          text: "text-white" },
  success:     { container: "bg-green-500",                                                        text: "text-white" },
  outline:     { container: "border border-gray-200 dark:border-gray-700 bg-transparent",          text: "text-gray-900 dark:text-gray-100" },
};

export function Badge({
  children,
  variant = "default",
  className,
  textClassName,
  style,
  textStyle,
}: BadgeProps) {
  const { container, text } = variantClasses[variant];
  return (
    <View
      className={cn("items-center justify-center py-1.5 px-3 rounded-full", container, className)}
      style={style}
    >
      <Text className={cn("text-xs font-medium", text, textClassName)} style={textStyle}>
        {children}
      </Text>
    </View>
  );
}
