import { CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import { FlashlightOff, Flashlight, SwitchCamera, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Alert, Dimensions, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from './text';

export interface CapturedPhoto {
  uri: string;
  width: number;
  height: number;
  base64?: string;
  exif?: Record<string, any>;
}

export interface CameraProps {
  style?: ViewStyle;
  onCapture?: (photo: CapturedPhoto) => void;
  onClose?: () => void;
  showControls?: boolean;
  enableFlash?: boolean;
  enableFlip?: boolean;
  quality?: number;
  base64?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export function CameraComponent({
  style,
  onCapture,
  onClose,
  showControls = true,
  enableFlash = true,
  enableFlip = true,
  quality = 0.8,
  base64 = false,
}: CameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View className='flex-1 items-center justify-center bg-black' style={style} />;
  }

  if (!permission.granted) {
    return (
      <View className='flex-1 items-center justify-center bg-background gap-4' style={style}>
        <Text className='text-foreground text-base text-center px-8'>Camera permission is required to use this feature.</Text>
        <TouchableOpacity
          className='bg-primary rounded-full px-6 py-3'
          onPress={requestPermission}
        >
          <Text className='text-primary-foreground font-semibold'>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality, base64, exif: true });
      if (photo) {
        onCapture?.({
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
          base64: photo.base64,
          exif: photo.exif as Record<string, any>,
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo.');
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleFacing = () => setFacing((f) => (f === 'back' ? 'front' : 'back'));
  const toggleFlash = () => setFlash((f) => (f === 'off' ? 'on' : 'off'));

  return (
    <View className='flex-1 bg-black overflow-hidden' style={style}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        flash={flash}
      />

      {showControls && (
        <>
          <View className='absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pt-14 pb-4'>
            {onClose && (
              <TouchableOpacity
                className='w-10 h-10 rounded-full bg-black/40 items-center justify-center'
                onPress={onClose}
                hitSlop={8}
              >
                <X size={22} color='#ffffff' />
              </TouchableOpacity>
            )}
            <View className='flex-1' />
            {enableFlash && (
              <TouchableOpacity
                className='w-10 h-10 rounded-full bg-black/40 items-center justify-center'
                onPress={toggleFlash}
                hitSlop={8}
              >
                {flash === 'on'
                  ? <Flashlight size={20} color='#facc15' />
                  : <FlashlightOff size={20} color='#ffffff' />
                }
              </TouchableOpacity>
            )}
          </View>

          <View className='absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-8 pb-12 pt-6 bg-black/40'>
            {enableFlip && (
              <TouchableOpacity
                className='w-12 h-12 rounded-full bg-white/20 items-center justify-center'
                onPress={toggleFacing}
                hitSlop={8}
              >
                <SwitchCamera size={22} color='#ffffff' />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className='w-20 h-20 rounded-full border-4 border-white items-center justify-center'
              style={{ backgroundColor: isCapturing ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}
              onPress={handleCapture}
              disabled={isCapturing}
              activeOpacity={0.7}
            >
              <View className='w-16 h-16 rounded-full bg-white' />
            </TouchableOpacity>

            <View className='w-12 h-12' />
          </View>
        </>
      )}
    </View>
  );
}
