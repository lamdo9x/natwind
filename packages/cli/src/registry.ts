const GITHUB_RAW =
  "https://raw.githubusercontent.com/leodo9x/rn-ui/main/packages/registry";

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
    description: "Button with variants (default, outline, ghost, destructive) and sizes",
    files: [
      {
        source: `${GITHUB_RAW}/components/ui/button.tsx`,
        target: "components/ui/button.tsx",
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
