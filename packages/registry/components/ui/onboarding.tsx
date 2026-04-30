import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  ViewStyle,
  ViewToken,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface OnboardingStep {
  key: string;
  render: () => React.ReactNode;
}

export interface OnboardingProps {
  steps: OnboardingStep[];
  onDone: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  doneLabel?: string;
  skipLabel?: string;
  showSkip?: boolean;
  showDots?: boolean;
  nextButtonClassName?: string;
  containerClassName?: string;
  style?: ViewStyle;
}

export function Onboarding({
  steps,
  onDone,
  onSkip,
  nextLabel = "Next",
  doneLabel = "Get Started",
  skipLabel = "Skip",
  showSkip = true,
  showDots = true,
  nextButtonClassName,
  containerClassName,
  style,
}: OnboardingProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const isLast = activeIndex === steps.length - 1;

  const handleNext = useCallback(() => {
    if (isLast) {
      onDone();
    } else {
      const nextIndex = activeIndex + 1;
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }
  }, [isLast, activeIndex, onDone]);

  const handleSkip = useCallback(() => {
    onSkip?.();
    onDone();
  }, [onSkip, onDone]);

  return (
    <View
      className={cn("flex-1 bg-background", containerClassName)}
      style={style}
    >
      <FlatList
        ref={listRef}
        data={steps}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }} className="flex-1">
            {item.render()}
          </View>
        )}
      />

      <View className="px-6 pb-10">
        {showDots && (
          <View className="flex-row justify-center gap-1.5 mb-6">
            {steps.map((_, i) => (
              <View
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === activeIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-border"
                )}
              />
            ))}
          </View>
        )}

        <View className="flex-row items-center gap-3">
          {showSkip && !isLast ? (
            <Pressable
              onPress={handleSkip}
              className="flex-1 h-12 rounded-xl border border-border items-center justify-center"
            >
              <Text className="text-sm font-medium text-muted-foreground">
                {skipLabel}
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={handleNext}
            className={cn(
              "h-12 rounded-xl bg-primary items-center justify-center",
              showSkip && !isLast ? "flex-1" : "flex-1",
              nextButtonClassName
            )}
          >
            <Text className="text-sm font-semibold text-primary-foreground">
              {isLast ? doneLabel : nextLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
