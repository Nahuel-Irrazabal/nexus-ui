/**
 * Card Component
 * Contenedor versátil y composable para contenido
 */

import React, { ReactNode } from 'react';
import { 
  View, 
  Pressable, 
  StyleSheet, 
  Image, 
  ImageSourcePropType,
  ViewStyle,
  PressableProps,
  Text,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { textVariants } from '../../../tokens/typography';

export type CardVariant = 'flat' | 'elevated' | 'outlined';

export interface CardProps extends Omit<PressableProps, 'style'> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof spacing | 'none';
  style?: ViewStyle;
}

interface CardComposition {
  Image: typeof CardImage;
  Content: typeof CardContent;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Actions: typeof CardActions;
}

export const Card: React.FC<CardProps> & CardComposition = ({
  children,
  variant = 'elevated',
  padding = 'none',
  onPress,
  style,
  ...props
}) => {
  const { theme, isDark } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'flat':
        return {
          backgroundColor: theme.surface,
        };
      case 'elevated':
        return {
          backgroundColor: theme.surface,
          shadowColor: isDark ? '#000' : theme.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 2,
        };
      case 'outlined':
        return {
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
        };
      default:
        return {};
    }
  };

  const cardStyle: ViewStyle = {
    ...getVariantStyles(),
    padding: padding !== 'none' ? spacing[padding] : 0,
  };

  if (onPress) {
    return (
      <Pressable
        {...props}
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          cardStyle,
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, cardStyle, style]}>
      {children}
    </View>
  );
};

// Sub-componentes

export interface CardImageProps {
  source: ImageSourcePropType;
  aspectRatio?: number;
  style?: any; // ImageStyle with aspectRatio
}

function CardImage({ source, aspectRatio = 16 / 9, style }: CardImageProps) {
  return (
    <Image
      source={source}
      style={[
        styles.image,
        { aspectRatio },
        style,
      ] as any}
      resizeMode="cover"
    />
  );
}

export interface CardContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

function CardContent({ children, style }: CardContentProps) {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
}

export interface CardTitleProps {
  children: ReactNode;
  numberOfLines?: number;
}

function CardTitle({ children, numberOfLines = 2 }: CardTitleProps) {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        styles.title,
        { color: theme.text },
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

export interface CardDescriptionProps {
  children: ReactNode;
  numberOfLines?: number;
}

function CardDescription({ children, numberOfLines = 3 }: CardDescriptionProps) {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        styles.description,
        { color: theme.textSecondary },
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

export interface CardActionsProps {
  children: ReactNode;
  style?: ViewStyle;
}

function CardActions({ children, style }: CardActionsProps) {
  return (
    <View style={[styles.actions, style]}>
      {children}
    </View>
  );
}

// Asignar sub-componentes
Card.Image = CardImage;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Actions = CardActions;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: textVariants.h4.fontSize,
    fontWeight: textVariants.h4.fontWeight,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: textVariants.body.fontSize,
    lineHeight: textVariants.body.lineHeight,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
});

