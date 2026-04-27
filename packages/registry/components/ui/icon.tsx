import { LucideProps } from "lucide-react-native";
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
  const { colorScheme } = useColorScheme();
  const themedColor =
    color ??
    (colorScheme === "dark"
      ? (darkColor ?? "#e5e7eb")
      : (lightColor ?? "#374151"));

  return (
    <IconComponent
      color={themedColor}
      size={size}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );
}
