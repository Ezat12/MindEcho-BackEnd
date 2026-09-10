import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  verbose: true,
  clearMocks: true,

  moduleNameMapper: {
    "^(\\w+)/(.*)\\.js$": "<rootDir>/src/$1/$2.ts",

    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
