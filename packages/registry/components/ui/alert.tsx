import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react-native";
import { createContext, useContext } from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

export type AlertVariant = "default" | "info" | "warning" | "destructive" | "success";

const AlertContext = createContext<AlertVariant>("default");

const containerClasses: Record<AlertVariant, string> = {
  default:     "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  info:        "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800",
  warning:     "bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800",
  destructive: "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800",
  success:     "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800",
};

const iconColors: Record<AlertVariant, string> = {
  default:     "#6b7280",
  info:        "#3b82f6",
  warning:     "#eab308",
  destructive: "#ef4444",
  success:     "#22c55e",
};

const titleClasses: Record<AlertVariant, string> = {
  default:     "text-gray-900 dark:text-gray-100",
  info:        "text-blue-900 dark:text-blue-100",
  warning:     "text-yellow-900 dark:text-yellow-100",
  destructive: "text-red-900 dark:text-red-100",
  success:     "text-green-900 dark:text-green-100",
};

const descClasses: Record<AlertVariant, string> = {
  default:     "text-gray-600 dark:text-gray-400",
  info:        "text-blue-700 dark:text-blue-300",
  warning:     "text-yellow-700 dark:text-yellow-300",
  destructive: "text-red-700 dark:text-red-300",
  success:     "text-green-700 dark:text-green-300",
};

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  icon?: React.ComponentType<LucideProps>;
  className?: string;
  style?: ViewStyle;
}

export function Alert({ children, variant = "default", icon: IconComponent, className, style }: AlertProps) {
  return (
    <AlertContext.Provider value={variant}>
      <View className={cn("w-full rounded-xl p-4", containerClasses[variant], className)} style={style}>
        {IconComponent && (
          <View className="mb-2">
            <IconComponent size={18} color={iconColors[variant]} />
          </View>
        )}
        {children}
      </View>
    </AlertContext.Provider>
  );
}

interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: TextStyle;
}

export function AlertTitle({ children, className, style }: AlertTitleProps) {
  const variant = useContext(AlertContext);
  return (
    <Text className={cn("text-sm font-semibold mb-1", titleClasses[variant], className)} style={style}>
      {children}
    </Text>
  );
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
  style?: TextStyle;
}

export function AlertDescription({ children, className, style }: AlertDescriptionProps) {
  const variant = useContext(AlertContext);
  return (
    <Text className={cn("text-sm", descClasses[variant], className)} style={style}>
      {children}
    </Text>
  );
}
