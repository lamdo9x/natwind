import { cn } from "@/lib/utils";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useCallback, useMemo, useState } from "react";
import { Modal, Pressable, Text, View, ViewStyle } from "react-native";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(date: Date, format: string): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear());
  return format
    .replace("DD", d)
    .replace("MM", m)
    .replace("YYYY", y)
    .replace("D", String(date.getDate()))
    .replace("M", String(date.getMonth() + 1))
    .replace("YYYY", y);
}

export interface DatePickerProps {
  value?: Date;
  onValueChange?: (date: Date) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  style?: ViewStyle;
}

export function DatePicker({
  value,
  onValueChange,
  placeholder = "Select date",
  label,
  error,
  disabled = false,
  minDate,
  maxDate,
  format = "MM/DD/YYYY",
  style,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ?? new Date());
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#9ca3af" : "#6b7280";

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfWeek = startOfMonth(viewDate).getDay();
  const daysInMonth = getDaysInMonth(year, month);

  const cells = useMemo(() => {
    const result: (number | null)[] = Array(firstDayOfWeek).fill(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    while (result.length % 7 !== 0) result.push(null);
    return result;
  }, [firstDayOfWeek, daysInMonth]);

  const isDisabledDay = useCallback(
    (day: number) => {
      const date = new Date(year, month, day);
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [year, month, minDate, maxDate]
  );

  const handleSelect = useCallback(
    (day: number) => {
      if (isDisabledDay(day)) return;
      const selected = new Date(year, month, day);
      onValueChange?.(selected);
      setIsOpen(false);
    },
    [year, month, isDisabledDay, onValueChange]
  );

  const prevMonth = useCallback(() => {
    setViewDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const nextMonth = useCallback(() => {
    setViewDate(new Date(year, month + 1, 1));
  }, [year, month]);

  const displayText = value ? formatDate(value, format) : "";

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
            className={cn(
              "flex-1 text-base",
              displayText
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
            )}
          >
            {displayText || placeholder}
          </Text>
          <CalendarDays size={16} color={iconColor} />
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
          className="flex-1 bg-black/40 items-center justify-center px-4"
          onPress={() => setIsOpen(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 w-full max-w-sm shadow-xl">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <Pressable onPress={prevMonth} hitSlop={8} className="p-1">
                  <ChevronLeft size={20} color={iconColor} />
                </Pressable>
                <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {MONTHS[month]} {year}
                </Text>
                <Pressable onPress={nextMonth} hitSlop={8} className="p-1">
                  <ChevronRight size={20} color={iconColor} />
                </Pressable>
              </View>

              {/* Day labels */}
              <View className="flex-row mb-2">
                {DAYS.map((d) => (
                  <View key={d} className="flex-1 items-center">
                    <Text className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      {d}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Grid */}
              {Array.from({ length: cells.length / 7 }).map((_, rowIdx) => (
                <View key={rowIdx} className="flex-row mb-1">
                  {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
                    if (day === null) {
                      return <View key={colIdx} className="flex-1 h-9" />;
                    }
                    const date = new Date(year, month, day);
                    const isSelected = value ? isSameDay(date, value) : false;
                    const isToday = isSameDay(date, new Date());
                    const isDis = isDisabledDay(day);

                    return (
                      <Pressable
                        key={colIdx}
                        onPress={() => handleSelect(day)}
                        disabled={isDis}
                        className="flex-1 items-center justify-center"
                      >
                        <View
                          className={cn(
                            "w-9 h-9 rounded-full items-center justify-center",
                            isSelected && "bg-blue-500",
                            !isSelected && isToday && "border border-blue-500"
                          )}
                        >
                          <Text
                            className={cn(
                              "text-sm",
                              isSelected
                                ? "text-white font-semibold"
                                : isToday
                                ? "text-blue-500 font-medium"
                                : isDis
                                ? "text-gray-300 dark:text-gray-600"
                                : "text-gray-900 dark:text-gray-100"
                            )}
                          >
                            {day}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
