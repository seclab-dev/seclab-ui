import { resolve } from "node:path";

export const repositoryRoot = resolve(import.meta.dirname, "..");
export const packageDirectories = [
  "packages/tokens",
  "packages/icons",
  "packages/suite-sdk",
  "packages/vue",
  "packages/react",
];
export const packageNames = [
  "@seclab-dev/tokens",
  "@seclab-dev/icons",
  "@seclab-dev/suite-sdk",
  "@seclab-dev/vue",
  "@seclab-dev/react",
];
