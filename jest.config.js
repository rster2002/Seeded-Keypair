module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "@/(.*)$": "<rootDir>/src/$1",
    },
    setupFiles: [
        "./tests/setup.js",
    ],
    transformIgnorePatterns: [],
}
