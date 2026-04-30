import type { PropsWithChildren, ReactElement } from 'react';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

export type ParallaxScrollViewProps = PropsWithChildren<{
  headerHeight?: number;
  headerImage: ReactElement;
}>;

export function ParallaxScrollView({
  children,
  headerHeight = 250,
  headerImage,
}: ParallaxScrollViewProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-headerHeight, 0, headerHeight],
          [-headerHeight / 2, 0, headerHeight * 0.75]
        ),
      },
      {
        scale: interpolate(
          scrollOffset.value,
          [-headerHeight, 0, headerHeight],
          [2, 1, 1]
        ),
      },
    ],
  }));

  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollEventThrottle={16}
      className='flex-1 bg-background'
    >
      <Animated.View
        className='overflow-hidden bg-background'
        style={[{ height: headerHeight }, headerAnimatedStyle]}
      >
        {headerImage}
      </Animated.View>
      <Animated.View className='flex-1 p-8 gap-4 overflow-hidden bg-background'>
        {children}
      </Animated.View>
    </Animated.ScrollView>
  );
}
