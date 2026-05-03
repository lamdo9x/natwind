import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from '../ui/text';

type Props = {
  title?: string;
  description?: string;
  children: ReactNode;
  style?: ViewStyle;
};

export function ChartContainer({ title, description, children, style }: Props) {
  return (
    <View className="w-full bg-secondary rounded-xl p-4" style={style}>
      {title && <Text variant="subtitle" className="mb-1">{title}</Text>}
      {description && <Text variant="caption" className="mb-4">{description}</Text>}
      {children}
    </View>
  );
}
