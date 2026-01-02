/**
 * SkeletonList Component
 * Renderiza múltiples skeletons en diferentes layouts predefinidos
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';
import { spacing } from '../../../tokens/spacing';

export type SkeletonListVariant = 'listItem' | 'card' | 'avatar';

export interface SkeletonListProps {
  items?: number;
  variant?: SkeletonListVariant;
  spacing?: keyof typeof spacing;
}

export function SkeletonList({
  items = 3,
  variant = 'listItem',
  spacing: spacingValue = 'md',
}: SkeletonListProps) {
  const renderSkeletonItem = () => {
    switch (variant) {
      case 'listItem':
        return (
          <View style={styles.listItem}>
            <SkeletonLoader variant="avatar" width={40} height={40} />
            <View style={styles.listItemContent}>
              <SkeletonLoader variant="text" width="60%" height={16} />
              <SkeletonLoader 
                variant="text" 
                width="40%" 
                height={12} 
                style={{ marginTop: spacing.xs }} 
              />
            </View>
          </View>
        );
      
      case 'card':
        return (
          <View style={styles.cardItem}>
            <SkeletonLoader variant="image" height={150} />
            <View style={styles.cardContent}>
              <SkeletonLoader variant="text" width="80%" height={20} />
              <SkeletonLoader 
                variant="text" 
                width="100%" 
                height={14} 
                style={{ marginTop: spacing.xs }} 
              />
              <SkeletonLoader 
                variant="text" 
                width="70%" 
                height={14} 
                style={{ marginTop: spacing.xxs }} 
              />
            </View>
          </View>
        );
      
      case 'avatar':
        return (
          <View style={styles.avatarItem}>
            <SkeletonLoader variant="avatar" width={60} height={60} />
            <SkeletonLoader 
              variant="text" 
              width={60} 
              height={12} 
              style={{ marginTop: spacing.xs }} 
            />
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: items }).map((_, index) => (
        <View
          key={index}
          style={{
            marginBottom: spacing[spacingValue],
          }}
        >
          {renderSkeletonItem()}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  listItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: spacing.md,
  },
  avatarItem: {
    alignItems: 'center',
  },
});

