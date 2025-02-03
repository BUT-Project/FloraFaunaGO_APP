const { getDefaultConfig } = require("expo/metro-config");
const {
    wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = wrapWithReanimatedMetroConfig({
    ...config,
    resolver: {
        ...config.resolver,
        // This makes it possible to import .glb files in your code:
        sourceExts: [...config.resolver.sourceExts, "cjs"],
        assetExts: ["glb", "ktx", "filamat", ...(config.resolver.assetExts || [])],
        assets: ["./assets/models", ...(config.resolver.assets || [])],
    },
});