import { Image } from 'expo-image';
import { Download, Share2, X } from 'lucide-react-native';
import { memo, useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Text } from './text';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface GalleryItem {
  id: string;
  uri: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

export interface GalleryProps {
  items: GalleryItem[];
  columns?: number;
  spacing?: number;
  borderRadius?: number;
  aspectRatio?: number;
  showPages?: boolean;
  showTitles?: boolean;
  showDescriptions?: boolean;
  enableFullscreen?: boolean;
  enableZoom?: boolean;
  enableDownload?: boolean;
  enableShare?: boolean;
  onItemPress?: (item: GalleryItem, index: number) => void;
  onDownload?: (item: GalleryItem) => void;
  onShare?: (item: GalleryItem) => void;
  renderCustomOverlay?: (item: GalleryItem, index: number) => React.ReactNode;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface ZoomableImageProps {
  item: GalleryItem;
  enableZoom: boolean;
  onSetCanSwipe: (canSwipe: boolean) => void;
}

const ZoomableImage = memo(({ item, enableZoom, onSetCanSwipe }: ZoomableImageProps) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);

  const resetZoom = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
    translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    savedScale.value = 1;
    runOnJS(onSetCanSwipe)(true);
  }, [scale, translateX, translateY, savedScale, onSetCanSwipe]);

  const pinchGesture = Gesture.Pinch()
    .enabled(enableZoom)
    .onUpdate((e) => {
      scale.value = Math.max(1, Math.min(4, savedScale.value * e.scale));
    })
    .onEnd(() => {
      if (scale.value <= 1) resetZoom();
      else { savedScale.value = scale.value; runOnJS(onSetCanSwipe)(false); }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) resetZoom();
      else { scale.value = withSpring(2); savedScale.value = 2; runOnJS(onSetCanSwipe)(false); }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(pinchGesture, doubleTap)}>
      <AnimatedImage
        source={{ uri: item.uri }}
        style={[{ width: screenWidth, height: screenHeight }, animatedStyle]}
        contentFit='contain'
      />
    </GestureDetector>
  );
});

export function Gallery({
  items,
  columns = 3,
  spacing = 2,
  borderRadius = 8,
  aspectRatio = 1,
  showPages = true,
  showTitles = false,
  showDescriptions = false,
  enableFullscreen = true,
  enableZoom = true,
  enableDownload = false,
  enableShare = false,
  onItemPress,
  onDownload,
  onShare,
  renderCustomOverlay,
}: GalleryProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flatListScrollEnabled, setFlatListScrollEnabled] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const itemSize = (screenWidth - spacing * (columns + 1)) / columns;

  const openFullscreen = useCallback((index: number) => {
    if (!enableFullscreen) return;
    setSelectedIndex(index);
    setIsModalVisible(true);
    setFlatListScrollEnabled(true);
  }, [enableFullscreen]);

  const closeFullscreen = () => setIsModalVisible(false);
  const getCurrentItem = () => items[selectedIndex] || items[0];

  const handleShare = async (item: GalleryItem) => {
    if (onShare) { onShare(item); return; }
    try { await Share.share({ url: item.uri, title: item.title }); } catch {}
  };

  const renderGridItem = ({ item, index }: { item: GalleryItem; index: number }) => (
    <TouchableOpacity
      style={{ width: itemSize, height: itemSize * aspectRatio, margin: spacing / 2 }}
      onPress={() => { onItemPress?.(item, index); openFullscreen(index); }}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.thumbnail || item.uri }}
        style={{ width: '100%', height: '100%', borderRadius }}
        contentFit='cover'
      />
      {showTitles && item.title && (
        <View
          className='absolute bottom-0 left-0 right-0 bg-black/50 p-1'
          style={{ borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius }}
        >
          <Text className='text-white text-xs font-medium' numberOfLines={1}>{item.title}</Text>
        </View>
      )}
      {renderCustomOverlay?.(item, index)}
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={items}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        scrollEnabled={true}
        contentContainerStyle={{ padding: spacing / 2 }}
      />

      <Modal visible={isModalVisible} animationType='fade' statusBarTranslucent onRequestClose={closeFullscreen}>
        <GestureHandlerRootView className='flex-1 bg-black'>
          {/* Header */}
          <View className='absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pt-14 pb-4 bg-black/40'>
            {showPages && (
              <Text className='text-white text-base font-semibold'>{selectedIndex + 1} / {items.length}</Text>
            )}
            <TouchableOpacity
              className='w-9 h-9 items-center justify-center'
              onPress={closeFullscreen}
              hitSlop={16}
            >
              <X size={24} color='#ffffff' />
            </TouchableOpacity>
          </View>

          {/* Image pager */}
          <FlatList
            ref={flatListRef}
            data={items}
            horizontal
            pagingEnabled
            scrollEnabled={flatListScrollEnabled}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedIndex}
            getItemLayout={(_, index) => ({ length: screenWidth, offset: screenWidth * index, index })}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setSelectedIndex(index);
            }}
            renderItem={({ item }) => (
              <ZoomableImage item={item} enableZoom={enableZoom} onSetCanSwipe={setFlatListScrollEnabled} />
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Footer */}
          {(showTitles || showDescriptions || enableShare || enableDownload) && (
            <View className='absolute bottom-0 left-0 right-0 px-4 pt-4 pb-8 bg-black/70'>
              {showTitles && getCurrentItem().title && (
                <Text className='text-white text-base font-semibold mb-1'>{getCurrentItem().title}</Text>
              )}
              {showDescriptions && getCurrentItem().description && (
                <Text className='text-white/80 text-sm mb-3'>{getCurrentItem().description}</Text>
              )}
              <View className='flex-row gap-5'>
                {enableShare && (
                  <TouchableOpacity onPress={() => handleShare(getCurrentItem())} hitSlop={8}>
                    <Share2 size={22} color='#ffffff' />
                  </TouchableOpacity>
                )}
                {enableDownload && onDownload && (
                  <TouchableOpacity onPress={() => onDownload(getCurrentItem())} hitSlop={8}>
                    <Download size={22} color='#ffffff' />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}
