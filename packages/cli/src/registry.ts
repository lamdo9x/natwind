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
};

export function getComponent(name: string): RegistryEntry | undefined {
  return registry[name];
}

export function listComponents(): RegistryEntry[] {
  return Object.values(registry);
}
