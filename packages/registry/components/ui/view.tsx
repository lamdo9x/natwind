import { View as RNView, ViewProps } from "react-native";

export function View({ style, ...props }: ViewProps) {
  return <RNView style={[{ backgroundColor: "transparent" }, style]} {...props} />;
}
