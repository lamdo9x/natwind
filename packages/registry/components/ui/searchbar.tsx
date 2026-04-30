import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react-native";
import { useTheme } from "../../theme/theme-provider";
import { forwardRef, useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface SearchBarProps extends Omit<TextInputProps, "style"> {
  loading?: boolean;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  debounceMs?: number;
  containerClassName?: string;
  containerStyle?: ViewStyle;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(
  (
    {
      loading = false,
      onSearch,
      onClear,
      showClearButton = true,
      debounceMs = 300,
      containerClassName,
      containerStyle,
      value,
      onChangeText,
      onFocus,
      onBlur,
      placeholder = "Search...",
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value ?? "");
    const [isFocused, setIsFocused] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tokens = useTheme();

    const iconColor = tokens.mutedForeground;
    const placeholderColor = tokens.mutedForeground;
    const textColor = tokens.foreground;

    const displayValue = value !== undefined ? value : internalValue;
    const showClear = showClearButton && displayValue.length > 0;

    const handleChangeText = useCallback(
      (text: string) => {
        setInternalValue(text);
        onChangeText?.(text);
        if (onSearch) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => onSearch(text), debounceMs);
        }
      },
      [onChangeText, onSearch, debounceMs]
    );

    const handleClear = useCallback(() => {
      setInternalValue("");
      onChangeText?.("");
      onClear?.();
      onSearch?.("");
      if (debounceRef.current) clearTimeout(debounceRef.current);
    }, [onChangeText, onClear, onSearch]);

    return (
      <View
        className={cn(
          "flex-row items-center h-12 px-4 rounded-xl gap-2",
          "bg-muted",
          containerClassName
        )}
        style={containerStyle}
      >
        <Search size={16} color={iconColor} />

        <TextInput
          ref={ref}
          value={displayValue}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
          style={{ flex: 1, fontSize: 16, color: textColor, height: '100%' }}
          returnKeyType="search"
          onSubmitEditing={() => onSearch?.(displayValue)}
          {...props}
        />

        {loading && <ActivityIndicator size="small" color={iconColor} />}

        {showClear && !loading && (
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
            <X size={16} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

SearchBar.displayName = "SearchBar";
