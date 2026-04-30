import { cn } from "@/lib/utils";
import { useTheme } from "../../theme/theme-provider";
import { LucideProps } from "lucide-react-native";
import { createContext, useContext } from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

export type AlertVariant = "default" | "info" | "warning" | "destructive" | "success";

const AlertContext = createContext<AlertVariant>("default");

const containerClasses: Record<AlertVariant, string> = {
  default:     "bg-muted border border-border",
  info:        "bg-info/10 border border-info/30",
  warning:     "bg-warning/10 border border-warning/30",
  destructive: "bg-destructive/10 border border-destructive/30",
  success:     "bg-success/10 border border-success/30",
};

const titleClasses: Record<AlertVariant, string> = {
  default:     "text-foreground",
  info:        "text-info",
  warning:     "text-warning",
  destructive: "text-destructive",
  success:     "text-success",
};

const descClasses: Record<AlertVariant, string> = {
  default:     "text-muted-foreground",
  info:        "text-info",
  warning:     "text-warning",
  destructive: "text-destructive",
  success:     "text-success",
};

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  icon?: React.ComponentType<LucideProps>;
  className?: string;
  style?: ViewStyle;
}

export function Alert({ children, variant = "default", icon: IconComponent, className, style }: AlertProps) {
  const tokens = useTheme();

  const iconColors: Record<AlertVariant, string> = {
    default:     tokens.mutedForeground,
    info:        tokens.info,
    warning:     tokens.warning,
    destructive: tokens.destructive,
    success:     tokens.success,
  };

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
