const GITHUB_RAW =
  "https://raw.githubusercontent.com/lamdo9x/rn-ui/main/packages/registry";

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
};

export function getComponent(name: string): RegistryEntry | undefined {
  return registry[name];
}

export function listComponents(): RegistryEntry[] {
  return Object.values(registry);
}
