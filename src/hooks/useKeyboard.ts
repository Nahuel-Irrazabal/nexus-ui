/**
 * useKeyboard Hook
 * Detecta el estado del teclado (mostrado/oculto) y su altura
 */

import { useState, useEffect } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

interface KeyboardInfo {
  keyboardShown: boolean;
  keyboardHeight: number;
}

export function useKeyboard(): KeyboardInfo {
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardShown(true);
      setKeyboardHeight(event.endCoordinates.height);
    };

    const handleKeyboardHide = () => {
      setKeyboardShown(false);
      setKeyboardHeight(0);
    };

    // iOS events
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      handleKeyboardShow
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      handleKeyboardHide
    );

    // Android events (fallback)
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return {
    keyboardShown,
    keyboardHeight,
  };
}

