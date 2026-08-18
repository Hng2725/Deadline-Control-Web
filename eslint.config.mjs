import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([".next/**", ".gitnexus/**", "next-env.d.ts", "coverage/**", "playwright-report/**", "test-results/**"]),
];

export default config;
