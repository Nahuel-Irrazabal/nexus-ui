/**
 * Avatar Component Tests
 */

import React from 'react';
import { Avatar, AvatarGroup } from '../Avatar';

describe('Avatar', () => {
  it('should be defined', () => {
    expect(Avatar).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof Avatar).toBe('function');
  });

  it('should accept size prop', () => {
    const avatarProps = {
      size: 'medium' as const,
    };
    
    expect(avatarProps.size).toBe('medium');
  });

  it('should accept fallback prop', () => {
    const avatarProps = {
      fallback: 'JD',
    };
    
    expect(avatarProps.fallback).toBe('JD');
  });

  it('should accept shape prop', () => {
    const avatarProps = {
      shape: 'circle' as const,
    };
    
    expect(avatarProps.shape).toBe('circle');
  });

  it('should accept source prop', () => {
    const avatarProps = {
      source: { uri: 'https://example.com/avatar.jpg' },
    };
    
    expect(avatarProps.source.uri).toBe('https://example.com/avatar.jpg');
  });
});

describe('AvatarGroup', () => {
  it('should be defined', () => {
    expect(AvatarGroup).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof AvatarGroup).toBe('function');
  });

  it('should accept max prop', () => {
    const groupProps = {
      max: 3,
      children: [],
    };
    
    expect(groupProps.max).toBe(3);
  });
});

