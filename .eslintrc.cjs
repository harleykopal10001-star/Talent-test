module.exports = {
  root: true,
  env: { es2022: true },
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  rules: {
    'import/extensions': ['error', 'ignorePackages', { js: 'always', jsx: 'always' }],
  },
  overrides: [
    {
      files: ['backend/**/*.js'],
      extends: ['airbnb-base'],
      env: { node: true },
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      rules: {
        'import/extensions': ['error', 'ignorePackages', { js: 'always', jsx: 'always' }],
      },
    },
    {
      files: ['backend/**/*.test.js'],
      env: { jest: true },
      rules: { 'import/no-extraneous-dependencies': ['error', { devDependencies: true }] },
    },
    {
      files: ['frontend/**/*.{js,jsx}', 'shared/**/*.js'],
      extends: ['airbnb', 'airbnb/hooks'],
      env: { browser: true, es2022: true },
      settings: { react: { version: 'detect' } },
      parserOptions: { ecmaVersion: 2022, sourceType: 'module', ecmaFeatures: { jsx: true } },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
        'react/jsx-props-no-spreading': 'off',
        'react/function-component-definition': ['error', {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        }],
        'import/extensions': ['error', 'ignorePackages', { js: 'always', jsx: 'always' }],
      },
    },
    {
      files: ['frontend/**/*.test.jsx', 'frontend/vitest.setup.js'],
      env: { jest: true },
      rules: { 'import/no-extraneous-dependencies': ['error', { devDependencies: true }] },
    },
  ],
};
