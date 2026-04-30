import { LucideProps } from "lucide-react-native";
import { useTheme } from "../../theme/theme-provider";
import { useColorScheme } from "nativewind";

export type IconProps = LucideProps & {
  icon: React.ComponentType<LucideProps>;
  lightColor?: string;
  darkColor?: string;
};

export function Icon({
  icon: IconComponent,
  lightColor,
  darkColor,
  color,
  size = 24,
  strokeWidth = 1.8,
  ...rest
}: IconProps) {
  const tokens = useTheme();
  const { colorScheme } = useColorScheme();
  const themedColor = color ?? (colorScheme === "dark"
    ? (darkColor ?? tokens.foreground)
    : (lightColor ?? tokens.foreground));

  return (
    <IconComponent
      color={themedColor}
      size={size}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );
}
