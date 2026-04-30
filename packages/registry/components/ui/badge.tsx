import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Text, TextStyle, View, ViewStyle } from "react-native";

export const badgeVariants = cva(
  "items-center justify-center py-1.5 px-3 rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        destructive: "bg-destructive",
        success: "bg-success",
        outline: "border border-border bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const badgeTextVariants = cva("text-xs font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      success: "text-success-foreground",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = "default",
  className,
  textClassName,
  style,
  textStyle,
}: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} style={style}>
      <Text
        className={cn(badgeTextVariants({ variant }), textClassName)}
        style={textStyle}
      >
        {children}
      </Text>
    </View>
  );
}
