#!/usr/bin/env node
import { Command } from "commander";
import { add } from "./commands/add";
import { init } from "./commands/init";
import { list } from "./commands/list";

const program = new Command();

program
  .name("rn-ui")
  .description("Add rn-ui components to your Expo project")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize rn-ui in your project (creates lib/utils.ts, installs deps)")
  .action(init);

program
  .command("add <component>")
  .description("Add a component to your project")
  .action(add);

program
  .command("list")
  .description("List all available components")
  .action(list);

program.parse();
