import { Moon, Sun } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, ViewStyle } from "react-native";

interface ModeToggleProps {
  size?: number;
  className?: string;
  style?: ViewStyle;
}

export function ModeToggle({ size = 20, style }: ModeToggleProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#f3f4f6" : "#111827";

  return (
    <Pressable
      onPress={() => setColorScheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-xl items-center justify-center bg-gray-100 dark:bg-gray-800"
      style={style}
    >
      {isDark ? (
        <Sun size={size} color={iconColor} />
      ) : (
        <Moon size={size} color={iconColor} />
      )}
    </Pressable>
  );
}
