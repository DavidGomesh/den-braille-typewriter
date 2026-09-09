module.exports = {
    env: {
        browser: true,
        es2022: true,
        node: true,
    },
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react-hooks'],
    rules: {
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            rules: {
                '@typescript-eslint/ban-ts-comment': [
                    'error',
                    {
                        'ts-check': false,
                        'ts-expect-error': 'allow-with-description',
                        'ts-ignore': true,
                        'ts-nocheck': true,
                        minimumDescriptionLength: 10,
                    },
                ],
                '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
            },
        },
        {
            files: [
                'src/tests/**/*.{js,jsx,ts,tsx}',
                'tests/**/*.{js,jsx,ts,tsx}',
            ],
            extends: ['plugin:testing-library/react'],
        },
    ],
}
