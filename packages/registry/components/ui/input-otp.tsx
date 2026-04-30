import { cn } from "@/lib/utils";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export interface InputOTPRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

export interface InputOTPProps
  extends Omit<TextInputProps, "style" | "value" | "onChangeText"> {
  length?: number;
  value?: string;
  onChangeText?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  masked?: boolean;
  containerStyle?: ViewStyle;
  slotClassName?: string;
  errorStyle?: TextStyle;
}

export const InputOTP = forwardRef<InputOTPRef, InputOTPProps>(
  (
    {
      length = 6,
      value = "",
      onChangeText,
      onComplete,
      error,
      disabled = false,
      masked = false,
      containerStyle,
      slotClassName,
      errorStyle,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    const normalized = value.replace(/[^0-9]/g, "").slice(0, length);
    const activeIndex = Math.min(normalized.length, length - 1);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => onChangeText?.(""),
    }));

    const handleChangeText = useCallback(
      (text: string) => {
        const clean = text.replace(/[^0-9]/g, "").slice(0, length);
        onChangeText?.(clean);
        if (clean.length === length) onComplete?.(clean);
      },
      [length, onChangeText, onComplete]
    );

    return (
      <View style={containerStyle}>
        <Pressable onPress={() => !disabled && inputRef.current?.focus()}>
          <TextInput
            ref={inputRef}
            value={normalized}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType="numeric"
            maxLength={length}
            editable={!disabled}
            caretHidden
            style={{ position: "absolute", left: -9999, opacity: 0 }}
            {...props}
          />

          <View className="flex-row gap-2 justify-center">
            {Array.from({ length }).map((_, i) => {
              const char = normalized[i];
              const isActive = isFocused && i === activeIndex;

              return (
                <View
                  key={i}
                  className={cn(
                    "w-11 h-14 rounded-xl border-2 items-center justify-center",
                    "bg-muted",
                    char || isActive
                      ? "border-ring"
                      : "border-border",
                    error && "border-destructive",
                    disabled && "opacity-50",
                    slotClassName
                  )}
                >
                  {isActive && !char && (
                    <View className="w-0.5 h-6 bg-ring" />
                  )}
                  {char && (
                    <Text className="text-xl font-semibold text-foreground">
                      {masked ? "•" : char}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </Pressable>

        {error && (
          <Text
            className="text-xs text-destructive mt-1.5 text-center"
            style={errorStyle}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
);

InputOTP.displayName = "InputOTP";
