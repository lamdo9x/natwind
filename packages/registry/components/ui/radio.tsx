import { cn } from "@/lib/utils";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
  style?: ViewStyle;
}

export function RadioGroup({
  options,
  value,
  onValueChange,
  disabled = false,
  orientation = "vertical",
  className,
  style,
}: RadioGroupProps) {
  return (
    <View
      className={cn(
        orientation === "horizontal" ? "flex-row gap-4 flex-wrap" : "gap-2",
        className
      )}
      style={style}
    >
      {options.map((option) => (
        <RadioButton
          key={option.value}
          option={option}
          selected={value === option.value}
          onPress={() => !disabled && onValueChange?.(option.value)}
          disabled={disabled || !!option.disabled}
        />
      ))}
    </View>
  );
}

interface RadioButtonProps {
  option: RadioOption;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function RadioButton({ option, selected, onPress, disabled = false }: RadioButtonProps) {
  const isDisabled = disabled || !!option.disabled;
  return (
    <TouchableOpacity
      className={cn("flex-row items-center gap-3", isDisabled && "opacity-50")}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View
        className={cn(
          "w-5 h-5 rounded-full border-2 items-center justify-center",
          selected
            ? "border-primary"
            : "border-border"
        )}
      >
        {selected && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </View>
      <Text className="text-sm text-foreground">{option.label}</Text>
    </TouchableOpacity>
  );
}
