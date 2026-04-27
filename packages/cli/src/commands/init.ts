import chalk from "chalk";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { detectPackageManager, installCommand } from "../utils/pkgManager";

const UTILS_CONTENT = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

export function init() {
  const cwd = process.cwd();

  // Create lib/utils.ts
  const libDir = join(cwd, "lib");
  const utilsPath = join(libDir, "utils.ts");
  if (!existsSync(utilsPath)) {
    mkdirSync(libDir, { recursive: true });
    writeFileSync(utilsPath, UTILS_CONTENT, "utf-8");
    console.log(chalk.green("✔ Created lib/utils.ts"));
  } else {
    console.log(chalk.yellow("⚠ lib/utils.ts already exists, skipping."));
  }

  // Install clsx + tailwind-merge
  const pm = detectPackageManager(cwd);
  const cmd = installCommand(pm, ["clsx", "tailwind-merge"]);
  console.log(chalk.dim("  Installing clsx and tailwind-merge..."));
  execSync(cmd, { stdio: "inherit", cwd });

  console.log(chalk.green("\n✔ rn-ui initialized."));
  console.log(chalk.dim("Next: set up NativeWind if not already done, then run:"));
  console.log(chalk.cyan("  npx rn-ui add button"));
}
