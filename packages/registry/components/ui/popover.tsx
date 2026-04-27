import { cn } from "@/lib/utils";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface PopoverContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  triggerLayout: { x: number; y: number; width: number; height: number } | null;
  setTriggerLayout: (layout: { x: number; y: number; width: number; height: number }) => void;
}

const PopoverContext = createContext<PopoverContextType | null>(null);

function usePopoverContext() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover components must be used within <Popover>");
  return ctx;
}

export interface PopoverProps {
  children: React.ReactNode;
}

export function Popover({ children }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <PopoverContext.Provider value={{ isOpen, open, close, triggerLayout, setTriggerLayout }}>
      {children}
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function PopoverTrigger({ children, className, style }: PopoverTriggerProps) {
  const { open, setTriggerLayout } = usePopoverContext();
  const ref = useRef<View>(null);

  const handlePress = useCallback(() => {
    ref.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
      open();
    });
  }, [open, setTriggerLayout]);

  return (
    <Pressable ref={ref} onPress={handlePress} className={className} style={style}>
      {children}
    </Pressable>
  );
}

export interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  align?: "left" | "right" | "center";
  width?: number;
}

export function PopoverContent({
  children,
  className,
  style,
  align = "left",
  width = 220,
}: PopoverContentProps) {
  const { isOpen, close, triggerLayout } = usePopoverContext();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [contentHeight, setContentHeight] = useState(0);

  const position = (() => {
    if (!triggerLayout) return { top: 0, left: 0 };

    let top = triggerLayout.y + triggerLayout.height + 8;
    let left = triggerLayout.x;

    if (align === "right") {
      left = triggerLayout.x + triggerLayout.width - width;
    } else if (align === "center") {
      left = triggerLayout.x + triggerLayout.width / 2 - width / 2;
    }

    // flip up if not enough space below
    if (contentHeight > 0 && top + contentHeight > screenHeight - 40) {
      top = triggerLayout.y - contentHeight - 8;
    }

    // clamp horizontally
    left = Math.max(8, Math.min(left, screenWidth - width - 8));

    return { top, left };
  })();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={close}
      >
        <View
          className={cn(
            "absolute bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden",
            className
          )}
          style={[{ width, top: position.top, left: position.left }, style]}
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
          onStartShouldSetResponder={() => true}
        >
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

export interface PopoverHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function PopoverHeader({ children, className, style }: PopoverHeaderProps) {
  return (
    <View
      className={cn("px-4 py-3 border-b border-gray-100 dark:border-gray-800", className)}
      style={style}
    >
      {typeof children === "string" ? (
        <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

export interface PopoverBodyProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function PopoverBody({ children, className, style }: PopoverBodyProps) {
  return (
    <View className={cn("px-4 py-3", className)} style={style}>
      {children}
    </View>
  );
}

export interface PopoverFooterProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function PopoverFooter({ children, className, style }: PopoverFooterProps) {
  return (
    <View
      className={cn("px-4 py-3 border-t border-gray-100 dark:border-gray-800", className)}
      style={style}
    >
      {children}
    </View>
  );
}
