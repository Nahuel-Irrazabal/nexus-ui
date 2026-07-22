/**
 * Avatar Component Tests
 */

import React from 'react';
import { Text, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { render } from '@testing-library/react-native';
import { Avatar, AvatarGroup } from '../Avatar';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { borderRadius } from '../../../../tokens/borderRadius';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenStyle(style: any): Record<string, any> {
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style || {};
}

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Avatar', () => {
  it('renders the fallback text without crashing', () => {
    const { getByText, getByTestId } = renderWithTheme(
      <Avatar fallback="JD" testID="avatar" />
    );

    expect(getByText('JD')).toBeTruthy();
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('renders "?" when there is neither source nor fallback', () => {
    const { getByText } = renderWithTheme(<Avatar testID="avatar" />);
    expect(getByText('?')).toBeTruthy();
  });

  it('renders an Image instead of the fallback text when source is provided', () => {
    const { queryByText, UNSAFE_getByType } = renderWithTheme(
      <Avatar source={{ uri: 'https://example.com/a.png' }} fallback="JD" testID="avatar" />
    );

    expect(queryByText('JD')).toBeNull();
    const image = UNSAFE_getByType(Image);
    expect(image.props.source).toEqual({ uri: 'https://example.com/a.png' });
  });

  it.each([
    ['circle', borderRadius.full],
    ['square', borderRadius.none],
  ] as const)('applies the correct border radius for shape="%s"', (shape, expectedRadius) => {
    const { getByTestId } = renderWithTheme(
      <Avatar fallback="A" shape={shape} testID="avatar" />
    );
    const style = flattenStyle(getByTestId('avatar').props.style);
    expect(style.borderRadius).toBe(expectedRadius);
  });

  it('scales width/height per size variant, and accepts a numeric size', () => {
    const { getByTestId, rerender } = renderWithTheme(
      <Avatar fallback="A" size="small" testID="avatar" />
    );
    const small = flattenStyle(getByTestId('avatar').props.style);

    rerender(
      <ThemeProvider>
        <Avatar fallback="A" size="large" testID="avatar" />
      </ThemeProvider>
    );
    const large = flattenStyle(getByTestId('avatar').props.style);
    expect(large.width).toBeGreaterThan(small.width);

    rerender(
      <ThemeProvider>
        <Avatar fallback="A" size={100} testID="avatar" />
      </ThemeProvider>
    );
    const custom = flattenStyle(getByTestId('avatar').props.style);
    expect(custom.width).toBe(100);
    expect(custom.height).toBe(100);
  });

  it('renders the badge content when provided', () => {
    const { getByTestId } = renderWithTheme(
      <Avatar
        fallback="A"
        testID="avatar"
        badge={<Text testID="badge-dot">●</Text>}
      />
    );
    expect(getByTestId('badge-dot')).toBeTruthy();
  });

  describe('accessibility', () => {
    it('exposes an "image" role and the fallback as label when not pressable', () => {
      const { getByTestId } = renderWithTheme(<Avatar fallback="JD" testID="avatar" />);
      const avatar = getByTestId('avatar');
      expect(avatar.props.accessibilityRole).toBe('image');
      expect(avatar.props.accessibilityLabel).toBe('JD');
    });

    it('lets accessibilityLabel prop override the fallback-derived label', () => {
      const { getByTestId } = renderWithTheme(
        <Avatar fallback="JD" accessibilityLabel="Foto de perfil de Juan" testID="avatar" />
      );
      expect(getByTestId('avatar').props.accessibilityLabel).toBe('Foto de perfil de Juan');
    });

    it('exposes a "button" role on the wrapping TouchableOpacity when onPress is set', () => {
      const onPress = jest.fn();
      const { UNSAFE_getByType, getByTestId } = renderWithTheme(
        <Avatar fallback="JD" onPress={onPress} testID="avatar" />
      );

      const touchable = UNSAFE_getByType(TouchableOpacity);
      expect(touchable.props.accessibilityRole).toBe('button');
      expect(touchable.props.accessibilityLabel).toBe('JD');
      expect(touchable.props.onPress).toBe(onPress);

      // El contenedor interno no debe duplicar el rol/label del TouchableOpacity.
      const inner = getByTestId('avatar');
      expect(inner.props.accessibilityRole).toBeUndefined();
      expect(inner.props.accessibilityLabel).toBeUndefined();
    });
  });

  describe('theming', () => {
    afterEach(() => {
      (useColorScheme as jest.Mock).mockReturnValue('light');
    });

    it('resolves every color used (background/border/text) to a defined string in light mode', () => {
      const { getByText, getByTestId } = renderWithTheme(<Avatar fallback="JD" testID="avatar" />);

      const containerStyle = flattenStyle(getByTestId('avatar').props.style);
      expect(typeof containerStyle.backgroundColor).toBe('string');
      expect(containerStyle.backgroundColor).toBeTruthy();
      expect(typeof containerStyle.borderColor).toBe('string');
      expect(containerStyle.borderColor).toBeTruthy();

      const textStyle = flattenStyle(getByText('JD').props.style);
      expect(typeof textStyle.color).toBe('string');
      expect(textStyle.color).toBeTruthy();
    });

    it('resolves every color used to a defined string in dark mode too', () => {
      (useColorScheme as jest.Mock).mockReturnValue('dark');

      const { getByText, getByTestId } = renderWithTheme(<Avatar fallback="JD" testID="avatar" />);

      const containerStyle = flattenStyle(getByTestId('avatar').props.style);
      expect(containerStyle.backgroundColor).toBeTruthy();
      expect(containerStyle.borderColor).toBeTruthy();

      const textStyle = flattenStyle(getByText('JD').props.style);
      expect(textStyle.color).toBeTruthy();
    });
  });

  it('has a displayName for devtools/debugging', () => {
    expect(Avatar.displayName).toBe('Avatar');
  });
});

describe('AvatarGroup', () => {
  it('renders up to "max" avatars and collapses the rest into a "+N" avatar', () => {
    const { getByText, queryByText } = renderWithTheme(
      <AvatarGroup max={2}>
        <Avatar fallback="A" testID="a1" />
        <Avatar fallback="B" testID="a2" />
        <Avatar fallback="C" testID="a3" />
        <Avatar fallback="D" testID="a4" />
      </AvatarGroup>
    );

    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
    expect(queryByText('C')).toBeNull();
    expect(queryByText('D')).toBeNull();
    expect(getByText('+2')).toBeTruthy();
  });

  it('does not render a "+N" avatar when there is nothing remaining', () => {
    const { queryByText } = renderWithTheme(
      <AvatarGroup max={3}>
        <Avatar fallback="A" testID="a1" />
      </AvatarGroup>
    );

    expect(queryByText(/^\+/)).toBeNull();
  });

  it('has a displayName for devtools/debugging', () => {
    expect(AvatarGroup.displayName).toBe('AvatarGroup');
  });
});
