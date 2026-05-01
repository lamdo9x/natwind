const GITHUB_RAW =
  "https://raw.githubusercontent.com/lamdo9x/natwind/main/packages/registry";

export interface RegistryEntry {
  name: string;
  description: string;
  files: { source: string; target: string }[];
  dependencies: string[];
  registryDependencies: string[];
}

export const registry: Record<string, RegistryEntry> = {
  accordion: {
    name: "accordion",
    description: "Accordion — single/multiple expand, collapsible, Reanimated chevron rotation",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/accordion.tsx`,
        target: "components/ui/accordion.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native"],
    registryDependencies: [],
  },

  alert: {
    name: "alert",
    description: "Alert — compound Alert/AlertTitle/AlertDescription, 5 variants (default, info, warning, destructive, success)",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/alert.tsx`,
        target: "components/ui/alert.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native"],
    registryDependencies: [],
  },

  avatar: {
    name: "avatar",
    description: "Avatar — compound Avatar/AvatarImage/AvatarFallback, expo-image, initials fallback",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/avatar.tsx`,
        target: "components/ui/avatar.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "expo-image"],
    registryDependencies: [],
  },

  badge: {
    name: "badge",
    description: "Badge — 5 variants (default, secondary, destructive, outline, success)",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/badge.tsx`,
        target: "components/ui/badge.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  button: {
    name: "button",
    description: "Button — 7 variants, 4 sizes, spring animation, haptics, icon, loading",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/button.tsx`,
        target: "components/ui/button.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "expo-haptics", "lucide-react-native"],
    registryDependencies: [],
  },

  card: {
    name: "card",
    description: "Card — compound Card/CardHeader/CardTitle/CardDescription/CardContent/CardFooter",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/card.tsx`,
        target: "components/ui/card.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  checkbox: {
    name: "checkbox",
    description: "Checkbox — checked state, label, error, disabled",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/checkbox.tsx`,
        target: "components/ui/checkbox.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native"],
    registryDependencies: [],
  },

  collapsible: {
    name: "collapsible",
    description: "Collapsible — title + animated chevron, show/hide children",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/collapsible.tsx`,
        target: "components/ui/collapsible.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native"],
    registryDependencies: [],
  },

  input: {
    name: "input",
    description: "Input — label, error, hint, icon, rightComponent, filled/outline variants, textarea",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/input.tsx`,
        target: "components/ui/input.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "nativewind"],
    registryDependencies: [],
  },

  "input-otp": {
    name: "input-otp",
    description: "InputOTP — hidden TextInput + visual slots, masked mode, onComplete callback",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/input-otp.tsx`,
        target: "components/ui/input-otp.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "nativewind"],
    registryDependencies: [],
  },

  progress: {
    name: "progress",
    description: "Progress — animated fill bar, 0-100 value, Reanimated withTiming",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/progress.tsx`,
        target: "components/ui/progress.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  radio: {
    name: "radio",
    description: "Radio — RadioGroup + RadioButton, vertical/horizontal orientation, disabled",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/radio.tsx`,
        target: "components/ui/radio.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  searchbar: {
    name: "searchbar",
    description: "SearchBar — debounced search, clear button, loading state, focus styling",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/searchbar.tsx`,
        target: "components/ui/searchbar.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "nativewind"],
    registryDependencies: [],
  },

  separator: {
    name: "separator",
    description: "Separator — horizontal or vertical divider",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/separator.tsx`,
        target: "components/ui/separator.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  skeleton: {
    name: "skeleton",
    description: "Skeleton — pulsing placeholder, default/rounded variant, Reanimated",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/skeleton.tsx`,
        target: "components/ui/skeleton.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  spinner: {
    name: "spinner",
    description: "Spinner — 5 variants (default, circle, dots, pulse, bars), 3 sizes",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/spinner.tsx`,
        target: "components/ui/spinner.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "nativewind"],
    registryDependencies: [],
  },

  switch: {
    name: "switch",
    description: "Switch — animated toggle, label, disabled",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/switch.tsx`,
        target: "components/ui/switch.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  text: {
    name: "text",
    description: "Text — 6 variants (heading, title, subtitle, body, caption, link)",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/text.tsx`,
        target: "components/ui/text.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  "alert-dialog": {
    name: "alert-dialog",
    description: "AlertDialog — Modal overlay with fade animation, confirm/cancel, dismissible backdrop, useAlertDialog hook",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/alert-dialog.tsx`,
        target: "components/ui/alert-dialog.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  "avoid-keyboard": {
    name: "avoid-keyboard",
    description: "AvoidKeyboard — animated spacer that grows with keyboard height, Reanimated, matches native keyboard animation",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/avoid-keyboard.tsx`,
        target: "components/ui/avoid-keyboard.tsx",
      },
    ],
    dependencies: [],
    registryDependencies: [],
  },

  icon: {
    name: "icon",
    description: "Icon — lucide-react-native wrapper with themed light/dark color, size, strokeWidth defaults",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/icon.tsx`,
        target: "components/ui/icon.tsx",
      },
    ],
    dependencies: ["lucide-react-native", "nativewind"],
    registryDependencies: [],
  },

  image: {
    name: "image",
    description: "Image — expo-image wrapper with error state, fallback slot, container className",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/image.tsx`,
        target: "components/ui/image.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "expo-image"],
    registryDependencies: [],
  },

  link: {
    name: "link",
    description: "Link — expo-router Link with external URL support, in-app browser (expo-web-browser) or system browser",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/link.tsx`,
        target: "components/ui/link.tsx",
      },
    ],
    dependencies: ["expo-router", "expo-web-browser"],
    registryDependencies: [],
  },

  "mode-toggle": {
    name: "mode-toggle",
    description: "ModeToggle — dark/light mode toggle button, Sun/Moon icons, useColorScheme from nativewind",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/mode-toggle.tsx`,
        target: "components/ui/mode-toggle.tsx",
      },
    ],
    dependencies: ["lucide-react-native", "nativewind"],
    registryDependencies: [],
  },

  picker: {
    name: "picker",
    description: "Picker — select dropdown via Modal, single/multi-select, sections, searchable, FlatList options",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/picker.tsx`,
        target: "components/ui/picker.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "nativewind"],
    registryDependencies: [],
  },

  popover: {
    name: "popover",
    description: "Popover — compound Popover/PopoverTrigger/PopoverContent/PopoverHeader/PopoverBody/PopoverFooter, measures trigger position, auto-flips",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/popover.tsx`,
        target: "components/ui/popover.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  "scroll-view": {
    name: "scroll-view",
    description: "ScrollView — forwardRef ScrollView with transparent background default",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/scroll-view.tsx`,
        target: "components/ui/scroll-view.tsx",
      },
    ],
    dependencies: [],
    registryDependencies: [],
  },

  table: {
    name: "table",
    description: "Table — compound Table/TableHeader/TableBody/TableFooter/TableRow/TableHead/TableCell, horizontal scroll, width prop",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/table.tsx`,
        target: "components/ui/table.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  tabs: {
    name: "tabs",
    description: "Tabs — compound Tabs/TabsList/TabsTrigger/TabsContent, controlled/uncontrolled, active indicator",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/tabs.tsx`,
        target: "components/ui/tabs.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  toast: {
    name: "toast",
    description: "Toast — ToastProvider + useToast hook, 5 variants, slide-in animation, auto-dismiss, Reanimated",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/toast.tsx`,
        target: "components/ui/toast.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native"],
    registryDependencies: [],
  },

  toggle: {
    name: "toggle",
    description: "Toggle — press-toggle button, default/outline variants, sm/default/lg sizes, pressed state styling",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/toggle.tsx`,
        target: "components/ui/toggle.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  view: {
    name: "view",
    description: "View — transparent background View wrapper (prevents dark mode white flash)",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/view.tsx`,
        target: "components/ui/view.tsx",
      },
    ],
    dependencies: [],
    registryDependencies: [],
  },

  "action-sheet": {
    name: "action-sheet",
    description: "ActionSheet — iOS-style modal action list, slide-up animation, destructive/cancel variants, useActionSheet hook",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/action-sheet.tsx`,
        target: "components/ui/action-sheet.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  "bottom-sheet": {
    name: "bottom-sheet",
    description: "BottomSheet — draggable bottom sheet with snap points, PanResponder gesture, handle, close button, scrollable content",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/bottom-sheet.tsx`,
        target: "components/ui/bottom-sheet.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "nativewind"],
    registryDependencies: [],
  },

  sheet: {
    name: "sheet",
    description: "Sheet — slide-in panel from any side (bottom/top/left/right), title, description, close button, useSheet hook",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/sheet.tsx`,
        target: "components/ui/sheet.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "nativewind"],
    registryDependencies: [],
  },

  carousel: {
    name: "carousel",
    description: "Carousel — FlatList-based horizontal pager, dot indicators, arrow buttons, snap-to-item, gap support",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/carousel.tsx`,
        target: "components/ui/carousel.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  combobox: {
    name: "combobox",
    description: "Combobox — searchable select dropdown, clearable, empty state, option descriptions, autofocus search",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/combobox.tsx`,
        target: "components/ui/combobox.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "nativewind"],
    registryDependencies: [],
  },

  "date-picker": {
    name: "date-picker",
    description: "DatePicker — calendar grid modal, min/max date, custom format, today highlight, selected day",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/date-picker.tsx`,
        target: "components/ui/date-picker.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "nativewind"],
    registryDependencies: [],
  },

  onboarding: {
    name: "onboarding",
    description: "Onboarding — multi-step FlatList pager, dot indicators, Next/Done/Skip buttons, custom step renderers",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/onboarding.tsx`,
        target: "components/ui/onboarding.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
  },

  "audio-waveform": {
    name: "audio-waveform",
    description: "AudioWaveform — animated bar waveform, seekable progress, play/pause, Reanimated + GestureHandler",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/audio-waveform.tsx`,
        target: "components/ui/audio-waveform.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "react-native-reanimated", "react-native-gesture-handler"],
    registryDependencies: [],
  },

  "audio-player": {
    name: "audio-player",
    description: "AudioPlayer — expo-audio player with waveform visualization, controls, progress, volume",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/audio-player.tsx`,
        target: "components/ui/audio-player.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "expo-audio", "react-native-reanimated", "react-native-gesture-handler"],
    registryDependencies: ["audio-waveform"],
  },

  "audio-recorder": {
    name: "audio-recorder",
    description: "AudioRecorder — record audio, playback, timer, waveform preview, expo-audio",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/audio-recorder.tsx`,
        target: "components/ui/audio-recorder.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "expo-audio", "react-native-reanimated"],
    registryDependencies: ["audio-player", "audio-waveform"],
  },

  "file-picker": {
    name: "file-picker",
    description: "FilePicker — expo-document-picker, multiple files, preview list, file size display",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/file-picker.tsx`,
        target: "components/ui/file-picker.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "expo-document-picker"],
    registryDependencies: ["button", "text"],
  },

  "media-picker": {
    name: "media-picker",
    description: "MediaPicker — system picker or custom gallery UI, multi-select, expo-image-picker + expo-media-library",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/media-picker.tsx`,
        target: "components/ui/media-picker.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "expo-image-picker", "expo-media-library", "expo-image"],
    registryDependencies: ["button", "text", "view"],
  },

  gallery: {
    name: "gallery",
    description: "Gallery — image grid, fullscreen pager, pinch-to-zoom, double-tap zoom, share, download, GestureHandler",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/gallery.tsx`,
        target: "components/ui/gallery.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "expo-image", "react-native-gesture-handler", "react-native-reanimated"],
    registryDependencies: [],
  },

  "hello-wave": {
    name: "hello-wave",
    description: "HelloWave — animated wave emoji, sm/md/lg sizes, Reanimated",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/hello-wave.tsx`,
        target: "components/ui/hello-wave.tsx",
      },
    ],
    dependencies: ["react-native-reanimated"],
    registryDependencies: [],
  },

  "parallax-scroll-view": {
    name: "parallax-scroll-view",
    description: "ParallaxScrollView — animated parallax header, pinch-to-scale, expo-image, Reanimated",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/parallax-scrollview.tsx`,
        target: "components/ui/parallax-scrollview.tsx",
      },
    ],
    dependencies: ["expo-image", "react-native-reanimated"],
    registryDependencies: [],
  },

  share: {
    name: "share",
    description: "ShareButton — native Share sheet wrapper, URL/message/title, lucide icon",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/share.tsx`,
        target: "components/ui/share.tsx",
      },
    ],
    dependencies: ["lucide-react-native"],
    registryDependencies: ["button"],
  },

  camera: {
    name: "camera",
    description: "Camera — expo-camera, flash toggle, flip, photo capture, permission gating",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/camera.tsx`,
        target: "components/ui/camera.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "expo-camera"],
    registryDependencies: [],
  },

  "camera-preview": {
    name: "camera-preview",
    description: "CameraPreview — captured photo review: retake, confirm, share, delete, expo-image",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/camera-preview.tsx`,
        target: "components/ui/camera-preview.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "expo-image"],
    registryDependencies: [],
  },

  "color-picker": {
    name: "color-picker",
    description: "ColorPicker — HSV gradient canvas, hue slider, swatches, hex input, react-native-svg + GestureHandler",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/color-picker.tsx`,
        target: "components/ui/color-picker.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "react-native-svg", "react-native-gesture-handler", "react-native-reanimated"],
    registryDependencies: [],
  },

  video: {
    name: "video",
    description: "VideoPlayer — expo-video, custom controls, progress bar, mute, loop, fullscreen",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/video.tsx`,
        target: "components/ui/video.tsx",
      },
    ],
    dependencies: ["clsx", "tailwind-merge", "lucide-react-native", "expo-video", "expo"],
    registryDependencies: ["progress", "text"],
  },
};

export function getComponent(name: string): RegistryEntry | undefined {
  return registry[name];
}

export function listComponents(): RegistryEntry[] {
  return Object.values(registry);
}
