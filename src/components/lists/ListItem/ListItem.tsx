/**
 * ListItem Component
 * Item de lista versátil y consistente
 */

import React, { ReactNode } from 'react';
import { 
  View, 
  Pressable, 
  StyleSheet, 
  PressableProps,
  ViewStyle,
  Text,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { textVariants } from '../../../tokens/typography';

// Tipo para iconos de Ionicons (compatible sin instalar @expo/vector-icons)
type IoniconsName = string;

export interface ListItemProps extends Omit<PressableProps, 'style'> {
  title: string;
  description?: string;
  leftIcon?: IoniconsName;
  rightIcon?: IoniconsName;
  leftAvatar?: ReactNode;
  rightComponent?: ReactNode;
  badge?: ReactNode;
  multiline?: boolean;
  divider?: boolean;
  style?: ViewStyle;
}

export function ListItem({
  title,
  description,
  leftIcon,
  rightIcon,
  leftAvatar,
  rightComponent,
  badge,
  multiline = false,
  divider = true,
  onPress,
  style,
  ...props
}: ListItemProps) {
  const { theme } = useTheme();

  const content = (
    <>
      {/* Left */}
      {(leftIcon || leftAvatar) && (
        <View style={styles.leftContainer}>
          {leftIcon && (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.primary + '20' },
              ]}
            >
              <Text style={{ fontSize: 20, color: theme.primary }}>
                {leftIcon}
              </Text>
            </View>
          )}
          {leftAvatar}
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              { color: theme.text },
            ]}
            numberOfLines={multiline ? undefined : 1}
          >
            {title}
          </Text>
          {badge}
        </View>
        {description && (
          <Text
            style={[
              styles.description,
              { color: theme.textSecondary },
            ]}
            numberOfLines={multiline ? undefined : 2}
          >
            {description}
          </Text>
        )}
      </View>

      {/* Right */}
      {(rightIcon || rightComponent) && (
        <View style={styles.rightContainer}>
          {rightComponent || (
            <Text style={{ fontSize: 20, color: theme.textSecondary }}>
              {rightIcon}
            </Text>
          )}
        </View>
      )}
    </>
  );

  const itemStyle: ViewStyle = {
    backgroundColor: theme.surface,
    borderBottomWidth: divider ? 1 : 0,
    borderBottomColor: theme.border,
  };

  if (onPress) {
    return (
      <Pressable
        {...props}
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          itemStyle,
          pressed && { backgroundColor: theme.surfaceVariant },
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, itemStyle, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    minHeight: 56,
  },
  leftContainer: {
    marginRight: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: textVariants.body.fontSize,
    fontWeight: textVariants.body.fontWeight,
    flex: 1,
  },
  description: {
    fontSize: textVariants.caption.fontSize,
    marginTop: spacing.xxs,
  },
  rightContainer: {
    marginLeft: spacing.md,
  },
});

