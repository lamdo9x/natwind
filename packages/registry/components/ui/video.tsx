import { useColor } from '@/hooks/useColor';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Maximize2, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Progress } from './progress';
import { Text } from './text';

export interface VideoPlayerProps {
  uri: string;
  style?: ViewStyle;
  posterUri?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  showTimer?: boolean;
  height?: number;
  onPlaybackEnd?: () => void;
  onError?: (error: string) => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function VideoPlayer({
  uri,
  style,
  posterUri,
  autoPlay = false,
  loop = false,
  muted: initialMuted = false,
  showControls = true,
  showProgress = true,
  showTimer = true,
  height = 220,
  onPlaybackEnd,
  onError,
}: VideoPlayerProps) {
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  const textColor = useColor('text');

  const player = useVideoPlayer(uri, (p) => {
    p.loop = loop;
    p.muted = initialMuted;
    if (autoPlay) p.play();
  });

  const statusEvent = useEvent(player, 'statusChange');
  const status = statusEvent?.status ?? player.status;

  useEffect(() => {
    const interval = setInterval(() => {
      if (player.status === 'readyToPlay') {
        setPosition(player.currentTime || 0);
        setDuration(player.duration || 0);
        if (player.currentTime >= player.duration && player.duration > 0) {
          onPlaybackEnd?.();
        }
      }
    }, 250);
    return () => clearInterval(interval);
  }, [player, onPlaybackEnd]);

  useEffect(() => {
    if (status === 'error') onError?.('Video playback error');
  }, [status, onError]);

  const togglePlayPause = useCallback(() => {
    if (player.playing) player.pause();
    else player.play();
  }, [player]);

  const toggleMute = useCallback(() => {
    player.muted = !isMuted;
    setIsMuted((m) => !m);
  }, [player, isMuted]);

  const handleRestart = useCallback(() => {
    player.seekBy(-player.currentTime);
    player.play();
  }, [player]);

  const toggleControls = () => setControlsVisible((v) => !v);

  const progress = duration > 0 ? (position / duration) * 100 : 0;
  const isPlaying = player.playing;

  return (
    <View className='bg-black overflow-hidden rounded-xl' style={[{ height }, style]}>
      <VideoView
        player={player}
        style={{ flex: 1 }}
        contentFit='contain'
        nativeControls={false}
        allowsFullscreen
      />

      {showControls && (
        <TouchableOpacity
          activeOpacity={1}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={toggleControls}
        >
          {controlsVisible && (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              {/* Top row */}
              <View className='flex-row justify-end p-3'>
                <TouchableOpacity
                  className='w-9 h-9 rounded-full bg-black/50 items-center justify-center'
                  onPress={toggleMute}
                  hitSlop={8}
                >
                  {isMuted
                    ? <VolumeX size={18} color='#ffffff' />
                    : <Volume2 size={18} color='#ffffff' />
                  }
                </TouchableOpacity>
              </View>

              {/* Center controls */}
              <View className='flex-row items-center justify-center gap-6'>
                <TouchableOpacity
                  className='w-10 h-10 rounded-full bg-black/50 items-center justify-center'
                  onPress={handleRestart}
                  hitSlop={8}
                >
                  <RotateCcw size={18} color='#ffffff' />
                </TouchableOpacity>

                <TouchableOpacity
                  className='w-14 h-14 rounded-full bg-white/20 items-center justify-center'
                  onPress={togglePlayPause}
                  activeOpacity={0.7}
                >
                  {isPlaying
                    ? <Pause size={26} color='#ffffff' fill='#ffffff' />
                    : <Play size={26} color='#ffffff' fill='#ffffff' />
                  }
                </TouchableOpacity>

                <View className='w-10 h-10' />
              </View>

              {/* Bottom bar */}
              <View className='px-4 pb-4 gap-2'>
                {showProgress && (
                  <Progress value={progress} style={{ height: 3 }} />
                )}
                {showTimer && (
                  <View className='flex-row justify-between'>
                    <Text style={{ color: '#ffffff', fontSize: 12 }}>{formatTime(position)}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{formatTime(duration)}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
