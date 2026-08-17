const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Enable modern package exports for Metro bundler
config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, { input: "./src/global.css" });
