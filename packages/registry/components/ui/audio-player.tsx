import { useTheme } from '../../theme/theme-provider';
import { AudioSource, useAudioPlayer } from 'expo-audio';
import { Pause, Play, RotateCcw, Square } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { AudioWaveform } from './audio-waveform';
import { Button } from './button';
import { Progress } from './progress';
import { Text } from './text';

export interface AudioPlayerProps {
  source: AudioSource;
  style?: ViewStyle;
  showControls?: boolean;
  showWaveform?: boolean;
  showTimer?: boolean;
  showProgressBar?: boolean;
  autoPlay?: boolean;
  onPlaybackStatusUpdate?: (status: any) => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayer({
  source,
  style,
  showControls = true,
  showWaveform = true,
  showTimer = true,
  showProgressBar = true,
  autoPlay = false,
  onPlaybackStatusUpdate,
}: AudioPlayerProps) {
  const player = useAudioPlayer(source);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const [waveformData] = useState<number[]>(
    Array.from({ length: 60 }, (_, i) => {
      const base1 = Math.sin((i / 60) * Math.PI * 6) * 0.4 + 0.5;
      const base2 = Math.sin((i / 60) * Math.PI * 2.5) * 0.3 + 0.4;
      const noise = (Math.random() - 0.5) * 0.25;
      const peak = Math.random() < 0.15 ? Math.random() * 0.4 : 0;
      return Math.max(0.15, Math.min(0.95, (base1 + base2) / 2 + noise + peak));
    })
  );

  const tokens = useTheme();
  const textColor = tokens.foreground;
  const mutedColor = tokens.mutedForeground;
  const primaryColor = tokens.primary;

  useEffect(() => {
    if (autoPlay && player.isLoaded && !player.playing) {
      player.play();
    }
  }, [autoPlay, player.isLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player.isLoaded && !isSeeking) {
        const currentTime = player.currentTime || 0;
        const totalDuration = player.duration || 0;
        setDuration(totalDuration);
        setPosition(currentTime);
        if (currentTime >= totalDuration && totalDuration > 0) {
          player.seekTo(0);
          player.pause();
        }
        onPlaybackStatusUpdate?.({
          isLoaded: player.isLoaded,
          playing: player.playing,
          duration: totalDuration,
          position: currentTime,
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [player, onPlaybackStatusUpdate, isSeeking]);

  const handlePlayPause = () => {
    if (player.playing) player.pause();
    else player.play();
  };

  const handleStop = () => {
    player.pause();
    player.seekTo(0);
    setPosition(0);
  };

  const handleRestart = () => {
    player.seekTo(0);
    player.play();
  };

  const handleSeek = useCallback((seekPosition: number) => {
    if (duration > 0) {
      const newTime = (seekPosition / 100) * duration;
      player.seekTo(newTime);
      setPosition(newTime);
    }
  }, [player, duration]);

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View className='rounded-xl p-4 gap-3 bg-muted' style={style}>
      {showWaveform && (
        <View className='py-1'>
          <AudioWaveform
            data={waveformData}
            isPlaying={player.playing}
            progress={progress}
            showProgress={true}
            interactive={true}
            onSeek={handleSeek}
            onSeekStart={() => setIsSeeking(true)}
            onSeekEnd={() => setIsSeeking(false)}
            height={60}
            activeColor={primaryColor}
          />
        </View>
      )}

      {showTimer && (
        <View className='flex-row justify-center items-center'>
          <Text style={{ fontSize: 14, fontWeight: '500', color: textColor }}>
            {formatTime(position)}
          </Text>
          <Text style={{ fontSize: 14, color: mutedColor }}> / </Text>
          <Text style={{ fontSize: 14, fontWeight: '500', color: mutedColor }}>
            {formatTime(duration)}
          </Text>
        </View>
      )}

      {showProgressBar && !showWaveform && (
        <View className='px-1'>
          <Progress value={progress} style={{ height: 4 }} />
        </View>
      )}

      {showControls && (
        <View className='flex-row items-center justify-center gap-2'>
          <Button variant='ghost' size='icon' onPress={handleRestart}>
            <RotateCcw size={18} color={textColor} />
          </Button>
          <Button variant='default' size='icon' onPress={handlePlayPause} style={{ width: 56, height: 56, borderRadius: 28 }}>
            {player.playing
              ? <Pause size={22} color={tokens.primaryForeground} />
              : <Play size={22} color={tokens.primaryForeground} />
            }
          </Button>
          <Button variant='ghost' size='icon' onPress={handleStop}>
            <Square size={18} color={textColor} />
          </Button>
        </View>
      )}
    </View>
  );
}
