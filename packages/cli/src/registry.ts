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
};

export function getComponent(name: string): RegistryEntry | undefined {
  return registry[name];
}

export function listComponents(): RegistryEntry[] {
  return Object.values(registry);
}
