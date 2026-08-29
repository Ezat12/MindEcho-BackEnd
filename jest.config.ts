import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],

  testMatch: ["**/*.test.ts", "**/*.spec.ts"],

  verbose: true,

  clearMocks: true,
};

export default config;
