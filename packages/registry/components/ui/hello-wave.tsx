import { useEffect } from 'react';
import { Text, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export interface HelloWaveProps {
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  style?: ViewStyle;
}

const fontSizes = { sm: 20, md: 28, lg: 36 };

export function HelloWave({ children = '👋', size = 'md', style }: HelloWaveProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 150 }),
        withTiming(0, { duration: 150 })
      ),
      4
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className='items-center justify-center' style={style}>
      <Animated.View style={animatedStyle}>
        <Text style={{ fontSize: fontSizes[size] }}>{children as string}</Text>
      </Animated.View>
    </View>
  );
}
