module.exports = {
    roots: [
        "<rootDir>/src"
    ],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx)",
        "**/?(*.)+(spec|test).+(ts|tsx)"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    collectCoverageFrom: [
        "**/*.{js,jsx,ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
    ],
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
        },
    },
}