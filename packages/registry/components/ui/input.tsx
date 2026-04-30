import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react-native";
import { useTheme } from "../../theme/theme-provider";
import { forwardRef, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export type InputVariant = "filled" | "outline";

export interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: InputVariant;
  disabled?: boolean;
  type?: "input" | "textarea";
  rows?: number;
  icon?: React.ComponentType<LucideProps>;
  rightComponent?: React.ReactNode | (() => React.ReactNode);
  containerClassName?: string;
  inputClassName?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      variant = "filled",
      disabled = false,
      type = "input",
      rows = 4,
      icon: IconComponent,
      rightComponent,
      containerClassName,
      inputClassName,
      containerStyle,
      inputStyle,
      onFocus,
      onBlur,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const tokens = useTheme();

    const placeholderColor = tokens.mutedForeground;
    const textColor = tokens.foreground;

    const isTextarea = type === "textarea";

    return (
      <View className={cn("gap-1.5 w-full", containerClassName)} style={containerStyle}>
        {label && (
          <Text className="text-sm font-medium text-foreground">{label}</Text>
        )}

        <View
          className={cn(
            "flex-row items-center rounded-xl px-3",
            isTextarea ? "items-start py-3" : "h-12",
            variant === "filled"
              ? "bg-muted"
              : "border border-border bg-transparent",
            isFocused && variant === "filled"  && "opacity-80",
            isFocused && variant === "outline" && "border-ring",
            error  && "border border-destructive",
            disabled && "opacity-50"
          )}
        >
          {IconComponent && (
            <IconComponent
              size={18}
              color={tokens.mutedForeground}
              style={{ marginRight: 8 }}
            />
          )}

          <TextInput
            ref={ref}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            editable={!disabled}
            multiline={isTextarea}
            numberOfLines={isTextarea ? rows : 1}
            onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
            onBlur={(e)  => { setIsFocused(false); onBlur?.(e); }}
            className={cn("flex-1 text-base", inputClassName)}
            style={[
              { color: textColor, textAlignVertical: isTextarea ? "top" : "center" },
              inputStyle,
            ]}
            {...props}
          />

          {rightComponent && (
            <Pressable>
              {typeof rightComponent === "function" ? rightComponent() : rightComponent}
            </Pressable>
          )}
        </View>

        {error && <Text className="text-xs text-destructive">{error}</Text>}
        {hint && !error && <Text className="text-xs text-muted-foreground">{hint}</Text>}
      </View>
    );
  }
);

Input.displayName = "Input";
