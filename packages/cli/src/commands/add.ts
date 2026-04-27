import chalk from "chalk";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { getComponent, listComponents } from "../registry";
import { detectPackageManager, installCommand } from "../utils/pkgManager";

export async function add(componentName: string) {
  const cwd = process.cwd();
  const entry = getComponent(componentName);

  if (!entry) {
    console.error(chalk.red(`✖ Component "${componentName}" not found.`));
    console.log(chalk.dim("Available components:"));
    listComponents().forEach((c) => console.log(chalk.dim(`  - ${c.name}`)));
    process.exit(1);
  }

  // Resolve deps from registry dependencies first
  for (const dep of entry.registryDependencies) {
    console.log(chalk.cyan(`  → Adding dependency: ${dep}`));
    await add(dep);
  }

  // Download and write each file
  for (const file of entry.files) {
    const targetPath = join(cwd, file.target);
    const targetDir = dirname(targetPath);

    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    if (existsSync(targetPath)) {
      console.log(chalk.yellow(`⚠ ${file.target} already exists, skipping.`));
      continue;
    }

    console.log(chalk.dim(`  Fetching ${file.source}...`));
    const res = await fetch(file.source);
    if (!res.ok) {
      console.error(chalk.red(`✖ Failed to fetch ${file.source} (${res.status})`));
      process.exit(1);
    }
    const content = await res.text();
    writeFileSync(targetPath, content, "utf-8");
    console.log(chalk.green(`✔ Created ${file.target}`));
  }

  // Install npm dependencies
  if (entry.dependencies.length > 0) {
    const pm = detectPackageManager(cwd);
    const cmd = installCommand(pm, entry.dependencies);
    console.log(chalk.dim(`  Installing deps: ${entry.dependencies.join(", ")}`));
    execSync(cmd, { stdio: "inherit", cwd });
  }

  console.log(chalk.green(`\n✔ ${entry.name} added successfully.`));
}
