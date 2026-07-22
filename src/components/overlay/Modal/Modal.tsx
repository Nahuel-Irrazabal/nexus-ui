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
  StyleProp,
  DimensionValue,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { borderRadius } from '../../../tokens/borderRadius';
import { fontSizes } from '../../../tokens/typography';

type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';
type AnimationType = 'fade' | 'slide' | 'none';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  size?: ModalSize;
  dismissible?: boolean;
  animationType?: AnimationType;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const MODAL_SIZES: Record<ModalSize, DimensionValue> = {
  small: '70%',
  medium: '85%',
  large: '95%',
  fullscreen: '100%',
};

function ModalBase({
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
        <View
          style={[styles.fullscreenContainer, { backgroundColor: theme.background }, style]}
          accessibilityViewIsModal
        >
          {children}
        </View>
      ) : (
        <Pressable
          style={[styles.backdrop, { backgroundColor: theme.overlay }]}
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
            accessibilityViewIsModal
          >
            {children}
          </Pressable>
        </Pressable>
      )}
    </RNModal>
  );
}

ModalBase.displayName = 'Modal';

interface ModalComposition {
  Header: typeof ModalHeader;
  Title: typeof ModalTitle;
  CloseButton: typeof ModalCloseButton;
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
}

type ModalComponent = React.MemoExoticComponent<typeof ModalBase> & ModalComposition;

export const Modal = React.memo(ModalBase) as ModalComponent;
Modal.displayName = 'Modal';

// Modal subcomponents
interface ModalHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ModalHeader = React.memo(function ModalHeader({ children, style }: ModalHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: theme.border }, style]}>
      {children}
    </View>
  );
});
ModalHeader.displayName = 'ModalHeader';

interface ModalTitleProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const ModalTitle = React.memo(function ModalTitle({ children, style }: ModalTitleProps) {
  const { theme } = useTheme();

  return (
    <Text style={[styles.title, { color: theme.text }, style]}>
      {children}
    </Text>
  );
});
ModalTitle.displayName = 'ModalTitle';

interface ModalCloseButtonProps {
  onPress?: () => void;
  /** Label de accesibilidad del botón de cierre. Por defecto 'Cerrar'. */
  accessibilityLabel?: string;
}

const ModalCloseButton = React.memo(function ModalCloseButton({
  onPress,
  accessibilityLabel = 'Cerrar',
}: ModalCloseButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.closeButton}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={{ fontSize: fontSizes.xxxl, color: theme.textSecondary }}>×</Text>
    </TouchableOpacity>
  );
});
ModalCloseButton.displayName = 'ModalCloseButton';

interface ModalContentProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ModalContent = React.memo(function ModalContent({ children, scrollable = false, style }: ModalContentProps) {
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
});
ModalContent.displayName = 'ModalContent';

interface ModalFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ModalFooter = React.memo(function ModalFooter({ children, style }: ModalFooterProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.footer, { borderTopColor: theme.border }, style]}>
      {children}
    </View>
  );
});
ModalFooter.displayName = 'ModalFooter';

// Asignar sub-componentes
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.CloseButton = ModalCloseButton;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    maxHeight: '90%',
    borderRadius: borderRadius.xl,
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
    fontSize: fontSizes.xxl,
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

