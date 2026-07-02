/**
 * Switch Component
 * Toggle switch estilizado con soporte para labels y loading state
 */

import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../tokens/spacing';
import { borderRadius } from '../../../tokens/borderRadius';
import { getShadow } from '../../../tokens/shadows';

export interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  testID?: string;
}

const SWITCH_SIZES = {
  small: {
    width: 36,
    height: 20,
    thumbSize: 16,
  },
  medium: {
    width: 44,
    height: 24,
    thumbSize: 20,
  },
  large: {
    width: 52,
    height: 28,
    thumbSize: 24,
  },
};

export function Switch({
  value,
  onChange,
  label,
  description,
  disabled = false,
  loading = false,
  size = 'medium',
  style,
  labelStyle,
  descriptionStyle,
  testID,
}: SwitchProps) {
  const { theme, isDark } = useTheme();
  const { width, height, thumbSize } = SWITCH_SIZES[size];
  const translateX = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const handlePress = () => {
    if (!disabled && !loading) {
      onChange(!value);
    }
  };

  const getTrackColor = () => {
    if (disabled) {
      return '#e5e7eb';
    }
    if (value) {
      return theme.primary;
    }
    return '#d1d5db';
  };

  const thumbTranslateX = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [2, width - thumbSize - 2],
  });

  return (
    <View style={[styles.container, style]} testID={testID}>
      <TouchableOpacity
        style={styles.row}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.track,
            {
              width,
              height,
              backgroundColor: getTrackColor(),
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                transform: [{ translateX: thumbTranslateX }],
                ...getShadow('sm', isDark),
              },
            ]}
          >
            {loading && (
              <View style={styles.loadingIndicator}>
                <Text style={{ fontSize: thumbSize * 0.5 }}>⏳</Text>
              </View>
            )}
          </Animated.View>
        </View>

        {(label || description) && (
          <View style={styles.textContainer}>
            {label && (
              <Text
                style={[
                  styles.label,
                  {
                    color: disabled ? '#9ca3af' : theme.text,
                  },
                  labelStyle,
                ]}
              >
                {label}
              </Text>
            )}
            {description && (
              <Text
                style={[
                  styles.description,
                  {
                    color: disabled ? '#d1d5db' : theme.textSecondary,
                  },
                  descriptionStyle,
                ]}
              >
                {description}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    borderRadius: borderRadius.full,
    justifyContent: 'center',
  },
  thumb: {
    borderRadius: borderRadius.full,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
});

