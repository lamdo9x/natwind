import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

export type TextVariant = "body" | "title" | "subtitle" | "caption" | "heading" | "link";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
}

const variantClasses: Record<TextVariant, string> = {
  heading:  "text-[28px] font-extrabold text-gray-900 dark:text-gray-100",
  title:    "text-2xl font-bold text-gray-900 dark:text-gray-100",
  subtitle: "text-[19px] font-semibold text-gray-900 dark:text-gray-100",
  body:     "text-base text-gray-900 dark:text-gray-100",
  caption:  "text-sm font-normal text-gray-500 dark:text-gray-400",
  link:     "text-base text-blue-500 dark:text-blue-400 underline",
};

export const Text = forwardRef<RNText, TextProps>(
  ({ variant = "body", className, ...props }, ref) => (
    <RNText ref={ref} className={cn(variantClasses[variant], className)} {...props} />
  )
);

Text.displayName = "Text";
