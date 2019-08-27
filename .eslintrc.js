module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  plugins: [
    "@typescript-eslint",
    "prettier"
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        semi: false,
        singleQuote: true,
      }
    ],
    "@typescript-eslint/explicit-function-return-type": "off"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json"
  }
}
