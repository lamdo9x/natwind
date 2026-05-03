import { useTheme } from '../../theme/theme-provider';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export interface HeatmapDataPoint {
  row: string | number;
  col: string | number;
  value: number;
  label?: string;
}

interface ChartConfig {
  width?: number;
  height?: number;
  padding?: number;
  showLabels?: boolean;
  animated?: boolean;
  duration?: number;
  colorScale?: string[];
}

function interpolateColor(c1: string, c2: string, t: number): string {
  const h = (s: string) => s.replace('#', '');
  const r1 = parseInt(h(c1).substr(0, 2), 16);
  const g1 = parseInt(h(c1).substr(2, 2), 16);
  const b1 = parseInt(h(c1).substr(4, 2), 16);
  const r2 = parseInt(h(c2).substr(0, 2), 16);
  const g2 = parseInt(h(c2).substr(2, 2), 16);
  const b2 = parseInt(h(c2).substr(4, 2), 16);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getHeatColor(value: number, min: number, max: number, scale: string[]): string {
  if (max === min) return scale[0];
  const n = (value - min) / (max - min);
  const seg = 1 / (scale.length - 1);
  const idx = Math.min(Math.floor(n / seg), scale.length - 2);
  const progress = (n % seg) / seg;
  return interpolateColor(scale[idx], scale[idx + 1], progress);
}

function AnimatedCell({ x, y, size, fill, delay, animated }: {
  x: number; y: number; size: number; fill: string; delay: number; animated: boolean;
}) {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = animated ? withDelay(delay, withTiming(1, { duration: 300 })) : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fill, animated]);
  const animatedProps = useAnimatedProps(() => ({ opacity: opacity.value }));
  return <AnimatedRect x={x} y={y} width={size - 2} height={size - 2} fill={fill} rx={2} animatedProps={animatedProps} />;
}

type Props = {
  data: HeatmapDataPoint[];
  config?: ChartConfig;
  style?: ViewStyle;
};

export function HeatmapChart({ data, config = {}, style }: Props) {
  const [containerWidth, setContainerWidth] = useState(300);
  const theme = useTheme();

  const {
    height = 220, padding = 40, showLabels = true,
    animated = true, duration = 1000,
    colorScale = ['#e0f2fe', '#0369a1', '#1e3a8a'],
  } = config;

  const chartWidth = containerWidth || config.width || 300;

  if (!data.length) return null;

  const rows = [...new Set(data.map((d) => String(d.row)))];
  const cols = [...new Set(data.map((d) => String(d.col)))];
  const minVal = Math.min(...data.map((d) => d.value));
  const maxVal = Math.max(...data.map((d) => d.value));
  const innerW = chartWidth - padding * 2;
  const innerH = height - padding * 2;
  const cellW = innerW / cols.length;
  const cellH = innerH / rows.length;

  return (
    <View
      className="w-full" style={[{ height }, style]}
      onLayout={(e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}
    >
      <Svg width={chartWidth} height={height}>
        {showLabels && (
          <>
            {cols.map((col, i) => (
              <SvgText key={`cl-${i}`} x={padding + i * cellW + cellW / 2} y={padding - 8}
                textAnchor="middle" fontSize={10} fill={theme.mutedForeground}>
                {col}
              </SvgText>
            ))}
            {rows.map((row, i) => (
              <SvgText key={`rl-${i}`} x={padding - 8} y={padding + i * cellH + cellH / 2 + 4}
                textAnchor="end" fontSize={10} fill={theme.mutedForeground}>
                {row}
              </SvgText>
            ))}
          </>
        )}

        {data.map((item, idx) => {
          const colIdx = cols.indexOf(String(item.col));
          const rowIdx = rows.indexOf(String(item.row));
          const x = padding + colIdx * cellW;
          const y = padding + rowIdx * cellH;
          const fill = getHeatColor(item.value, minVal, maxVal, colorScale);
          return (
            <G key={`cell-${idx}`}>
              <AnimatedCell x={x} y={y} size={Math.min(cellW, cellH)} fill={fill}
                delay={idx * 30} animated={animated} />
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
