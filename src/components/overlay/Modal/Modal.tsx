/**
 * Modal Component
 * Modal flexible y composable con animaciones
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';

type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';
type AnimationType = 'fade' | 'slide' | 'none';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  size?: ModalSize;
  dismissible?: boolean;
  animationType?: AnimationType;
  children?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

const MODAL_SIZES = {
  small: '70%',
  medium: '85%',
  large: '95%',
  fullscreen: '100%',
};

export function Modal({
  visible,
  onClose,
  size = 'medium',
  dismissible = true,
  animationType = 'slide',
  children,
  style,
  testID,
}: ModalProps) {
  const { theme } = useTheme();

  const handleBackdropPress = () => {
    if (dismissible) {
      onClose();
    }
  };

  const modalWidth = MODAL_SIZES[size];
  const isFullscreen = size === 'fullscreen';

  return (
    <RNModal
      visible={visible}
      transparent={!isFullscreen}
      animationType={animationType}
      onRequestClose={dismissible ? onClose : undefined}
      testID={testID}
    >
      {isFullscreen ? (
        <View style={[styles.fullscreenContainer, { backgroundColor: theme.background }, style]}>
          {children}
        </View>
      ) : (
        <Pressable
          style={styles.backdrop}
          onPress={handleBackdropPress}
        >
          <Pressable
            style={[
              styles.container,
              {
                width: modalWidth,
                backgroundColor: theme.surface,
              },
              style,
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {children}
          </Pressable>
        </Pressable>
      )}
    </RNModal>
  );
}

// Modal subcomponents
interface ModalHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

Modal.Header = function ModalHeader({ children, style }: ModalHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: theme.border }, style]}>
      {children}
    </View>
  );
};

interface ModalTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

Modal.Title = function ModalTitle({ children, style }: ModalTitleProps) {
  const { theme } = useTheme();

  return (
    <Text style={[styles.title, { color: theme.text }, style]}>
      {children}
    </Text>
  );
};

interface ModalCloseButtonProps {
  onPress?: () => void;
}

Modal.CloseButton = function ModalCloseButton({ onPress }: ModalCloseButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.closeButton}
    >
      <Text style={{ fontSize: 24, color: theme.textSecondary }}>×</Text>
    </TouchableOpacity>
  );
};

interface ModalContentProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

Modal.Content = function ModalContent({ children, scrollable = false, style }: ModalContentProps) {
  if (scrollable) {
    return (
      <ScrollView
        style={[styles.content, style]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
};

interface ModalFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

Modal.Footer = function ModalFooter({ children, style }: ModalFooterProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.footer, { borderTopColor: theme.border }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  fullscreenContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  content: {
    padding: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    padding: spacing.lg,
    borderTopWidth: 1,
  },
});

