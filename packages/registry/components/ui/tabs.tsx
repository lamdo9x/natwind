import { cn } from "@/lib/utils";
import { createContext, useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle, useColorScheme } from "react-native";

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
  const isDark = useColorScheme() === "dark";

  return (
    <Pressable
      onPress={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      style={[
        triggerStyles.base,
        isActive && {
          backgroundColor: isDark ? "#374151" : "#ffffff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        disabled && { opacity: 0.5 },
      ]}
    >
      <Text
        style={[
          triggerStyles.text,
          {
            color: isActive
              ? isDark ? "#f3f4f6" : "#111827"
              : isDark ? "#9ca3af" : "#6b7280",
          },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const triggerStyles = StyleSheet.create({
  base: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});

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
