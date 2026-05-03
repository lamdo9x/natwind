# natwind

A copy-paste component library for Expo (React Native) projects — styled with NativeWind, inspired by shadcn/ui.

Components are **copied into your project**, not installed as a package. You own the code and can modify it freely.

## Quick start

**1. Set up NativeWind in your project** (if not already done)
→ Follow the [NativeWind install guide](https://www.nativewind.dev/docs/getting-started/installation)

**2. Initialize natwind**

```bash
npx natwind init
```

This creates `lib/utils.ts` (the `cn()` helper) and installs `clsx`, `tailwind-merge`, and `class-variance-authority`.

**3. Add components**

```bash
npx natwind add button
npx natwind add input
npx natwind add card
```

**4. Use them**

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" onPress={() => {}}>Get started</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

## Available components

### Layout & Primitives

| Component     | Description                                        |
| ------------- | -------------------------------------------------- |
| `view`        | Themed View wrapper                                |
| `text`        | Themed Text wrapper                                |
| `scroll-view` | Themed ScrollView wrapper                          |
| `separator`   | Horizontal/vertical divider                        |
| `card`        | Surface container with header/content/footer slots |
| `image`       | Expo Image with NativeWind support                 |
| `icon`        | Lucide icon wrapper                                |

### Inputs & Forms

| Component      | Description                            |
| -------------- | -------------------------------------- |
| `button`       | Pressable button — 4 variants, 3 sizes |
| `input`        | Text input field                       |
| `input-otp`    | OTP/PIN code input                     |
| `checkbox`     | Checkbox with label                    |
| `radio`        | Radio group and item                   |
| `switch`       | Toggle switch                          |
| `toggle`       | Single toggle button                   |
| `picker`       | Native dropdown picker                 |
| `combobox`     | Searchable select with autocomplete    |
| `date-picker`  | Date/time picker                       |
| `color-picker` | HSV color picker                       |
| `searchbar`    | Search input with clear button         |

### Feedback & Overlays

| Component      | Description                     |
| -------------- | ------------------------------- |
| `alert`        | Inline alert with icon variants |
| `alert-dialog` | Modal confirmation dialog       |
| `badge`        | Status badge — 4 variants       |
| `progress`     | Progress bar                    |
| `skeleton`     | Loading skeleton placeholder    |
| `spinner`      | Activity indicator              |
| `popover`      | Floating content popover        |
| `sheet`        | Bottom/side sheet drawer        |
| `bottom-sheet` | Full-featured bottom sheet      |
| `action-sheet` | iOS-style action sheet          |

### Navigation & Structure

| Component     | Description                     |
| ------------- | ------------------------------- |
| `tabs`        | Tab bar with content panels     |
| `accordion`   | Expandable/collapsible sections |
| `collapsible` | Single expand/collapse section  |
| `link`        | Expo Router link wrapper        |
| `table`       | Data table                      |

### Media & Advanced

| Component             | Description                        |
| --------------------- | ---------------------------------- |
| `avatar`              | User avatar with fallback initials |
| `camera`              | Camera capture view                |
| `camera-preview`      | Preview captured photo/video       |
| `audio-player`        | Audio playback control             |
| `audio-recorder`      | Audio recording control            |
| `audio-waveform`      | Waveform visualizer                |
| `gallery`             | Photo gallery viewer               |
| `media-picker`        | Image/video picker from library    |
| `file-picker`         | Document/file picker               |
| `carousel`            | Horizontal swipe carousel          |
| `parallax-scrollview` | ScrollView with parallax header    |

### Utilities

| Component        | Description                    |
| ---------------- | ------------------------------ |
| `mode-toggle`    | Light/dark/system theme toggle |
| `avoid-keyboard` | KeyboardAvoidingView wrapper   |
| `onboarding`     | Multi-step onboarding flow     |

### Charts

All chart components use `react-native-svg` + `react-native-reanimated`. Install them first:

```bash
npx expo install react-native-svg react-native-reanimated
```

| Component              | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `bar-chart`            | Vertical bar chart — animated, per-bar colors, value labels   |
| `line-chart`           | Line chart — bezier curves, grid, Y-axis, gradient area fill  |
| `area-chart`           | Line chart with gradient fill (thin wrapper around line-chart)|
| `column-chart`         | Horizontal bar chart — animated width, per-bar colors         |
| `bubble-chart`         | Scatter chart with sized bubbles                              |
| `candlestick-chart`    | OHLC financial chart — bullish/bearish colors                 |
| `pie-chart`            | Animated pie chart — per-slice colors, percentage labels      |
| `doughnut-chart`       | Donut chart — configurable inner radius                       |
| `polar-area-chart`     | Polar coordinate area slices with grid rings                  |
| `radar-chart`          | Spider/radar chart with grid, axis lines, animated fill       |
| `heatmap-chart`        | Color-interpolated grid with staggered cell animations        |
| `progress-ring-chart`  | Single animated progress ring — center text, optional gradient|
| `radial-bar-chart`     | Concentric animated progress rings                            |
| `scatter-chart`        | Scatter plot — spring-in points, grid, axis labels            |
| `stacked-area-chart`   | Multi-series stacked smooth areas with gradients and legend   |
| `stacked-bar-chart`    | Vertical or horizontal stacked bars with categories           |
| `treemap-chart`        | Squarified hierarchical treemap with animated tiles           |
| `chart-container`      | Card wrapper with title/description for any chart             |

## Theming

Components use semantic NativeWind classes (`bg-background`, `text-foreground`, etc.) and expose a `useTheme` hook for programmatic token access.

```tsx
import { useTheme } from "@/components/ui/theme-provider";

function MyComponent() {
  const theme = useTheme();
  // theme.background, theme.foreground, theme.primary, ...
}
```

Wrap your app with `ThemeProvider` to enable theme context:

```tsx
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function RootLayout() {
  return <ThemeProvider>{/* your app */}</ThemeProvider>;
}
```

## Component API

### Button

```tsx
<Button
  variant="default" // "default" | "outline" | "ghost" | "destructive"
  size="md" // "sm" | "md" | "lg"
  disabled={false}
  className="" // NativeWind className (override)
  style={{}} // StyleSheet escape hatch (Reanimated, computed values)
  onPress={() => {}}
>
  Label
</Button>
```

## CLI commands

```bash
npx natwind init              # set up lib/utils.ts + install deps
npx natwind add <component>   # copy component into your project
npx natwind list              # list all available components
```

## Why natwind?

Existing options didn't quite fit:

- **[bna/ui](https://ui.ahmedbna.com/)** — great component selection, but no NativeWind support
- **[React Native Reusables](https://reactnativereusables.com/)** — shadcn-style copy-paste, but limited component coverage

natwind fills the gap: shadcn's copy-paste model, NativeWind-first styling, and enough components to cover a real app. Components were converted from bna/ui to NativeWind with the help of Claude Code.

## Design principles

- **NativeWind first** — `className` prop as primary styling, `style` as escape hatch only
- **You own the code** — files are copied, not imported from a package
- **Dark mode built-in** — semantic color tokens via `useTheme`, `dark:` prefix on every component
- **No hidden deps** — each component lists exactly what it needs

## Monorepo structure

```
natwind/
├── apps/demo/          # Expo showcase app
├── packages/
│   ├── registry/       # Component source files + useTheme hook
│   └── cli/            # npx natwind
└── pnpm-workspace.yaml
```

## Contributing

1. Add component source to `packages/registry/components/ui/` (or `components/charts/` for chart components)
2. Export from `packages/registry/index.ts`
3. Register in `packages/cli/src/registry.ts` (name, files, deps)
4. Build CLI: `cd packages/cli && pnpm build`
