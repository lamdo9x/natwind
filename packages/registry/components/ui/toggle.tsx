import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Pressable, Text, ViewStyle } from "react-native";

const toggleVariants = cva("items-center justify-center flex-row", {
  variants: {
    variant: {
      default: "",
      outline: "border",
    },
    size: {
      sm: "h-8 px-2 rounded-lg",
      default: "h-10 px-3 rounded-xl",
      lg: "h-12 px-4 rounded-xl",
    },
    pressed: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { variant: "default", pressed: true,  class: "bg-primary" },
    { variant: "default", pressed: false, class: "bg-muted" },
    { variant: "outline", pressed: true,  class: "bg-muted border-primary" },
    { variant: "outline", pressed: false, class: "border-border" },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
    pressed: false,
  },
});

const toggleTextVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      default: "",
      outline: "",
    },
    pressed: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { variant: "default", pressed: true,  class: "text-primary-foreground" },
    { variant: "default", pressed: false, class: "text-muted-foreground" },
    { variant: "outline", pressed: true,  class: "text-primary" },
    { variant: "outline", pressed: false, class: "text-foreground" },
  ],
  defaultVariants: {
    variant: "default",
    pressed: false,
  },
});

export type ToggleVariant = NonNullable<VariantProps<typeof toggleVariants>["variant"]>;
export type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>["size"]>;

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
        toggleVariants({ variant, size, pressed }),
        disabled && "opacity-50",
        className
      )}
      style={style}
    >
      {typeof children === "string" ? (
        <Text className={toggleTextVariants({ variant, pressed })}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
