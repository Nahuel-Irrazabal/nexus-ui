/**
 * Avatar Component
 * Muestra imagen de perfil con fallback a iniciales y soporte para badges
 */

import React, { forwardRef, memo } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { borderRadius } from '../../../tokens/borderRadius';
import { fontWeights } from '../../../tokens/typography';

type AvatarSize = 'xs' | 'small' | 'medium' | 'large' | 'xl' | number;
type AvatarShape = 'circle' | 'square' | 'rounded';

export interface AvatarProps {
  source?: ImageSourcePropType;
  size?: AvatarSize;
  fallback?: string; // Iniciales o emoji
  badge?: React.ReactNode;
  onPress?: () => void;
  shape?: AvatarShape;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** Label de accesibilidad. Si no se pasa, se usa `fallback` como fallback. */
  accessibilityLabel?: string;
}

const AVATAR_SIZES = {
  xs: 24,
  small: 32,
  medium: 40,
  large: 56,
  xl: 80,
};

const getSize = (size: AvatarSize): number => {
  if (typeof size === 'number') return size;
  return AVATAR_SIZES[size];
};

const getAvatarRadius = (shape: AvatarShape, size: number): number => {
  switch (shape) {
    case 'circle':
      return borderRadius.full;
    case 'square':
      return borderRadius.none;
    case 'rounded':
      return size * 0.2;
  }
};

const getFontSize = (size: number): number => {
  return size * 0.4;
};

const AvatarBase = forwardRef<View, AvatarProps>(function Avatar(
  {
    source,
    size = 'medium',
    fallback,
    badge,
    onPress,
    shape = 'circle',
    style,
    testID,
    accessibilityLabel,
  },
  ref
) {
  const { theme } = useTheme();
  const avatarSize = getSize(size);
  const avatarRadius = getAvatarRadius(shape, avatarSize);
  const fontSize = getFontSize(avatarSize);
  const resolvedLabel = accessibilityLabel ?? fallback;

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarRadius,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const content = (
    <View
      ref={ref}
      style={[containerStyle, style]}
      testID={testID}
      // Cuando hay onPress, la accesibilidad se declara en el TouchableOpacity
      // que envuelve este View, para no duplicar el foco/anuncio del screen reader.
      accessibilityRole={onPress ? undefined : 'image'}
      accessibilityLabel={onPress ? undefined : resolvedLabel}
    >
      {source ? (
        <Image source={source} style={styles.image} resizeMode="cover" />
      ) : (
        <Text style={[styles.fallbackText, { fontSize, color: theme.text }]}>
          {fallback || '?'}
        </Text>
      )}

      {badge && <View style={styles.badgeContainer}>{badge}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={resolvedLabel}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
});

AvatarBase.displayName = 'Avatar';

export const Avatar = memo(AvatarBase);
Avatar.displayName = 'Avatar';

// Avatar Group Component
interface AvatarGroupProps {
  children: React.ReactElement<AvatarProps>[];
  max?: number;
  size?: AvatarSize;
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

function AvatarGroupBase({
  children,
  max = 3,
  size = 'medium',
  spacing: spacingProp = -spacing.sm,
  style,
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children) as React.ReactElement<AvatarProps>[];
  const displayAvatars = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);

  return (
    <View style={[styles.groupContainer, style]}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={index}
          style={{
            marginLeft: index > 0 ? spacingProp : 0,
            zIndex: displayAvatars.length - index,
          }}
        >
          {React.cloneElement(avatar, { size })}
        </View>
      ))}

      {remaining > 0 && (
        <View
          style={{
            marginLeft: spacingProp,
            zIndex: 0,
          }}
        >
          <Avatar size={size} fallback={`+${remaining}`} shape="circle" />
        </View>
      )}
    </View>
  );
}

AvatarGroupBase.displayName = 'AvatarGroup';

export const AvatarGroup = memo(AvatarGroupBase);
AvatarGroup.displayName = 'AvatarGroup';

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackText: {
    fontWeight: fontWeights.semibold,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -spacing.xxs,
    right: -spacing.xxs,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
