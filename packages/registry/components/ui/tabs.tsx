import { cn } from "@/lib/utils";
import { createContext, useContext, useState } from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  style,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;

  const setActiveTab = (tab: string) => {
    setInternalValue(tab);
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View className={cn("w-full", className)} style={style}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function TabsList({ children, className, style }: TabsListProps) {
  return (
    <View
      className={cn(
        "flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1.5",
        className
      )}
      style={style}
    >
      {children}
    </View>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled = false,
  className,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <Pressable
      onPress={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        "flex-1 h-8 rounded-lg items-center justify-center",
        isActive && "bg-white dark:bg-gray-700 shadow-sm",
        disabled && "opacity-50",
        className
      )}
    >
      <Text
        className={cn(
          "text-sm font-medium",
          isActive
            ? "text-gray-900 dark:text-gray-100"
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function TabsContent({
  value,
  children,
  className,
  style,
}: TabsContentProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;

  return (
    <View className={cn("mt-4", className)} style={style}>
      {children}
    </View>
  );
}
