/**
 * Avatar Component
 * Muestra imagen de perfil con fallback a iniciales y soporte para badges
 */

import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';

type AvatarSize = 'xs' | 'small' | 'medium' | 'large' | 'xl' | number;
type AvatarShape = 'circle' | 'square' | 'rounded';

export interface AvatarProps {
  source?: ImageSourcePropType;
  size?: AvatarSize;
  fallback?: string; // Iniciales o emoji
  badge?: React.ReactNode;
  onPress?: () => void;
  shape?: AvatarShape;
  style?: ViewStyle;
  testID?: string;
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

const getBorderRadius = (shape: AvatarShape, size: number): number => {
  switch (shape) {
    case 'circle':
      return size / 2;
    case 'square':
      return 0;
    case 'rounded':
      return size * 0.2;
  }
};

const getFontSize = (size: number): number => {
  return size * 0.4;
};

export function Avatar({
  source,
  size = 'medium',
  fallback,
  badge,
  onPress,
  shape = 'circle',
  style,
  testID,
}: AvatarProps) {
  const { theme } = useTheme();
  const avatarSize = getSize(size);
  const borderRadius = getBorderRadius(shape, avatarSize);
  const fontSize = getFontSize(avatarSize);

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const content = (
    <View style={[containerStyle, style]} testID={testID}>
      {source ? (
        <Image
          source={source}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={{
            fontSize,
            fontWeight: '600',
            color: theme.text,
          }}
        >
          {fallback || '?'}
        </Text>
      )}
      
      {badge && (
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
          }}
        >
          {badge}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

// Avatar Group Component
interface AvatarGroupProps {
  children: React.ReactElement<AvatarProps>[];
  max?: number;
  size?: AvatarSize;
  spacing?: number;
  style?: ViewStyle;
}

export function AvatarGroup({
  children,
  max = 3,
  size = 'medium',
  spacing: spacingProp = -8,
  style,
}: AvatarGroupProps) {
  const { theme } = useTheme();
  const avatars = React.Children.toArray(children) as React.ReactElement<AvatarProps>[];
  const displayAvatars = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);
  const avatarSize = getSize(size);

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
          <Avatar
            size={size}
            fallback={`+${remaining}`}
            shape="circle"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

