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
  ImageStyle,
  StyleProp,
  PressableProps,
  Text,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { textVariants } from '../../../tokens/typography';
import { borderRadius } from '../../../tokens/borderRadius';
import { getShadow } from '../../../tokens/shadows';

export type CardVariant = 'flat' | 'elevated' | 'outlined';

export interface CardProps extends Omit<PressableProps, 'style'> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof spacing | 'none';
  style?: StyleProp<ViewStyle>;
}

interface CardComposition {
  Image: typeof CardImage;
  Content: typeof CardContent;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Actions: typeof CardActions;
}

const CardBase = React.forwardRef<View, CardProps>(({
  children,
  variant = 'elevated',
  padding = 'none',
  onPress,
  style,
  accessibilityRole,
  testID,
  ...props
}, ref) => {
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
          ...getShadow('sm', isDark),
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
        ref={ref}
        {...props}
        testID={testID}
        onPress={onPress}
        accessibilityRole={accessibilityRole ?? 'button'}
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
    <View
      ref={ref}
      testID={testID}
      accessibilityRole={accessibilityRole}
      style={[styles.card, cardStyle, style]}
    >
      {children}
    </View>
  );
});

CardBase.displayName = 'Card';

type CardComponent = React.MemoExoticComponent<typeof CardBase> & CardComposition;

export const Card = React.memo(CardBase) as CardComponent;
Card.displayName = 'Card';

// Sub-componentes

export interface CardImageProps {
  source: ImageSourcePropType;
  aspectRatio?: number;
  style?: StyleProp<ImageStyle>;
}

const CardImage = React.memo(function CardImage({ source, aspectRatio = 16 / 9, style }: CardImageProps) {
  return (
    <Image
      source={source}
      style={[
        styles.image,
        { aspectRatio },
        style,
      ]}
      resizeMode="cover"
    />
  );
});
CardImage.displayName = 'CardImage';

export interface CardContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CardContent = React.memo(function CardContent({ children, style }: CardContentProps) {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
});
CardContent.displayName = 'CardContent';

export interface CardTitleProps {
  children: ReactNode;
  numberOfLines?: number;
}

const CardTitle = React.memo(function CardTitle({ children, numberOfLines = 2 }: CardTitleProps) {
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
});
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps {
  children: ReactNode;
  numberOfLines?: number;
}

const CardDescription = React.memo(function CardDescription({ children, numberOfLines = 3 }: CardDescriptionProps) {
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
});
CardDescription.displayName = 'CardDescription';

export interface CardActionsProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CardActions = React.memo(function CardActions({ children, style }: CardActionsProps) {
  return (
    <View style={[styles.actions, style]}>
      {children}
    </View>
  );
});
CardActions.displayName = 'CardActions';

// Asignar sub-componentes
Card.Image = CardImage;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Actions = CardActions;

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
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
    fontSize: textVariants.title.fontSize,
    fontWeight: textVariants.title.fontWeight,
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

