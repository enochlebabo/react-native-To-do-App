const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Metro doesn't watch the src folder as if it were routes
config.watchFolders = [__dirname];
config.resolver.blockList = [
  /.*\/app\/src\/.*/,  // block any src inside app
];

module.exports = config;
