import { useEffect } from "react";
import { Keyboard, Platform } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AvoidKeyboardProps {
  offset?: number;
  duration?: number;
}

export function AvoidKeyboard({ offset = 0, duration = 0 }: AvoidKeyboardProps) {
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const animDuration = e.duration || 250;
      keyboardHeight.value = withTiming(e.endCoordinates.height + offset, {
        duration: animDuration + duration,
        easing: Easing.out(Easing.quad),
      });
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      const animDuration = e.duration || 250;
      keyboardHeight.value = withTiming(0, {
        duration: animDuration + duration,
        easing: Easing.in(Easing.quad),
      });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [offset, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: keyboardHeight.value,
  }));

  return <Animated.View style={animatedStyle} />;
}
