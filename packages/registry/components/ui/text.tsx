import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

export const textVariants = cva("", {
  variants: {
    variant: {
      heading:  "text-[28px] font-extrabold text-foreground",
      title:    "text-2xl font-bold text-foreground",
      subtitle: "text-[19px] font-semibold text-foreground",
      body:     "text-base text-foreground",
      caption:  "text-sm font-normal text-muted-foreground",
      link:     "text-base text-primary underline",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export type TextVariant = NonNullable<VariantProps<typeof textVariants>["variant"]>;

interface TextProps extends RNTextProps, VariantProps<typeof textVariants> {
  className?: string;
}

export const Text = forwardRef<RNText, TextProps>(
  ({ variant = "body", className, ...props }, ref) => (
    <RNText ref={ref} className={cn(textVariants({ variant }), className)} {...props} />
  )
);

Text.displayName = "Text";
