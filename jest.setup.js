/**
 * Jest Setup
 * Configuración global para tests
 */

// React Native inyecta este global via Metro/babel-plugin-transform-define en
// runtime real. En el entorno de test (sin preset react-native) no existe, y
// cualquier componente que lo referencie (ej. ErrorBoundary) revienta con
// "__DEV__ is not defined" apenas se lo renderiza.
global.__DEV__ = true;

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
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  Pressable: 'Pressable',
  Image: 'Image',
  ScrollView: 'ScrollView',
  Switch: 'Switch',
  Modal: 'Modal',
  ActivityIndicator: 'ActivityIndicator',
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) =>
      Object.assign({}, ...[].concat(style).filter(Boolean)),
  },
  Animated: {
    Value: jest.fn(() => ({
      interpolate: jest.fn(() => ({})),
    })),
    timing: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    spring: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    sequence: jest.fn(() => ({
      start: jest.fn((callback) => callback && callback()),
    })),
    // loop() es intencionalmente un no-op en tests: en runtime real repite la
    // animación indefinidamente, lo que causaría una recursión síncrona
    // infinita con los mocks de timing/sequence de arriba (su start()
    // invoca el callback inmediatamente).
    loop: jest.fn(() => ({
      start: jest.fn(),
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

