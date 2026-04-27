import { Image } from 'expo-image';
import { Check, RotateCcw, Share2, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Share, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from './text';

export interface CameraPreviewProps {
  uri: string;
  style?: ViewStyle;
  showActions?: boolean;
  enableShare?: boolean;
  enableDelete?: boolean;
  onRetake?: () => void;
  onConfirm?: (uri: string) => void;
  onDelete?: (uri: string) => void;
  onShare?: (uri: string) => void;
}

export function CameraPreview({
  uri,
  style,
  showActions = true,
  enableShare = false,
  enableDelete = false,
  onRetake,
  onConfirm,
  onDelete,
  onShare,
}: CameraPreviewProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (onShare) { onShare(uri); return; }
    try {
      setIsSharing(true);
      await Share.share({ url: uri });
    } catch {}
    finally { setIsSharing(false); }
  };

  const handleDelete = () => { onDelete?.(uri); };
  const handleConfirm = () => { onConfirm?.(uri); };

  return (
    <View className='flex-1 bg-black' style={style}>
      <Image source={{ uri }} style={{ flex: 1 }} contentFit='contain' />

      {showActions && (
        <View className='absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-6 pb-12 pt-6 bg-black/50'>
          {onRetake && (
            <TouchableOpacity
              className='items-center gap-1'
              onPress={onRetake}
              hitSlop={8}
            >
              <View className='w-14 h-14 rounded-full bg-white/20 items-center justify-center'>
                <RotateCcw size={24} color='#ffffff' />
              </View>
              <Text style={{ color: '#ffffff', fontSize: 12 }}>Retake</Text>
            </TouchableOpacity>
          )}

          {onConfirm && (
            <TouchableOpacity
              className='items-center gap-1'
              onPress={handleConfirm}
              hitSlop={8}
            >
              <View className='w-16 h-16 rounded-full bg-white items-center justify-center'>
                <Check size={28} color='#000000' />
              </View>
              <Text style={{ color: '#ffffff', fontSize: 12 }}>Use Photo</Text>
            </TouchableOpacity>
          )}

          {enableShare && (
            <TouchableOpacity
              className='items-center gap-1'
              onPress={handleShare}
              disabled={isSharing}
              hitSlop={8}
            >
              <View className='w-14 h-14 rounded-full bg-white/20 items-center justify-center'>
                <Share2 size={22} color='#ffffff' />
              </View>
              <Text style={{ color: '#ffffff', fontSize: 12 }}>Share</Text>
            </TouchableOpacity>
          )}

          {enableDelete && (
            <TouchableOpacity
              className='items-center gap-1'
              onPress={handleDelete}
              hitSlop={8}
            >
              <View className='w-14 h-14 rounded-full bg-red-500/80 items-center justify-center'>
                <Trash2 size={22} color='#ffffff' />
              </View>
              <Text style={{ color: '#ffffff', fontSize: 12 }}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
