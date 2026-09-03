module.exports =  {
    
    testEnvironment: "jsdom",

    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], 

    transform: { "^.+\\.[jt]sx?$": "babel-jest" },

    testMatch: ["<rootDir>/src/**/*.test.jsx", "<rootDir>/src/**/*.test.js" ],

    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|svg|webp)$": "<rootDir>/src/_mocks_/fileMock.js",
        "\\.(css|less|scss|sass)$": "<rootDir>/src/_mocks_/styleMock.js"
    },

    testPathIgnorePatterns: ["/node_modules/", "/dist/"]
}
