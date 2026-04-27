import { forwardRef } from "react";
import { ScrollView as RNScrollView, ScrollViewProps } from "react-native";

export const ScrollView = forwardRef<RNScrollView, ScrollViewProps>(
  ({ style, ...props }, ref) => (
    <RNScrollView
      ref={ref}
      style={[{ backgroundColor: "transparent" }, style]}
      {...props}
    />
  )
);

ScrollView.displayName = "ScrollView";
