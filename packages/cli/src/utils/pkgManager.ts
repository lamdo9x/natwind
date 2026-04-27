import { existsSync } from "fs";
import { join } from "path";

export type PackageManager = "pnpm" | "yarn" | "npm";

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function installCommand(pm: PackageManager, deps: string[]): string {
  const pkg = deps.join(" ");
  switch (pm) {
    case "pnpm": return `pnpm add ${pkg}`;
    case "yarn": return `yarn add ${pkg}`;
    default:     return `npm install ${pkg}`;
  }
}
