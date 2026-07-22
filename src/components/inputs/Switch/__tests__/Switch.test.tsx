/**
 * Switch Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Switch } from '../Switch';
import { ThemeProvider } from '../../../../theme/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement, themeConfig?: object) =>
  render(<ThemeProvider themeConfig={themeConfig}>{ui}</ThemeProvider>);

const flattenStyle = (style: any): Record<string, any> => {
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style ?? {};
};

const getSwitchNode = (utils: ReturnType<typeof renderWithTheme>) =>
  utils.UNSAFE_getByProps({ accessibilityRole: 'switch' });

describe('Switch', () => {
  it('renderiza sin crashear', () => {
    const utils = renderWithTheme(<Switch value={false} onChange={jest.fn()} />);
    expect(getSwitchNode(utils)).toBeTruthy();
  });

  it('tiene displayName seteado para debugging', () => {
    expect(Switch.displayName).toBe('Switch');
  });

  it('expone accessibilityRole="switch" y accessibilityState con checked/disabled', () => {
    const utils = renderWithTheme(<Switch value onChange={jest.fn()} />);
    const node = getSwitchNode(utils);
    expect(node.props.accessibilityRole).toBe('switch');
    expect(node.props.accessibilityState).toEqual({ checked: true, disabled: false });
  });

  it('refleja disabled en accessibilityState cuando disabled=true', () => {
    const utils = renderWithTheme(<Switch value={false} onChange={jest.fn()} disabled />);
    const node = getSwitchNode(utils);
    expect(node.props.accessibilityState).toEqual({ checked: false, disabled: true });
  });

  it('refleja disabled en accessibilityState cuando loading=true', () => {
    const utils = renderWithTheme(<Switch value={false} onChange={jest.fn()} loading />);
    const node = getSwitchNode(utils);
    expect(node.props.accessibilityState.disabled).toBe(true);
  });

  it('usa el prop label como accessibilityLabel por defecto', () => {
    const utils = renderWithTheme(
      <Switch value={false} onChange={jest.fn()} label="Notificaciones" />
    );
    expect(getSwitchNode(utils).props.accessibilityLabel).toBe('Notificaciones');
  });

  it('permite pisar accessibilityLabel explícitamente', () => {
    const utils = renderWithTheme(
      <Switch
        value={false}
        onChange={jest.fn()}
        label="Notificaciones"
        accessibilityLabel="Activar notificaciones push"
      />
    );
    expect(getSwitchNode(utils).props.accessibilityLabel).toBe('Activar notificaciones push');
  });

  it('llama a onChange con el valor invertido al presionar', () => {
    const onChange = jest.fn();
    const utils = renderWithTheme(<Switch value={false} onChange={onChange} />);
    fireEvent.press(getSwitchNode(utils));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('no llama a onChange cuando está disabled', () => {
    const onChange = jest.fn();
    const utils = renderWithTheme(<Switch value={false} onChange={onChange} disabled />);
    fireEvent.press(getSwitchNode(utils));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('no llama a onChange cuando está loading', () => {
    const onChange = jest.fn();
    const utils = renderWithTheme(<Switch value={false} onChange={onChange} loading />);
    fireEvent.press(getSwitchNode(utils));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renderiza label y description cuando se pasan', () => {
    const { getByText } = renderWithTheme(
      <Switch
        value={false}
        onChange={jest.fn()}
        label="Notificaciones"
        description="Recibir alertas push"
      />
    );
    expect(getByText('Notificaciones')).toBeTruthy();
    expect(getByText('Recibir alertas push')).toBeTruthy();
  });

  it.each(['small', 'medium', 'large'] as const)(
    'renderiza el tamaño "%s" sin crashear',
    (size) => {
      const utils = renderWithTheme(<Switch value={false} onChange={jest.fn()} size={size} />);
      expect(getSwitchNode(utils)).toBeTruthy();
    }
  );

  it('el color del label resuelve siempre a un valor definido cuando value=true', () => {
    const { getByText } = renderWithTheme(<Switch value onChange={jest.fn()} label="On" />);
    const style = flattenStyle(getByText('On').props.style);
    expect(style.color).not.toBeUndefined();
    expect(style.color).not.toBe('undefined');
  });

  it('ningún color resuelto queda undefined cuando está disabled (label y description)', () => {
    const { getByText } = renderWithTheme(
      <Switch
        value={false}
        onChange={jest.fn()}
        disabled
        label="Notificaciones"
        description="Recibir alertas push"
      />
    );
    const labelStyle = flattenStyle(getByText('Notificaciones').props.style);
    const descriptionStyle = flattenStyle(getByText('Recibir alertas push').props.style);
    expect(labelStyle.color).not.toBeUndefined();
    expect(labelStyle.color).not.toBe('undefined');
    expect(descriptionStyle.color).not.toBeUndefined();
    expect(descriptionStyle.color).not.toBe('undefined');
  });

  it('ningún color resuelto queda undefined con un theme custom', () => {
    const { getByText } = renderWithTheme(
      <Switch value onChange={jest.fn()} label="Notificaciones" />,
      { primaryColor: 'orange' }
    );
    const style = flattenStyle(getByText('Notificaciones').props.style);
    expect(style.color).not.toBeUndefined();
    expect(style.color).not.toBe('undefined');
  });
});
