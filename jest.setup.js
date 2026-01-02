/**
 * Jest Setup
 * Configuración global para tests
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock React Native components
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  Image: 'Image',
  ScrollView: 'ScrollView',
  StyleSheet: {
    create: (styles) => styles,
  },
  Animated: {
    Value: jest.fn(() => ({
      interpolate: jest.fn(() => ({})),
    })),
    timing: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    View: 'Animated.View',
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
    addEventListener: jest.fn(),
  },
  Keyboard: {
    addListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
  },
  useColorScheme: jest.fn(() => 'light'),
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios || obj.default,
  },
}));

// Mock react-native-safe-area-context (solo si existe)
try {
  jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  }));
} catch (e) {
  // Si no está instalado, ignorar
}

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

