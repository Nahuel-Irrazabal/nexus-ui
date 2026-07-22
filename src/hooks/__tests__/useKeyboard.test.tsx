/**
 * useKeyboard Hook Tests
 * El mock global de react-native (jest.setup.js) no captura los callbacks
 * registrados en Keyboard.addListener, así que este archivo sobreescribe
 * el mock localmente para poder disparar los eventos de teclado a mano.
 */

import { act, renderHook } from '@testing-library/react-native';

type KeyboardCallback = (event: { endCoordinates: { height: number } }) => void;

const listeners: Record<string, KeyboardCallback[]> = {};
const removeMocks: Record<string, jest.Mock[]> = {};

function emit(eventName: string, event: { endCoordinates: { height: number } }) {
  (listeners[eventName] ?? []).forEach((cb) => cb(event));
}

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
    create: (styles: any) => styles,
    flatten: (style: any) => Object.assign({}, ...[].concat(style).filter(Boolean)),
  },
  Keyboard: {
    addListener: jest.fn((eventName: string, callback: KeyboardCallback) => {
      listeners[eventName] = listeners[eventName] ?? [];
      listeners[eventName].push(callback);
      const remove = jest.fn();
      removeMocks[eventName] = removeMocks[eventName] ?? [];
      removeMocks[eventName].push(remove);
      return { remove };
    }),
  },
  useColorScheme: jest.fn(() => 'light'),
  Platform: { OS: 'ios', select: (obj: any) => obj.ios || obj.default },
}));

import { useKeyboard } from '../useKeyboard';

describe('useKeyboard', () => {
  beforeEach(() => {
    Object.keys(listeners).forEach((key) => delete listeners[key]);
    Object.keys(removeMocks).forEach((key) => delete removeMocks[key]);
  });

  it('inicia con keyboardShown=false y keyboardHeight=0', () => {
    const { result } = renderHook(() => useKeyboard());
    expect(result.current.keyboardShown).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);
  });

  it('se suscribe a los 4 eventos de teclado (iOS + Android)', () => {
    renderHook(() => useKeyboard());
    expect(listeners['keyboardWillShow']).toHaveLength(1);
    expect(listeners['keyboardWillHide']).toHaveLength(1);
    expect(listeners['keyboardDidShow']).toHaveLength(1);
    expect(listeners['keyboardDidHide']).toHaveLength(1);
  });

  it('keyboardWillShow (iOS) actualiza shown y height', () => {
    const { result } = renderHook(() => useKeyboard());
    act(() => {
      emit('keyboardWillShow', { endCoordinates: { height: 300 } });
    });
    expect(result.current.keyboardShown).toBe(true);
    expect(result.current.keyboardHeight).toBe(300);
  });

  it('keyboardWillHide (iOS) resetea shown y height', () => {
    const { result } = renderHook(() => useKeyboard());
    act(() => {
      emit('keyboardWillShow', { endCoordinates: { height: 300 } });
    });
    act(() => {
      emit('keyboardWillHide', { endCoordinates: { height: 0 } });
    });
    expect(result.current.keyboardShown).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);
  });

  it('keyboardDidShow (fallback Android) actualiza shown y height', () => {
    const { result } = renderHook(() => useKeyboard());
    act(() => {
      emit('keyboardDidShow', { endCoordinates: { height: 250 } });
    });
    expect(result.current.keyboardShown).toBe(true);
    expect(result.current.keyboardHeight).toBe(250);
  });

  it('keyboardDidHide (fallback Android) resetea shown y height', () => {
    const { result } = renderHook(() => useKeyboard());
    act(() => {
      emit('keyboardDidShow', { endCoordinates: { height: 250 } });
    });
    act(() => {
      emit('keyboardDidHide', { endCoordinates: { height: 0 } });
    });
    expect(result.current.keyboardShown).toBe(false);
    expect(result.current.keyboardHeight).toBe(0);
  });

  it('desmontar el hook remueve los 4 listeners suscriptos', () => {
    const { unmount } = renderHook(() => useKeyboard());

    expect(removeMocks['keyboardWillShow'][0]).not.toHaveBeenCalled();

    unmount();

    expect(removeMocks['keyboardWillShow'][0]).toHaveBeenCalledTimes(1);
    expect(removeMocks['keyboardWillHide'][0]).toHaveBeenCalledTimes(1);
    expect(removeMocks['keyboardDidShow'][0]).toHaveBeenCalledTimes(1);
    expect(removeMocks['keyboardDidHide'][0]).toHaveBeenCalledTimes(1);
  });
});
