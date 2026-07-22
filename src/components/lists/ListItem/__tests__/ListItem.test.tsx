/**
 * ListItem Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ListItem } from '../ListItem';
import { ThemeProvider } from '../../../../theme/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement, themeConfig?: object) =>
  render(<ThemeProvider themeConfig={themeConfig}>{ui}</ThemeProvider>);

const flattenStyle = (style: any): Record<string, any> => {
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style ?? {};
};

describe('ListItem', () => {
  it('renderiza el title sin crashear', () => {
    const { getByText } = renderWithTheme(<ListItem title="Elemento" />);
    expect(getByText('Elemento')).toBeTruthy();
  });

  it('tiene displayName seteado para debugging', () => {
    expect(ListItem.displayName).toBe('ListItem');
  });

  it('renderiza la description cuando se pasa', () => {
    const { getByText } = renderWithTheme(
      <ListItem title="Elemento" description="Detalle del elemento" />
    );
    expect(getByText('Detalle del elemento')).toBeTruthy();
  });

  it('agrega accessibilityRole="button" cuando recibe onPress', () => {
    const { getByRole } = renderWithTheme(
      <ListItem title="Elemento" onPress={jest.fn()} />
    );
    expect(getByRole('button')).toBeTruthy();
  });

  it('no agrega accessibilityRole="button" cuando no hay onPress', () => {
    const { queryByRole } = renderWithTheme(<ListItem title="Elemento" />);
    expect(queryByRole('button')).toBeNull();
  });

  it('usa el title como accessibilityLabel por defecto cuando hay onPress', () => {
    const { getByLabelText } = renderWithTheme(
      <ListItem title="Elemento pulsable" onPress={jest.fn()} />
    );
    expect(getByLabelText('Elemento pulsable')).toBeTruthy();
  });

  it('permite pisar el accessibilityLabel por defecto', () => {
    const { getByLabelText } = renderWithTheme(
      <ListItem
        title="Elemento"
        onPress={jest.fn()}
        accessibilityLabel="Etiqueta custom"
      />
    );
    expect(getByLabelText('Etiqueta custom')).toBeTruthy();
  });

  it('refleja disabled en accessibilityState', () => {
    const { getByRole } = renderWithTheme(
      <ListItem title="Elemento" onPress={jest.fn()} disabled />
    );
    expect(getByRole('button').props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it('dispara onPress al presionar', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(
      <ListItem title="Elemento" onPress={onPress} />
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('aplica fontSize del token (fontSizes.xxl) al leftIcon', () => {
    const { getByText } = renderWithTheme(
      <ListItem title="Elemento" leftIcon="star" />
    );
    const style = flattenStyle(getByText('star').props.style);
    expect(style.fontSize).toBe(20);
    expect(style.fontSize).not.toBeUndefined();
  });

  it('aplica fontSize del token (fontSizes.xxl) al rightIcon', () => {
    const { getByText } = renderWithTheme(
      <ListItem title="Elemento" rightIcon="chevron" />
    );
    const style = flattenStyle(getByText('chevron').props.style);
    expect(style.fontSize).toBe(20);
    expect(style.fontSize).not.toBeUndefined();
  });

  it('resuelve el color del title desde theme.text', () => {
    const { getByText } = renderWithTheme(<ListItem title="Elemento" />);
    const style = flattenStyle(getByText('Elemento').props.style);
    expect(style.color).not.toBeUndefined();
    expect(typeof style.color).toBe('string');
  });

  it('resuelve el color de la description desde theme.textSecondary', () => {
    const { getByText } = renderWithTheme(
      <ListItem title="Elemento" description="Detalle" />
    );
    const style = flattenStyle(getByText('Detalle').props.style);
    expect(style.color).not.toBeUndefined();
    expect(typeof style.color).toBe('string');
  });

  it('resuelve el color del leftIcon desde theme.primary con un theme custom', () => {
    const { getByText } = renderWithTheme(
      <ListItem title="Elemento" leftIcon="star" />,
      { primaryColor: 'orange' }
    );
    const style = flattenStyle(getByText('star').props.style);
    expect(style.color).not.toBeUndefined();
    expect(style.color).not.toBe('undefined');
  });

  it('respeta numberOfLines=1 en el title cuando multiline=false', () => {
    const { getByText } = renderWithTheme(
      <ListItem title="Elemento" multiline={false} />
    );
    expect(getByText('Elemento').props.numberOfLines).toBe(1);
  });

  it('quita el límite de líneas del title cuando multiline=true', () => {
    const { getByText } = renderWithTheme(
      <ListItem title="Elemento" multiline />
    );
    expect(getByText('Elemento').props.numberOfLines).toBeUndefined();
  });

  it('aplica borderBottomWidth cuando divider=true (default)', () => {
    const { getByText } = renderWithTheme(<ListItem title="Elemento" />);
    // El contenedor es el ancestro directo del árbol renderizado por View
    const titleNode = getByText('Elemento');
    const container = titleNode.parent?.parent?.parent;
    const style = flattenStyle(container?.props.style);
    expect(style.borderBottomWidth).toBe(1);
  });

  it('quita el borderBottomWidth cuando divider=false', () => {
    const { getByText } = renderWithTheme(
      <ListItem title="Elemento" divider={false} />
    );
    const titleNode = getByText('Elemento');
    const container = titleNode.parent?.parent?.parent;
    const style = flattenStyle(container?.props.style);
    expect(style.borderBottomWidth).toBe(0);
  });
});
