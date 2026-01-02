/**
 * SkeletonLoader Component
 * Componente de carga placeholder con animaciones suaves
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

export type SkeletonVariant = 'text' | 'avatar' | 'card' | 'image' | 'custom';
export type AnimationType = 'pulse' | 'wave' | 'none';

export interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  animation?: AnimationType;
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  borderRadius,
  style,
}: SkeletonLoaderProps) {
  const { theme, isDark } = useTheme();
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
          borderRadius: borderRadius ?? 4,
        };
      case 'avatar':
        return {
          width: width || 40,
          height: height || 40,
          borderRadius: borderRadius ?? 20,
        };
      case 'card':
        return {
          width: width || '100%',
          height: height || 200,
          borderRadius: borderRadius ?? 12,
        };
      case 'image':
        return {
          width: width || '100%',
          height: height || 150,
          borderRadius: borderRadius ?? 8,
        };
      case 'custom':
        return {
          width: width || 100,
          height: height || 100,
          borderRadius: borderRadius ?? 0,
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

  const skeletonColor = isDark ? '#2A2A2A' : '#E0E0E0';
  const waveColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)';

  return (
    <View style={[styles.container, getVariantStyles(), style]}>
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

