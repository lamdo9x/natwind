import { cn } from "@/lib/utils";
import { Image, ImageProps, ImageSource } from "expo-image";
import { Text, TextStyle, View, ViewStyle } from "react-native";

interface AvatarProps {
  children: React.ReactNode;
  size?: number;
  className?: string;
  style?: ViewStyle;
}

export function Avatar({ children, size = 40, className, style }: AvatarProps) {
  return (
    <View
      className={cn("overflow-hidden relative", className)}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
    >
      {children}
    </View>
  );
}

interface AvatarImageProps {
  source: ImageSource;
  style?: ImageProps["style"];
}

export function AvatarImage({ source, style }: AvatarImageProps) {
  return (
    <Image
      source={source}
      contentFit="cover"
      style={[{ width: "100%", height: "100%" }, style]}
    />
  );
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  textClassName?: string;
  textStyle?: TextStyle;
}

export function AvatarFallback({
  children,
  className,
  style,
  textClassName,
  textStyle,
}: AvatarFallbackProps) {
  return (
    <View
      className={cn(
        "w-full h-full bg-muted items-center justify-center",
        className
      )}
      style={style}
    >
      <Text
        className={cn("text-sm font-semibold text-muted-foreground", textClassName)}
        style={textStyle}
      >
        {children}
      </Text>
    </View>
  );
}
