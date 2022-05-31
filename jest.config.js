export default {
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "@/(.*)$": "<rootDir>/src/$1",
    },
    setupFiles: [
        "./test/setup.js",
    ],
    transformIgnorePatterns: [],
}