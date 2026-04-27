import { Pressable, Text, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-blue-500 active:bg-blue-600",
  outline: "border border-blue-500 bg-transparent active:bg-blue-50",
  ghost: "bg-transparent active:bg-gray-100",
  destructive: "bg-red-500 active:bg-red-600",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 rounded-lg",
  md: "px-4 py-3 rounded-xl",
  lg: "px-6 py-4 rounded-2xl",
};

const textVariantClasses: Record<Variant, string> = {
  default: "text-white",
  outline: "text-blue-500",
  ghost: "text-gray-900 dark:text-gray-100",
  destructive: "text-white",
};

const textSizeClasses: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  variant = "default",
  size = "md",
  className,
  style,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        "items-center justify-center",
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-50",
        className
      )}
      style={style}
      disabled={disabled}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          className={cn(
            "font-medium",
            textVariantClasses[variant],
            textSizeClasses[size]
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
