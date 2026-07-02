/**
 * Sheet Component
 * Bottom sheet con backdrop y animación deslizante desde abajo
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Modal as RNModal,
  View,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { borderRadius } from '../../../tokens/borderRadius';
import { getShadow } from '../../../tokens/shadows';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  dismissible?: boolean;
  children?: ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export function Sheet({
  visible,
  onClose,
  dismissible = true,
  children,
  style,
  testID,
}: SheetProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setMounted(false);
      });
    }
  }, [visible, translateY]);

  if (!mounted) {
    return null;
  }

  const handleBackdropPress = () => {
    if (dismissible) {
      onClose();
    }
  };

  return (
    <RNModal
      visible
      transparent
      animationType="none"
      onRequestClose={dismissible ? onClose : undefined}
      testID={testID}
    >
      <Pressable style={[styles.backdrop, { backgroundColor: theme.overlay }]} onPress={handleBackdropPress}>
        <Animated.View
          style={[styles.sheetWrapper, { transform: [{ translateY }] }]}
        >
          <Pressable
            style={[
              styles.sheet,
              { backgroundColor: theme.surface, paddingBottom: insets.bottom + spacing.lg },
              getShadow('xl', isDark),
              style,
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.handle, { backgroundColor: theme.border }]} />
            {children}
          </Pressable>
        </Animated.View>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetWrapper: {
    width: '100%',
  },
  sheet: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
});
