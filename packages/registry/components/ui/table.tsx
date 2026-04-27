import { cn } from "@/lib/utils";
import { ScrollView, Text, View, ViewStyle } from "react-native";

export interface TableProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  scrollable?: boolean;
}

export function Table({ children, className, style, scrollable = true }: TableProps) {
  const content = (
    <View className={cn("min-w-full", className)} style={style}>
      {children}
    </View>
  );

  if (scrollable) {
    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>{content}</ScrollView>;
  }

  return content;
}

export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function TableHeader({ children, className, style }: TableHeaderProps) {
  return (
    <View
      className={cn("flex-row border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50", className)}
      style={style}
    >
      {children}
    </View>
  );
}

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function TableBody({ children, className, style }: TableBodyProps) {
  return (
    <View className={className} style={style}>
      {children}
    </View>
  );
}

export interface TableFooterProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function TableFooter({ children, className, style }: TableFooterProps) {
  return (
    <View
      className={cn("flex-row border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50", className)}
      style={style}
    >
      {children}
    </View>
  );
}

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export function TableRow({ children, className, style }: TableRowProps) {
  return (
    <View
      className={cn("flex-row border-b border-gray-100 dark:border-gray-800", className)}
      style={style}
    >
      {children}
    </View>
  );
}

export interface TableHeadProps {
  children?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  width?: number;
}

export function TableHead({ children, className, style, width }: TableHeadProps) {
  return (
    <View
      className={cn("px-4 py-3 justify-center", className)}
      style={[width ? { width } : { flex: 1 }, style]}
    >
      <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {children}
      </Text>
    </View>
  );
}

export interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  width?: number;
}

export function TableCell({ children, className, style, width }: TableCellProps) {
  return (
    <View
      className={cn("px-4 py-3 justify-center", className)}
      style={[width ? { width } : { flex: 1 }, style]}
    >
      {typeof children === "string" ? (
        <Text className="text-sm text-gray-900 dark:text-gray-100">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
