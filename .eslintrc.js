module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/newline-after-import': 'off',
    'import/no-dynamic-require': 'off',
    'import/prefer-default-export': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/no-array-index-key': 'off',
    'array-callback-return': 'off',
    'import/no-named-as-default': 'off',
    'func-names': 'off',
    'no-restricted-syntax': 'off',
    'no-prototype-builtins': 'off',
    'prefer-template': 'off',
    'class-methods-use-this': 'off',
    'no-extra-boolean-cast': 'off',
    'spaced-comment': 'off',
    'consistent-return': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.js'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
