import chalk from "chalk";
import { listComponents } from "../registry";

export function list() {
  const components = listComponents();
  console.log(chalk.bold("\nAvailable components:\n"));
  components.forEach((c) => {
    console.log(`  ${chalk.cyan(c.name.padEnd(20))} ${chalk.dim(c.description)}`);
  });
  console.log();
}
