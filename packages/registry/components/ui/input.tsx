import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react-native";
import { useColorScheme } from "nativewind";
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
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    const placeholderColor = isDark ? "#6b7280" : "#9ca3af";
    const textColor = isDark ? "#f3f4f6" : "#111827";

    const isTextarea = type === "textarea";

    return (
      <View className={cn("gap-1.5 w-full", containerClassName)} style={containerStyle}>
        {label && (
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
        )}

        <View
          className={cn(
            "flex-row items-center rounded-xl px-3",
            isTextarea ? "items-start py-3" : "h-12",
            variant === "filled"
              ? "bg-gray-100 dark:bg-gray-800"
              : "border border-gray-200 dark:border-gray-700 bg-transparent",
            isFocused && variant === "filled"  && "bg-gray-200 dark:bg-gray-700",
            isFocused && variant === "outline" && "border-blue-500 dark:border-blue-400",
            error  && "border border-red-500 dark:border-red-400",
            disabled && "opacity-50"
          )}
        >
          {IconComponent && (
            <IconComponent
              size={18}
              color={isDark ? "#9ca3af" : "#6b7280"}
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

        {error && <Text className="text-xs text-red-500 dark:text-red-400">{error}</Text>}
        {hint && !error && <Text className="text-xs text-gray-500 dark:text-gray-400">{hint}</Text>}
      </View>
    );
  }
);

Input.displayName = "Input";
