import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface PickerOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface PickerSection {
  title?: string;
  options: PickerOption[];
}

export interface PickerProps {
  options?: PickerOption[];
  sections?: PickerSection[];
  value?: string;
  values?: string[];
  onValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  modalTitle?: string;
  style?: ViewStyle;
}

export function Picker({
  options = [],
  sections = [],
  value,
  values = [],
  onValueChange,
  onValuesChange,
  multiple = false,
  placeholder = "Select an option...",
  label,
  error,
  disabled = false,
  searchable = false,
  searchPlaceholder = "Search...",
  modalTitle = "Select",
  style,
}: PickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#9ca3af" : "#6b7280";
  const placeholderColor = isDark ? "#6b7280" : "#9ca3af";
  const textColor = isDark ? "#f3f4f6" : "#111827";

  const allOptions = useMemo(() => {
    if (sections.length > 0) {
      return sections.flatMap((s) => s.options);
    }
    return options;
  }, [options, sections]);

  const flatSections: PickerSection[] = useMemo(() => {
    if (sections.length > 0) return sections;
    return [{ options }];
  }, [options, sections]);

  const filteredSections = useMemo(() => {
    if (!searchQuery) return flatSections;
    return flatSections
      .map((s) => ({
        ...s,
        options: s.options.filter((o) =>
          o.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((s) => s.options.length > 0);
  }, [flatSections, searchQuery]);

  const displayValue = useMemo(() => {
    if (multiple) {
      if (values.length === 0) return "";
      return allOptions
        .filter((o) => values.includes(o.value))
        .map((o) => o.label)
        .join(", ");
    }
    return allOptions.find((o) => o.value === value)?.label ?? "";
  }, [multiple, value, values, allOptions]);

  const isSelected = useCallback(
    (optionValue: string) => {
      if (multiple) return values.includes(optionValue);
      return value === optionValue;
    },
    [multiple, value, values]
  );

  const handleSelect = useCallback(
    (optionValue: string) => {
      if (multiple) {
        const next = values.includes(optionValue)
          ? values.filter((v) => v !== optionValue)
          : [...values, optionValue];
        onValuesChange?.(next);
      } else {
        onValueChange?.(optionValue);
        setIsOpen(false);
      }
    },
    [multiple, value, values, onValueChange, onValuesChange]
  );

  type FlatItem =
    | { type: "section-header"; title: string; key: string }
    | { type: "option"; option: PickerOption; key: string };

  const flatData: FlatItem[] = useMemo(() => {
    const items: FlatItem[] = [];
    filteredSections.forEach((section, si) => {
      if (section.title) {
        items.push({ type: "section-header", title: section.title, key: `header-${si}` });
      }
      section.options.forEach((opt) => {
        items.push({ type: "option", option: opt, key: opt.value });
      });
    });
    return items;
  }, [filteredSections]);

  return (
    <>
      <View style={style}>
        {label && (
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </Text>
        )}

        <Pressable
          onPress={() => !disabled && setIsOpen(true)}
          className={cn(
            "flex-row items-center h-12 px-4 rounded-xl border gap-2",
            "bg-gray-100 dark:bg-gray-800 border-transparent",
            error && "border-red-500 dark:border-red-400",
            disabled && "opacity-50"
          )}
        >
          <Text
            className="flex-1 text-base"
            style={{ color: displayValue ? textColor : placeholderColor }}
            numberOfLines={1}
          >
            {displayValue || placeholder}
          </Text>
          <ChevronDown size={16} color={iconColor} />
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
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setIsOpen(false)}
        />
        <View className="bg-white dark:bg-gray-900 rounded-t-2xl max-h-[70%]">
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {modalTitle}
            </Text>
            <TouchableOpacity onPress={() => setIsOpen(false)} activeOpacity={0.7}>
              <X size={20} color={iconColor} />
            </TouchableOpacity>
          </View>

          {searchable && (
            <View className="flex-row items-center h-11 mx-4 mt-3 mb-1 px-3 rounded-xl gap-2 bg-gray-100 dark:bg-gray-800">
              <Search size={14} color={iconColor} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={placeholderColor}
                className="flex-1 text-sm"
                style={{ color: textColor }}
              />
            </View>
          )}

          <FlatList
            data={flatData}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderItem={({ item }) => {
              if (item.type === "section-header") {
                return (
                  <Text className="px-6 pt-4 pb-1 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wide">
                    {item.title}
                  </Text>
                );
              }

              const { option } = item;
              const selected = isSelected(option.value);

              return (
                <TouchableOpacity
                  onPress={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  activeOpacity={0.7}
                  className={cn(
                    "flex-row items-center px-6 py-3.5",
                    option.disabled && "opacity-40"
                  )}
                >
                  <View className="flex-1">
                    <Text className={cn("text-sm", selected ? "text-blue-500 font-medium" : "text-gray-900 dark:text-gray-100")}>
                      {option.label}
                    </Text>
                    {option.description && (
                      <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {option.description}
                      </Text>
                    )}
                  </View>
                  {selected && <Check size={16} color="#3b82f6" />}
                </TouchableOpacity>
              );
            }}
          />

          {multiple && values.length > 0 && (
            <View className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Pressable
                onPress={() => setIsOpen(false)}
                className="h-11 rounded-xl bg-blue-500 items-center justify-center"
              >
                <Text className="text-sm font-medium text-white">
                  Done ({values.length} selected)
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}
