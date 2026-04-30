import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react-native";
import { useTheme } from "../../theme/theme-provider";
import { createContext, useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type AccordionContextType = {
  type: "single" | "multiple";
  collapsible: boolean;
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
};

const AccordionContext = createContext<AccordionContextType | null>(null);

type AccordionItemContextType = {
  isOpen: boolean;
  toggle: () => void;
};

const AccordionItemContext = createContext<AccordionItemContextType | null>(null);

interface AccordionProps {
  type: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function Accordion({
  type,
  collapsible = false,
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
  style,
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue ?? (type === "multiple" ? [] : "")
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (newValue: string | string[]) => {
    if (controlledValue === undefined) setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <AccordionContext.Provider value={{ type, collapsible, value, onValueChange: handleChange }}>
      <View className={cn("w-full", className)} style={style}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function AccordionItem({ value, children, className, style }: AccordionItemProps) {
  const ctx = useContext(AccordionContext)!;

  const isOpen = Array.isArray(ctx.value)
    ? ctx.value.includes(value)
    : ctx.value === value;

  const toggle = () => {
    if (ctx.type === "single") {
      ctx.onValueChange(isOpen && ctx.collapsible ? "" : value);
    } else {
      const current = Array.isArray(ctx.value) ? ctx.value : [];
      ctx.onValueChange(isOpen ? current.filter((v) => v !== value) : [...current, value]);
    }
  };

  return (
    <AccordionItemContext.Provider value={{ isOpen, toggle }}>
      <View
        className={cn("border-b border-border", className)}
        style={style}
      >
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const ctx = useContext(AccordionItemContext)!;
  const tokens = useTheme();
  const rotation = useSharedValue(ctx.isOpen ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(ctx.isOpen ? 180 : 0, { duration: 200 });
  }, [ctx.isOpen]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <TouchableOpacity
      className={cn("flex-row items-center justify-between py-4", className)}
      onPress={ctx.toggle}
      activeOpacity={0.7}
    >
      <Text className="text-sm font-medium text-foreground flex-1 mr-2">
        {children}
      </Text>
      <Animated.View style={chevronStyle}>
        <ChevronDown size={16} color={tokens.mutedForeground} />
      </Animated.View>
    </TouchableOpacity>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const ctx = useContext(AccordionItemContext)!;

  if (!ctx.isOpen) return null;

  return (
    <View className={cn("pb-4", className)}>
      {children}
    </View>
  );
}
