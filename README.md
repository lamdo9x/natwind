# rn-ui

A copy-paste component library for Expo (React Native) projects — styled with NativeWind, inspired by shadcn/ui.

Components are **copied into your project**, not installed as a package. You own the code and can modify it freely.

## Quick start

**1. Set up NativeWind in your project** (if not already done)
→ Follow the [NativeWind v4 install guide](https://www.nativewind.dev/v4/getting-started/expo-router)

**2. Initialize rn-ui**
```bash
npx @rn-ui/cli init
```
This creates `lib/utils.ts` (the `cn()` helper) and installs `clsx` + `tailwind-merge`.

**3. Add components**
```bash
npx @rn-ui/cli add button
npx @rn-ui/cli add input
npx @rn-ui/cli add card
```

**4. Use them**
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" onPress={() => {}}>Get started</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

## Available components

| Component | Description |
|-----------|-------------|
| `button`  | Pressable button — 4 variants, 3 sizes, dual-mode styling |

More coming: `input`, `text`, `card`, `badge`, `avatar`, `modal`, `select`, `form-input`

## Component API

### Button

```tsx
<Button
  variant="default" // "default" | "outline" | "ghost" | "destructive"
  size="md"         // "sm" | "md" | "lg"
  disabled={false}
  className=""      // NativeWind className (override)
  style={{}}        // StyleSheet escape hatch (Reanimated, computed values)
  onPress={() => {}}
>
  Label
</Button>
```

## CLI commands

```bash
npx @rn-ui/cli init              # set up lib/utils.ts + install deps
npx @rn-ui/cli add <component>   # copy component into your project
npx @rn-ui/cli list              # list all available components
```

## Design principles

- **NativeWind first** — `className` prop as primary styling, `style` as escape hatch only
- **You own the code** — files are copied, not imported from a package
- **Dark mode built-in** — `dark:` prefix on every component
- **No hidden deps** — each component lists exactly what it needs

## Monorepo structure

```
rn-ui/
├── apps/demo/          # Expo showcase app
├── packages/
│   ├── registry/       # Component source files
│   └── cli/            # npx @rn-ui/cli
└── pnpm-workspace.yaml
```

## Contributing

1. Add component source to `packages/registry/components/ui/`
2. Export from `packages/registry/index.ts`
3. Register in `packages/cli/src/registry.ts` (name, files, deps)
4. Build CLI: `cd packages/cli && pnpm build`
