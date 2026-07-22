/**
 * SkeletonLoader Component
 * Componente de carga placeholder con animaciones suaves
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { borderRadius as radiusTokens } from '../../../tokens/borderRadius';

export type SkeletonVariant = 'text' | 'avatar' | 'card' | 'image' | 'custom';
export type AnimationType = 'pulse' | 'wave' | 'none';

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  animation?: AnimationType;
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function SkeletonLoaderBase({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  borderRadius,
  style,
  testID,
}: SkeletonLoaderProps) {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation === 'pulse') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (animation === 'wave') {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [animation, animatedValue]);

  const getVariantStyles = (): any => {
    switch (variant) {
      case 'text':
        return {
          width: width || '100%',
          height: height || 16,
          borderRadius: borderRadius ?? radiusTokens.sm,
        };
      case 'avatar':
        return {
          width: width || 40,
          height: height || 40,
          borderRadius: borderRadius ?? radiusTokens['2xl'],
        };
      case 'card':
        return {
          width: width || '100%',
          height: height || 200,
          borderRadius: borderRadius ?? radiusTokens.lg,
        };
      case 'image':
        return {
          width: width || '100%',
          height: height || 150,
          borderRadius: borderRadius ?? radiusTokens.md,
        };
      case 'custom':
        return {
          width: width || 100,
          height: height || 100,
          borderRadius: borderRadius ?? radiusTokens.none,
        };
      default:
        return {};
    }
  };

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const skeletonColor = theme.skeletonBase;
  const waveColor = theme.skeletonHighlight;

  return (
    <View
      testID={testID}
      style={[styles.container, getVariantStyles(), style]}
      // Decorativo: el skeleton no aporta información al lector de pantalla,
      // por lo que se oculta del árbol de accesibilidad en vez de anunciar
      // placeholders vacíos.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        style={[
          styles.skeleton,
          {
            backgroundColor: skeletonColor,
            opacity: animation === 'pulse' ? opacity : 1,
          },
        ]}
      />
      {animation === 'wave' && (
        <Animated.View
          style={[
            styles.wave,
            {
              backgroundColor: waveColor,
              transform: [{ translateX }],
            },
          ]}
        />
      )}
    </View>
  );
}

export const SkeletonLoader = React.memo(SkeletonLoaderBase);
SkeletonLoader.displayName = 'SkeletonLoader';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  skeleton: {
    width: '100%',
    height: '100%',
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

