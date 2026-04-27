import { useColor } from '@/hooks/useColor';
import React, { useEffect, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export interface AudioWaveformProps {
  data?: number[];
  isPlaying?: boolean;
  progress?: number;
  onSeek?: (position: number) => void;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
  style?: ViewStyle;
  height?: number;
  barCount?: number;
  barWidth?: number;
  activeColor?: string;
  inactiveColor?: string;
  animated?: boolean;
  showProgress?: boolean;
  interactive?: boolean;
}

const Bar = React.memo(({
  value, height, width, isActive, showProgress, activeColor, inactiveColor, isPlaying, animated,
}: {
  value: number; height: number; width: number; isActive: boolean; showProgress: boolean;
  activeColor: string; inactiveColor: string; isPlaying: boolean; animated: boolean;
}) => {
  const animatedValue = useSharedValue(value);

  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(animatedValue.value, [0, 1], [4, height * 0.9], 'clamp'),
  }));

  useEffect(() => {
    if (isPlaying && animated && !showProgress) {
      const dur = 200 + Math.random() * 200;
      animatedValue.value = withRepeat(
        withSequence(
          withTiming(value * (0.9 + Math.random() * 0.2), { duration: dur }),
          withTiming(value * (0.9 + Math.random() * 0.2), { duration: dur })
        ),
        -1, true
      );
    } else {
      cancelAnimation(animatedValue);
      animatedValue.value = withTiming(value, { duration: animated ? 250 : 0 });
    }
    return () => { cancelAnimation(animatedValue); };
  }, [value, isPlaying, animated, showProgress, animatedValue]);

  return (
    <Animated.View
      style={[
        { width, borderRadius: 2, backgroundColor: isActive || !showProgress ? activeColor : inactiveColor },
        animatedStyle,
      ]}
    />
  );
});

export function AudioWaveform({
  data, isPlaying = false, progress = 0, onSeek, onSeekStart, onSeekEnd,
  style, height = 60, barCount = 50, barWidth = 3, activeColor, inactiveColor,
  animated = true, showProgress = false, interactive = false,
}: AudioWaveformProps) {
  const primaryColor = useColor('primary');
  const mutedColor = useColor('muted');
  const resolvedActiveColor = activeColor ?? primaryColor;
  const resolvedInactiveColor = inactiveColor ?? mutedColor;

  const waveformData = useMemo(() => {
    if (data && data.length > 0) {
      if (data.length === barCount) return data;
      return Array.from({ length: barCount }, (_, i) => {
        const idx = (i / barCount) * data.length;
        const lo = Math.floor(idx), hi = Math.min(Math.ceil(idx), data.length - 1);
        return data[lo] * (1 - (idx - lo)) + data[hi] * (idx - lo);
      });
    }
    return Array.from({ length: barCount }, (_, i) => {
      const base = Math.sin((i / barCount) * Math.PI * 4) * 0.3 + 0.5;
      return Math.max(0.1, Math.min(1, base + (Math.random() - 0.5) * 0.2));
    });
  }, [data, barCount]);

  const [containerWidth, setContainerWidth] = React.useState(0);

  const panGesture = Gesture.Pan()
    .enabled(interactive && !!onSeek)
    .onBegin(() => { if (onSeekStart) runOnJS(onSeekStart)(); })
    .onChange((e) => {
      if (onSeek && containerWidth > 0) runOnJS(onSeek)(Math.max(0, Math.min(100, (e.x / containerWidth) * 100)));
    })
    .onEnd(() => { if (onSeekEnd) runOnJS(onSeekEnd)(); });

  const tapGesture = Gesture.Tap()
    .enabled(interactive && !!onSeek)
    .onEnd((e) => {
      if (onSeek && containerWidth > 0) runOnJS(onSeek)(Math.max(0, Math.min(100, (e.x / containerWidth) * 100)));
    });

  return (
    <GestureDetector gesture={Gesture.Race(panGesture, tapGesture)}>
      <View
        className='flex-row items-center justify-center gap-0.5 overflow-hidden'
        style={[{ height }, style]}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {waveformData.map((value, index) => (
          <Bar
            key={index}
            value={value}
            height={height}
            width={barWidth}
            isActive={showProgress ? (index / barCount) * 100 <= progress : true}
            showProgress={showProgress}
            activeColor={resolvedActiveColor}
            inactiveColor={resolvedInactiveColor}
            isPlaying={isPlaying}
            animated={animated}
          />
        ))}
      </View>
    </GestureDetector>
  );
}
