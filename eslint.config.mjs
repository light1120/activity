import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

export default typescriptEslint.config(
  { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      // 通用
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      indent: ['error', 2], // 要求使用 2 个空格缩进
      quotes: ['error', 'single'], // 要求使用单引号
      semi: ['error', 'never'], //
      // typescript 规则
      '@typescript-eslint/no-explicit-any': 'off', // 不允许使用 any
      '@typescript-eslint/no-unused-vars': 'error', // 不允许未使用的变量
      '@typescript-eslint/no-empty-interface': 'error', // 不允许使用空接口
      // vue3 规则
      'vue/component-name-in-template-casing': ['error', 'PascalCase'], // 要求组件名称以 PascalCase 格式命名
      'vue/no-mutating-props': 'error', // 不允许修改 props
      'vue/v-bind-style': 'error', // 要求使用 : 而不是 v-bind
      'vue/v-on-style': 'error', // 要求使用 @ 而不是 v-on
      'vue/no-unused-vars': 'error', // 不允许未使用的变量
    },
  },
  eslintConfigPrettier
)
