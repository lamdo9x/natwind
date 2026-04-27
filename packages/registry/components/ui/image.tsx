import { cn } from "@/lib/utils";
import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image";
import { useState } from "react";
import { Text, View, ViewStyle } from "react-native";

export interface ImageProps extends ExpoImageProps {
  containerClassName?: string;
  containerStyle?: ViewStyle;
  fallback?: React.ReactNode;
  errorText?: string;
}

export function Image({
  containerClassName,
  containerStyle,
  fallback,
  errorText = "Failed to load image",
  onError,
  className,
  ...props
}: ImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View
        className={cn("overflow-hidden items-center justify-center", containerClassName)}
        style={containerStyle}
      >
        {fallback ?? (
          <Text className="text-xs text-gray-400 text-center p-2">
            {errorText}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View
      className={cn("overflow-hidden", containerClassName)}
      style={containerStyle}
    >
      <ExpoImage
        {...props}
        onError={(e) => {
          setHasError(true);
          onError?.(e);
        }}
      />
    </View>
  );
}

Image.displayName = "Image";
