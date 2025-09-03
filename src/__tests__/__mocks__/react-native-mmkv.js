// Mock for react-native-mmkv
class MockMMKV {
  constructor() {
    this.storage = new Map();
  }

  set(key, value) {
    this.storage.set(key, value);
  }

  getString(key) {
    return this.storage.get(key) || null;
  }

  delete(key) {
    this.storage.delete(key);
  }

  clearAll() {
    this.storage.clear();
  }

  getAllKeys() {
    return Array.from(this.storage.keys());
  }
}

module.exports = {
  MMKV: MockMMKV,
};