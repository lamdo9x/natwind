import { cn } from "@/lib/utils";
import { Text, TextStyle, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function Card({ children, className, style }: CardProps) {
  return (
    <View
      className={cn("w-full bg-white dark:bg-gray-900 rounded-2xl p-[18px] shadow-sm", className)}
      style={style}
    >
      {children}
    </View>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function CardHeader({ children, className, style }: CardHeaderProps) {
  return (
    <View className={cn("mb-2", className)} style={style}>
      {children}
    </View>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: TextStyle;
}

export function CardTitle({ children, className, style }: CardTitleProps) {
  return (
    <Text
      className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)}
      style={style}
    >
      {children}
    </Text>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
  style?: TextStyle;
}

export function CardDescription({ children, className, style }: CardDescriptionProps) {
  return (
    <Text
      className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
      style={style}
    >
      {children}
    </Text>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function CardContent({ children, className, style }: CardContentProps) {
  return (
    <View className={cn(className)} style={style}>
      {children}
    </View>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function CardFooter({ children, className, style }: CardFooterProps) {
  return (
    <View className={cn("flex-row items-center mt-4", className)} style={style}>
      {children}
    </View>
  );
}
