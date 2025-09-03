// Mock for react-native
module.exports = {
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios || obj.default,
  },
  NativeModules: {},
  NativeEventEmitter: class MockNativeEventEmitter {
    addListener() {
      return { remove: () => {} };
    }
    removeAllListeners() {}
  },
  Dimensions: {
    get: () => ({ width: 375, height: 667 }),
    addEventListener: () => {},
    removeEventListener: () => {},
  },
  Alert: {
    alert: () => {},
  },
};