import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

// React 버전 설정 추가
pluginReactConfig.settings = {
  react: {
    version: "18.2.0",
  },
};

export default {
  extends: [
    "plugin:react/recommended",
    "plugin:prettier/recommended", // 순서가 중요함 가장 뒤에
  ],
  rules: {
    "prettier/prettier": "error",
  },
  plugins: [
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReactConfig,
  ],
};
