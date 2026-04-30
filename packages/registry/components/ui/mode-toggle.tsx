import { Moon, Sun } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useTheme } from "../../theme/theme-provider";
import { Pressable, ViewStyle } from "react-native";

interface ModeToggleProps {
  size?: number;
  className?: string;
  style?: ViewStyle;
}

export function ModeToggle({ size = 20, style }: ModeToggleProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const tokens = useTheme();
  const iconColor = tokens.foreground;

  return (
    <Pressable
      onPress={() => setColorScheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-xl items-center justify-center bg-muted"
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
