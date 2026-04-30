import { cn } from "@/lib/utils";
import { View, ViewStyle } from "react-native";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  style?: ViewStyle;
}

export function Separator({ orientation = "horizontal", className, style }: SeparatorProps) {
  return (
    <View
      className={cn(
        "bg-border",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
      style={style}
    />
  );
}
