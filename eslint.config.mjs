import next from "eslint-config-next/core-web-vitals";
const config = [
  ...next,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  { rules: { "@next/next/no-img-element": "off" } },
];

export default config;
