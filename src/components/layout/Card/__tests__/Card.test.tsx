/**
 * Card Component Tests
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Card } from '../Card';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';

function renderWithTheme(ui: React.ReactElement, options?: Parameters<typeof render>[1]) {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
}

describe('Card', () => {
  it('renders children without crashear', () => {
    const { getByText } = renderWithTheme(
      <Card>
        <Text>Card content</Text>
      </Card>
    );

    expect(getByText('Card content')).toBeTruthy();
  });

  it('sets displayName for devtools/debugging', () => {
    expect(Card.displayName).toBe('Card');
  });

  describe('variantes', () => {
    it('variant="flat" usa theme.surface como backgroundColor y ningún color es undefined', () => {
      const { getByTestId } = renderWithTheme(
        <Card variant="flat" testID="card-flat">
          <Text>flat</Text>
        </Card>
      );

      const node = getByTestId('card-flat');
      const flatStyle = Object.assign({}, ...[].concat(node.props.style).filter(Boolean));

      expect(flatStyle.backgroundColor).toBe(defaultLightTheme.surface);
      expect(flatStyle.backgroundColor).not.toBeUndefined();
      expect(flatStyle.borderColor).toBeUndefined();
    });

    it('variant="elevated" (default) usa theme.surface + shadow, sin colores undefined', () => {
      const { getByTestId } = renderWithTheme(
        <Card testID="card-elevated">
          <Text>elevated</Text>
        </Card>
      );

      const node = getByTestId('card-elevated');
      const style = Object.assign({}, ...[].concat(node.props.style).filter(Boolean));

      expect(style.backgroundColor).toBe(defaultLightTheme.surface);
      expect(style.backgroundColor).not.toBeUndefined();
      expect(style.shadowColor).toBeDefined();
    });

    it('variant="outlined" usa theme.surface y theme.border, sin colores undefined', () => {
      const { getByTestId } = renderWithTheme(
        <Card variant="outlined" testID="card-outlined">
          <Text>outlined</Text>
        </Card>
      );

      const node = getByTestId('card-outlined');
      const style = Object.assign({}, ...[].concat(node.props.style).filter(Boolean));

      expect(style.backgroundColor).toBe(defaultLightTheme.surface);
      expect(style.borderColor).toBe(defaultLightTheme.border);
      expect(style.backgroundColor).not.toBeUndefined();
      expect(style.borderColor).not.toBeUndefined();
    });
  });

  describe('accesibilidad', () => {
    it('expone accessibilityRole="button" cuando recibe onPress', () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Card onPress={onPress} testID="pressable-card">
          <Text>press me</Text>
        </Card>
      );

      const byTestId = getByTestId('pressable-card');
      expect(byTestId.props.accessibilityRole).toBe('button');

      fireEvent.press(byTestId);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('no fuerza accessibilityRole cuando no recibe onPress', () => {
      const { getByTestId } = renderWithTheme(
        <Card testID="static-card">
          <Text>static</Text>
        </Card>
      );

      const node = getByTestId('static-card');
      expect(node.props.accessibilityRole).toBeUndefined();
    });

    it('respeta un accessibilityRole explícito por sobre el default "button"', () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Card onPress={onPress} accessibilityRole="link" testID="link-card">
          <Text>link</Text>
        </Card>
      );

      expect(getByTestId('link-card').props.accessibilityRole).toBe('link');
    });
  });

  describe('forwardRef', () => {
    it('reenvía el ref al nodo raíz (View cuando no hay onPress)', () => {
      const mockNode = { measure: jest.fn() };
      const ref = React.createRef<any>();

      renderWithTheme(
        <Card ref={ref} testID="ref-card">
          <Text>ref</Text>
        </Card>,
        { createNodeMock: () => mockNode }
      );

      expect(ref.current).toBe(mockNode);
    });

    it('reenvía el ref al nodo Pressable cuando hay onPress', () => {
      const mockNode = { measure: jest.fn() };
      const ref = React.createRef<any>();

      renderWithTheme(
        <Card ref={ref} onPress={jest.fn()} testID="ref-pressable-card">
          <Text>ref</Text>
        </Card>,
        { createNodeMock: () => mockNode }
      );

      expect(ref.current).toBe(mockNode);
    });
  });

  describe('subcomponentes', () => {
    it('mantiene la composición Card.Content/Title/Description/Actions/Image', () => {
      expect(Card.Content).toBeDefined();
      expect(Card.Title).toBeDefined();
      expect(Card.Description).toBeDefined();
      expect(Card.Actions).toBeDefined();
      expect(Card.Image).toBeDefined();
    });

    it('renderiza Card.Title y Card.Description con colores de theme definidos', () => {
      const { getByText } = renderWithTheme(
        <Card>
          <Card.Content>
            <Card.Title>Título</Card.Title>
            <Card.Description>Descripción</Card.Description>
          </Card.Content>
          <Card.Actions>
            <Text>Acción</Text>
          </Card.Actions>
        </Card>
      );

      const title = getByText('Título');
      const description = getByText('Descripción');

      const titleStyle = Object.assign({}, ...[].concat(title.props.style).filter(Boolean));
      const descriptionStyle = Object.assign({}, ...[].concat(description.props.style).filter(Boolean));

      expect(titleStyle.color).toBe(defaultLightTheme.text);
      expect(descriptionStyle.color).toBe(defaultLightTheme.textSecondary);
      expect(titleStyle.color).not.toBeUndefined();
      expect(descriptionStyle.color).not.toBeUndefined();
    });
  });
});
