module.exports = {
    moduleNameMapper: {
        '\\.(css|ttf)$': '<rootDir>/scripts/jest-asset-stub.cjs',
    },
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[jt]sx?$': ['babel-jest', {
            presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
            ],
        }],
    },
}
