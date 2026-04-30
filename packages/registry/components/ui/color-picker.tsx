import { useTheme } from '../../theme/theme-provider';
import { useCallback, useState } from 'react';
import { LayoutChangeEvent, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';
import { Text } from './text';

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  style?: ViewStyle;
  showHex?: boolean;
  showPreview?: boolean;
  swatches?: string[];
}

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    const val = v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    return Math.round(val * 255).toString(16).padStart(2, '0');
  };
  return `#${f(5)}${f(3)}${f(1)}`;
}

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

const DEFAULT_SWATCHES = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#ffffff', '#9ca3af', '#374151', '#000000',
];

export function ColorPicker({
  value = '#3b82f6',
  onChange,
  style,
  showHex = true,
  showPreview = true,
  swatches = DEFAULT_SWATCHES,
}: ColorPickerProps) {
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(value));
  const [svWidth, setSvWidth] = useState(0);
  const [hueWidth, setHueWidth] = useState(0);

  const tokens = useTheme();
  const textColor = tokens.foreground;
  const mutedColor = tokens.mutedForeground;
  const borderColor = tokens.border;

  const currentColor = hsvToHex(...hsv);
  const hueColor = hsvToHex(hsv[0], 1, 1);

  const handleSVTouch = useCallback((x: number, y: number, width: number, height: number) => {
    const s = Math.max(0, Math.min(1, x / width));
    const v = Math.max(0, Math.min(1, 1 - y / height));
    const newHsv: [number, number, number] = [hsv[0], s, v];
    setHsv(newHsv);
    onChange?.(hsvToHex(...newHsv));
  }, [hsv, onChange]);

  const handleHueTouch = useCallback((x: number, width: number) => {
    const h = Math.max(0, Math.min(360, (x / width) * 360));
    const newHsv: [number, number, number] = [h, hsv[1], hsv[2]];
    setHsv(newHsv);
    onChange?.(hsvToHex(...newHsv));
  }, [hsv, onChange]);

  const [svHeight, setSvHeight] = useState(0);

  return (
    <View className='gap-4' style={style}>
      {showPreview && (
        <View className='flex-row items-center gap-3'>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: currentColor, borderWidth: 2, borderColor }} />
          {showHex && (
            <Text style={{ fontSize: 16, fontWeight: '500', color: textColor, fontVariant: ['tabular-nums'] }}>
              {currentColor.toUpperCase()}
            </Text>
          )}
        </View>
      )}

      {/* SV Gradient */}
      <View
        className='rounded-lg overflow-hidden'
        style={{ height: 180 }}
        onLayout={(e: LayoutChangeEvent) => {
          setSvWidth(e.nativeEvent.layout.width);
          setSvHeight(e.nativeEvent.layout.height);
        }}
        onStartShouldSetResponder={() => true}
        onResponderGrant={(e) => handleSVTouch(e.nativeEvent.locationX, e.nativeEvent.locationY, svWidth, svHeight)}
        onResponderMove={(e) => handleSVTouch(e.nativeEvent.locationX, e.nativeEvent.locationY, svWidth, svHeight)}
      >
        <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} width='100%' height='100%'>
          <Defs>
            <LinearGradient id='saturation' x1='0' y1='0' x2='1' y2='0'>
              <Stop offset='0' stopColor='#ffffff' stopOpacity='1' />
              <Stop offset='1' stopColor={hueColor} stopOpacity='1' />
            </LinearGradient>
            <LinearGradient id='value' x1='0' y1='0' x2='0' y2='1'>
              <Stop offset='0' stopColor='transparent' stopOpacity='0' />
              <Stop offset='1' stopColor='#000000' stopOpacity='1' />
            </LinearGradient>
          </Defs>
          <Rect width='100%' height='100%' fill='url(#saturation)' />
          <Rect width='100%' height='100%' fill='url(#value)' />
        </Svg>
        {/* Cursor */}
        <View
          pointerEvents='none'
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#ffffff',
            backgroundColor: currentColor,
            left: svWidth * hsv[1] - 10,
            top: svHeight * (1 - hsv[2]) - 10,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          }}
        />
      </View>

      {/* Hue Slider */}
      <View
        className='rounded-full overflow-hidden'
        style={{ height: 24 }}
        onLayout={(e: LayoutChangeEvent) => setHueWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onResponderGrant={(e) => handleHueTouch(e.nativeEvent.locationX, hueWidth)}
        onResponderMove={(e) => handleHueTouch(e.nativeEvent.locationX, hueWidth)}
      >
        <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} width='100%' height='100%'>
          <Defs>
            <LinearGradient id='hue' x1='0' y1='0' x2='1' y2='0'>
              {[0,60,120,180,240,300,360].map((h, i) => (
                <Stop key={h} offset={`${(i / 6) * 100}%`} stopColor={hsvToHex(h, 1, 1)} stopOpacity='1' />
              ))}
            </LinearGradient>
          </Defs>
          <Rect width='100%' height='100%' fill='url(#hue)' />
        </Svg>
        <View
          pointerEvents='none'
          style={{
            position: 'absolute',
            width: 28,
            height: 28,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: '#ffffff',
            backgroundColor: hueColor,
            top: -2,
            left: hueWidth * (hsv[0] / 360) - 14,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          }}
        />
      </View>

      {/* Swatches */}
      {swatches.length > 0 && (
        <View className='flex-row flex-wrap gap-2'>
          {swatches.map((swatch) => (
            <TouchableOpacity
              key={swatch}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: swatch,
                borderWidth: swatch === currentColor ? 2 : 1,
                borderColor: swatch === currentColor ? textColor : borderColor,
              }}
              onPress={() => {
                const newHsv = hexToHsv(swatch);
                setHsv(newHsv);
                onChange?.(swatch);
              }}
              activeOpacity={0.8}
            />
          ))}
        </View>
      )}
    </View>
  );
}
