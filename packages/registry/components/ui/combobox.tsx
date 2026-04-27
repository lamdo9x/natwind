import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

export interface ComboboxOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  emptyText?: string;
  style?: ViewStyle;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  label,
  error,
  disabled = false,
  clearable = false,
  emptyText = "No results found",
  style,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#9ca3af" : "#6b7280";
  const placeholderColor = isDark ? "#6b7280" : "#9ca3af";
  const textColor = isDark ? "#f3f4f6" : "#111827";

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  const filtered = useMemo(() => {
    if (!query) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setQuery("");
      setIsOpen(true);
    }
  }, [disabled]);

  const handleSelect = useCallback(
    (option: ComboboxOption) => {
      if (!option.disabled) {
        onValueChange?.(option.value);
        setIsOpen(false);
      }
    },
    [onValueChange]
  );

  const handleClear = useCallback(
    (e: any) => {
      e.stopPropagation();
      onValueChange?.("");
    },
    [onValueChange]
  );

  return (
    <>
      <View style={style}>
        {label && (
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </Text>
        )}

        <Pressable
          onPress={handleOpen}
          className={cn(
            "flex-row items-center h-12 px-4 rounded-xl border gap-2",
            "bg-gray-100 dark:bg-gray-800 border-transparent",
            error && "border-red-500 dark:border-red-400",
            disabled && "opacity-50"
          )}
        >
          <Text
            className="flex-1 text-base"
            style={{ color: selected ? textColor : placeholderColor }}
            numberOfLines={1}
          >
            {selected?.label ?? placeholder}
          </Text>

          {clearable && value ? (
            <Pressable onPress={handleClear} hitSlop={8}>
              <X size={16} color={iconColor} />
            </Pressable>
          ) : (
            <ChevronDown size={16} color={iconColor} />
          )}
        </Pressable>

        {error && (
          <Text className="text-xs text-red-500 dark:text-red-400 mt-1.5">
            {error}
          </Text>
        )}
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setIsOpen(false)}
        />
        <View className="absolute left-0 right-0 bottom-0 bg-white dark:bg-gray-900 rounded-t-2xl max-h-[60%]">
          <View className="px-4 pt-4 pb-2">
            <View className="flex-row items-center h-11 px-3 rounded-xl gap-2 bg-gray-100 dark:bg-gray-800">
              <Search size={14} color={iconColor} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={placeholderColor}
                autoFocus
                className="flex-1 text-sm"
                style={{ color: textColor }}
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery("")} hitSlop={6}>
                  <X size={14} color={iconColor} />
                </Pressable>
              )}
            </View>
          </View>

          {filtered.length === 0 ? (
            <View className="py-10 items-center">
              <Text className="text-sm text-gray-400 dark:text-gray-500">
                {emptyText}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.value}
              contentContainerStyle={{ paddingBottom: 32 }}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    disabled={item.disabled}
                    className={cn(
                      "flex-row items-center px-4 py-3.5",
                      item.disabled && "opacity-40"
                    )}
                  >
                    <View className="flex-1">
                      <Text
                        className={cn(
                          "text-sm",
                          isSelected
                            ? "text-blue-500 font-medium"
                            : "text-gray-900 dark:text-gray-100"
                        )}
                      >
                        {item.label}
                      </Text>
                      {item.description && (
                        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {item.description}
                        </Text>
                      )}
                    </View>
                    {isSelected && <Check size={16} color="#3b82f6" />}
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      </Modal>
    </>
  );
}
