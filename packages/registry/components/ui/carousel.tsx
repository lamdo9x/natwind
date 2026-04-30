import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  View,
  ViewStyle,
  ViewToken,
} from "react-native";

export interface CarouselProps {
  data: React.ReactNode[];
  itemWidth?: number;
  showDots?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  gap?: number;
  dotClassName?: string;
  activeDotClassName?: string;
  className?: string;
  style?: ViewStyle;
}

export function Carousel({
  data,
  itemWidth,
  showDots = true,
  showArrows = false,
  loop = false,
  gap = 0,
  dotClassName,
  activeDotClassName,
  className,
  style,
}: CarouselProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const width = itemWidth ?? containerWidth;
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, data.length - 1));
      listRef.current?.scrollToIndex({ index: clamped, animated: true });
      setActiveIndex(clamped);
    },
    [data.length]
  );

  const prev = useCallback(() => {
    const next = loop && activeIndex === 0 ? data.length - 1 : activeIndex - 1;
    scrollTo(next);
  }, [activeIndex, data.length, loop, scrollTo]);

  const next = useCallback(() => {
    const nextIndex = loop && activeIndex === data.length - 1 ? 0 : activeIndex + 1;
    scrollTo(nextIndex);
  }, [activeIndex, data.length, loop, scrollTo]);

  return (
    <View className={cn("", className)} style={style} onLayout={onLayout}>
      <View>
        {width > 0 && <FlatList
          ref={listRef}
          data={data}
          horizontal
          pagingEnabled={gap === 0}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          snapToInterval={gap > 0 ? width + gap : undefined}
          decelerationRate={gap > 0 ? "fast" : undefined}
          ItemSeparatorComponent={gap > 0 ? () => <View style={{ width: gap }} /> : undefined}
          renderItem={({ item }) => (
            <View style={{ width }}>{item}</View>
          )}
        />}

        {showArrows && (
          <>
            <Pressable
              onPress={prev}
              disabled={!loop && activeIndex === 0}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 items-center justify-center shadow",
                !loop && activeIndex === 0 && "opacity-30"
              )}
            >
              <View className="w-2 h-2 border-l-2 border-b-2 border-foreground rotate-45 ml-1" />
            </Pressable>
            <Pressable
              onPress={next}
              disabled={!loop && activeIndex === data.length - 1}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 items-center justify-center shadow",
                !loop && activeIndex === data.length - 1 && "opacity-30"
              )}
            >
              <View className="w-2 h-2 border-r-2 border-t-2 border-foreground rotate-45 mr-1" />
            </Pressable>
          </>
        )}
      </View>

      {showDots && data.length > 1 && (
        <View className="flex-row justify-center gap-1.5 mt-3">
          {data.map((_, i) => (
            <Pressable key={i} onPress={() => scrollTo(i)} hitSlop={6}>
              <View
                className={cn(
                  "rounded-full transition-all",
                  i === activeIndex
                    ? cn("w-5 h-2 bg-primary", activeDotClassName)
                    : cn("w-2 h-2 bg-border", dotClassName)
                )}
              />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
