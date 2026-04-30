import { cn } from "@/lib/utils";
import { Check } from "lucide-react-native";
import { useTheme } from "../../theme/theme-provider";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  error,
  disabled = false,
  className,
  style,
}: CheckboxProps) {
  const tokens = useTheme();
  return (
    <View className={cn("gap-1", className)} style={style}>
      <TouchableOpacity
        onPress={() => !disabled && onCheckedChange(!checked)}
        disabled={disabled}
        activeOpacity={0.7}
        className={cn("flex-row items-center gap-3 py-1", disabled && "opacity-50")}
      >
        <View
          className={cn(
            "w-5 h-5 rounded items-center justify-center border-2",
            checked
              ? "bg-primary border-primary"
              : "bg-transparent border-border"
          )}
        >
          {checked && <Check size={12} color={tokens.primaryForeground} strokeWidth={3} />}
        </View>
        {label && (
          <Text className="text-sm text-foreground">{label}</Text>
        )}
      </TouchableOpacity>
      {error && (
        <Text className="text-xs text-destructive ml-8">{error}</Text>
      )}
    </View>
  );
}
