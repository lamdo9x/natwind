import { useTheme } from '../../theme/theme-provider';
import {
  AudioModule,
  RecordingOptions,
  RecordingPresets,
  useAudioRecorder,
} from 'expo-audio';
import { Circle, Download, Mic, Square, Trash2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, View, ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { AudioPlayer } from './audio-player';
import { AudioWaveform } from './audio-waveform';
import { Button } from './button';
import { Text } from './text';

export interface AudioRecorderProps {
  style?: ViewStyle;
  quality?: 'high' | 'low';
  showWaveform?: boolean;
  showTimer?: boolean;
  maxDuration?: number;
  onRecordingComplete?: (uri: string) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  customRecordingOptions?: RecordingOptions;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function AudioRecorder({
  style,
  quality = 'high',
  showWaveform = true,
  showTimer = true,
  maxDuration,
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
  customRecordingOptions,
}: AudioRecorderProps) {
  const recordingOptions =
    customRecordingOptions ||
    (quality === 'high' ? RecordingPresets.HIGH_QUALITY : RecordingPresets.LOW_QUALITY);

  const recorder = useAudioRecorder(recordingOptions);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(
    Array.from({ length: 30 }, () => 0.2)
  );

  const tokens = useTheme();
  const textColor = tokens.foreground;
  const mutedColor = tokens.mutedForeground;
  const redColor = tokens.destructive;

  const recordingPulse = useSharedValue(1);
  const durationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const meteringInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        setPermissionGranted(status.granted);
        if (!status.granted) {
          Alert.alert('Permission Required', 'Please grant microphone permission to record audio.');
        }
      } catch {
        setPermissionGranted(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
      recordingPulse.value = withRepeat(withTiming(1.15, { duration: 600 }), -1, true);
    } else {
      cancelAnimation(recordingPulse);
      recordingPulse.value = withTiming(1, { duration: 200 });
    }
    return () => { cancelAnimation(recordingPulse); };
  }, [isRecording, recordingPulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordingPulse.value }],
  }));

  const handleStartRecording = async () => {
    if (!permissionGranted) {
      Alert.alert('Permission Required', 'Microphone permission is required to record.');
      return;
    }
    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
      setDuration(0);
      setRecordingUri(null);
      onRecordingStart?.();

      durationInterval.current = setInterval(() => {
        setDuration((prev) => {
          const next = prev + 1;
          if (maxDuration && next >= maxDuration) handleStopRecording();
          return next;
        });
      }, 1000);

      meteringInterval.current = setInterval(() => {
        const level = Math.random() * 0.8 + 0.1;
        setWaveformData((prev) => [...prev.slice(1), level]);
      }, 80);
    } catch {
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const handleStopRecording = async () => {
    try {
      if (durationInterval.current) { clearInterval(durationInterval.current); durationInterval.current = null; }
      if (meteringInterval.current) { clearInterval(meteringInterval.current); meteringInterval.current = null; }
      await recorder.stop();
      const uri = recorder.uri;
      setIsRecording(false);
      setWaveformData(Array.from({ length: 30 }, () => 0.2));
      if (uri) {
        setRecordingUri(uri);
        onRecordingComplete?.(uri);
      }
      onRecordingStop?.();
    } catch {
      setIsRecording(false);
    }
  };

  const handleDeleteRecording = () => {
    setRecordingUri(null);
    setDuration(0);
  };

  const handleSaveRecording = () => {
    if (recordingUri) onRecordingComplete?.(recordingUri);
  };

  return (
    <View className='rounded-xl p-5 items-center bg-muted' style={style}>
      {recordingUri && !isRecording ? (
        <View className='items-center w-full'>
          <AudioPlayer source={{ uri: recordingUri }} showControls showWaveform showTimer autoPlay={false} />
          <View className='flex-row items-center gap-4 mt-4'>
            <Button variant='outline' size='icon' onPress={handleDeleteRecording}>
              <Trash2 size={20} color={redColor} />
            </Button>
            <Button variant='default' onPress={handleSaveRecording}>
              <Download size={18} color={tokens.primaryForeground} />
              <Text style={{ color: tokens.primaryForeground, marginLeft: 8 }}>Save</Text>
            </Button>
          </View>
        </View>
      ) : (
        <>
          <View className='h-9 justify-center'>
            {isRecording && (
              <View className='flex-row items-center justify-center gap-1.5'>
                <Circle size={10} color={redColor} fill={redColor} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: redColor }}>Recording</Text>
              </View>
            )}
          </View>

          {showWaveform && (
            <View className='items-center mb-4 w-full'>
              <AudioWaveform
                data={waveformData}
                isPlaying={isRecording}
                height={50}
                barCount={30}
                activeColor={isRecording ? redColor : mutedColor}
                animated={isRecording}
              />
            </View>
          )}

          {showTimer && (
            <View className='flex-row items-center gap-1 mb-5'>
              <Text style={{ fontSize: 32, fontWeight: '300', color: textColor }}>{formatDuration(duration)}</Text>
              {maxDuration && (
                <Text style={{ fontSize: 18, fontWeight: '300', color: mutedColor }}>
                  / {formatDuration(maxDuration)}
                </Text>
              )}
            </View>
          )}

          <View className='items-center mb-3'>
            <Animated.View style={pulseStyle}>
              {isRecording ? (
                <Button variant='destructive' size='icon' onPress={handleStopRecording} style={{ width: 80, height: 80, borderRadius: 40 }}>
                  <Square size={28} color={tokens.destructiveForeground} fill={tokens.destructiveForeground} />
                </Button>
              ) : (
                <Button variant='default' size='icon' onPress={handleStartRecording} style={{ width: 80, height: 80, borderRadius: 40 }}>
                  <Mic size={28} color={tokens.primaryForeground} />
                </Button>
              )}
            </Animated.View>
          </View>
        </>
      )}
    </View>
  );
}
