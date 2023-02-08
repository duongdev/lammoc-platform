/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'prettier',
  ],
  rules: {
    'no-unused-vars': [
      'warn',
      {
        vars: 'all',
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/semi': ['off'],
    'max-len': [
      'warn',
      {
        code: 80,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '{react,react-dom,@remix-run}{/**,}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: `~{/**,}`,
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
      },
    ],
  },
  // We're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but we have to
  // set the jest version explicitly.
  settings: {
    jest: {
      version: 28,
    },
  },
}
