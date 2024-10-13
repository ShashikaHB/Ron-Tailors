module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb', // Air BnB style guide is followed as a guideline
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended', // Prettier lint configs
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './Frontend/tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'header', 'unused-imports'],
  overrides: [
    {
      files: ['*.js', '*.ts', '*.tsx'],
      rules: {
        'header/header': [
          2,
          'block',
          [
            ' *',
            ' * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.',
            ' *',
            ' * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns',
            ' * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd',
            ' ',
          ],
        ],
      },
    },
  ],
  rules: {
    // Extend any overrides from the above extended lint packages here.
    'react/jsx-props-no-spreading': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react-hooks/exhaustive-deps': 0,
    'unused-imports/no-unused-imports': 'error',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'react/require-default-props': 0,
    'no-console': 'warn', // Added rule to disallow console statements
    '@typescript-eslint/no-explicit-any': 'off', // Disabled rule for no-explicit-any
    'react/no-array-index-key': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
  },
};
