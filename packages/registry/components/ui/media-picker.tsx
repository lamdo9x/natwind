import { useColor } from '@/hooks/useColor';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { LucideProps, Video, X } from 'lucide-react-native';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  TouchableOpacity,
  View as RNView,
  ViewStyle,
} from 'react-native';
import { Button, ButtonSize, ButtonVariant } from './button';
import { Text } from './text';
import { View } from './view';

export type MediaType = 'image' | 'video' | 'all';
export type MediaQuality = 'low' | 'medium' | 'high';

export interface MediaAsset {
  id: string;
  uri: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  duration?: number;
  filename?: string;
  fileSize?: number;
}

export interface MediaPickerProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: React.ComponentType<LucideProps>;
  disabled?: boolean;
  mediaType?: MediaType;
  multiple?: boolean;
  maxSelection?: number;
  quality?: MediaQuality;
  buttonText?: string;
  gallery?: boolean;
  showPreview?: boolean;
  previewSize?: number;
  selectedAssets?: MediaAsset[];
  onSelectionChange?: (assets: MediaAsset[]) => void;
  onError?: (error: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const GALLERY_COLS = 3;
const GALLERY_ITEM_SIZE = screenWidth / GALLERY_COLS - 2;

const arraysEqual = (a: MediaAsset[], b: MediaAsset[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((item, i) => item.id === b[i].id && item.uri === b[i].uri);
};

export const MediaPicker = forwardRef<RNView, MediaPickerProps>(
  (
    {
      children,
      mediaType = 'all',
      multiple = false,
      gallery = false,
      maxSelection = 10,
      quality = 'high',
      onSelectionChange,
      onError,
      buttonText,
      showPreview = true,
      previewSize = 80,
      style,
      variant,
      size,
      icon,
      disabled = false,
      selectedAssets = [],
    },
    ref
  ) => {
    const [assets, setAssets] = useState<MediaAsset[]>(selectedAssets);
    const [isGalleryVisible, setIsGalleryVisible] = useState(false);
    const [galleryAssets, setGalleryAssets] = useState<MediaLibrary.Asset[]>([]);
    const prevSelectedAssetsRef = useRef<MediaAsset[]>(selectedAssets);

    const textColor = useColor('text');
    const borderColor = useColor('border');
    const backgroundColor = useColor('background');
    const primaryColor = useColor('primary');

    useEffect(() => {
      if (!arraysEqual(prevSelectedAssetsRef.current, selectedAssets)) {
        prevSelectedAssetsRef.current = selectedAssets;
        setAssets(selectedAssets);
      }
    }, [selectedAssets]);

    const getQualityValue = (): number => {
      switch (quality) {
        case 'low': return 0.3;
        case 'medium': return 0.6;
        default: return 1.0;
      }
    };

    const getMediaTypeForPicker = (): ImagePicker.MediaTypeOptions => {
      switch (mediaType) {
        case 'image': return ImagePicker.MediaTypeOptions.Images;
        case 'video': return ImagePicker.MediaTypeOptions.Videos;
        default: return ImagePicker.MediaTypeOptions.All;
      }
    };

    const pickFromGallery = async () => {
      if (gallery) {
        await loadGalleryAssets();
        setIsGalleryVisible(true);
        return;
      }
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: getMediaTypeForPicker(),
          allowsMultipleSelection: multiple,
          quality: getQualityValue(),
          exif: false,
        });
        if (result.canceled) return;
        const newAssets: MediaAsset[] = result.assets.map((a) => ({
          id: a.assetId || a.uri,
          uri: a.uri,
          type: a.type === 'video' ? 'video' : 'image',
          width: a.width,
          height: a.height,
          duration: a.duration ?? undefined,
          filename: a.fileName ?? undefined,
          fileSize: a.fileSize,
        }));
        const limited = multiple ? newAssets.slice(0, maxSelection) : newAssets.slice(0, 1);
        const updated = multiple ? [...assets, ...limited].slice(0, maxSelection) : limited;
        setAssets(updated);
        onSelectionChange?.(updated);
      } catch {
        onError?.('Failed to pick media');
      }
    };

    const loadGalleryAssets = async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') { onError?.('Media library permission denied'); return; }
        const result = await MediaLibrary.getAssetsAsync({
          mediaType: mediaType === 'all'
            ? [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video]
            : mediaType === 'image'
            ? [MediaLibrary.MediaType.photo]
            : [MediaLibrary.MediaType.video],
          first: 100,
          sortBy: MediaLibrary.SortBy.creationTime,
        });
        setGalleryAssets(result.assets);
      } catch {
        onError?.('Failed to load gallery');
      }
    };

    const handleToggleAsset = (galleryAsset: MediaLibrary.Asset) => {
      const isSelected = assets.some((a) => a.id === galleryAsset.id);
      let updated: MediaAsset[];
      if (isSelected) {
        updated = assets.filter((a) => a.id !== galleryAsset.id);
      } else {
        if (!multiple && assets.length >= 1) return;
        if (multiple && assets.length >= maxSelection) return;
        const newAsset: MediaAsset = {
          id: galleryAsset.id,
          uri: galleryAsset.uri,
          type: galleryAsset.mediaType === MediaLibrary.MediaType.video ? 'video' : 'image',
          width: galleryAsset.width,
          height: galleryAsset.height,
          duration: galleryAsset.duration,
          filename: galleryAsset.filename,
        };
        updated = [...assets, newAsset];
      }
      setAssets(updated);
      onSelectionChange?.(updated);
    };

    const removeAsset = (id: string) => {
      const updated = assets.filter((a) => a.id !== id);
      setAssets(updated);
      onSelectionChange?.(updated);
    };

    const renderGalleryItem = ({ item }: { item: MediaLibrary.Asset }) => {
      const isSelected = assets.some((a) => a.id === item.id);
      const selectedIndex = assets.findIndex((a) => a.id === item.id);
      return (
        <TouchableOpacity
          style={[
            { width: GALLERY_ITEM_SIZE, height: GALLERY_ITEM_SIZE, margin: 0.5, overflow: 'hidden' },
            isSelected && { borderWidth: 2, borderColor: primaryColor },
          ]}
          onPress={() => handleToggleAsset(item)}
          activeOpacity={0.8}
        >
          <ExpoImage source={{ uri: item.uri }} style={{ width: '100%', height: '100%' }} contentFit='cover' />
          {item.mediaType === MediaLibrary.MediaType.video && (
            <RNView style={{ position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: 2 }}>
              <Video size={16} color='#ffffff' />
            </RNView>
          )}
          {isSelected && (
            <RNView style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: primaryColor, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600' }}>{selectedIndex + 1}</Text>
            </RNView>
          )}
        </TouchableOpacity>
      );
    };

    return (
      <RNView ref={ref} style={style}>
        {children ? (
          <TouchableOpacity onPress={pickFromGallery} disabled={disabled}>
            {children}
          </TouchableOpacity>
        ) : (
          <Button onPress={pickFromGallery} disabled={disabled} variant={variant} size={size} icon={icon}>
            {buttonText || `Select ${mediaType === 'all' ? 'Media' : mediaType === 'image' ? 'Images' : 'Videos'}`}
          </Button>
        )}

        {showPreview && assets.length > 0 && (
          <View className='flex-row flex-wrap gap-2 mt-3'>
            {assets.map((asset) => (
              <RNView key={asset.id} style={{ width: previewSize, height: previewSize, borderRadius: 8, overflow: 'hidden' }}>
                <ExpoImage source={{ uri: asset.uri }} style={{ width: '100%', height: '100%' }} contentFit='cover' />
                {asset.type === 'video' && (
                  <RNView style={{ position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: 2 }}>
                    <Video size={14} color='#ffffff' />
                  </RNView>
                )}
                <TouchableOpacity
                  style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => removeAsset(asset.id)}
                >
                  <X size={12} color='#ffffff' />
                </TouchableOpacity>
              </RNView>
            ))}
          </View>
        )}

        {gallery && (
          <Modal visible={isGalleryVisible} animationType='slide' onRequestClose={() => setIsGalleryVisible(false)}>
            <RNView style={{ flex: 1, backgroundColor }}>
              <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 56, borderBottomWidth: 1, borderColor }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: textColor }}>
                  Select {mediaType === 'all' ? 'Media' : mediaType === 'image' ? 'Photos' : 'Videos'}
                </Text>
                <RNView style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {multiple && assets.length > 0 && (
                    <Button size='sm' onPress={() => setIsGalleryVisible(false)} style={{ marginRight: 8 }}>
                      Done ({assets.length})
                    </Button>
                  )}
                  <TouchableOpacity onPress={() => setIsGalleryVisible(false)} hitSlop={8}>
                    <X size={24} color={textColor} />
                  </TouchableOpacity>
                </RNView>
              </RNView>
              <FlatList
                data={galleryAssets}
                renderItem={renderGalleryItem}
                keyExtractor={(item) => item.id}
                numColumns={GALLERY_COLS}
                contentContainerStyle={{ gap: 1 }}
              />
            </RNView>
          </Modal>
        )}
      </RNView>
    );
  }
);

MediaPicker.displayName = 'MediaPicker';
