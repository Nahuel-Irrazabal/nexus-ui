/**
 * RadioButton Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RadioButton, RadioGroup, RadioItem } from '../RadioButton';
import { ThemeProvider } from '../../../../theme/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

/** Recorre el árbol renderizado y junta todos los objetos de estilo aplanados. */
function collectStyles(node: any, acc: Record<string, unknown>[] = []) {
  if (!node) return acc;
  if (Array.isArray(node)) {
    node.forEach((child) => collectStyles(child, acc));
    return acc;
  }
  if (node.props?.style) {
    const flat = Array.isArray(node.props.style) ? node.props.style : [node.props.style];
    flat.forEach((s: unknown) => {
      if (s && typeof s === 'object') acc.push(s as Record<string, unknown>);
    });
  }
  if (node.children) collectStyles(node.children, acc);
  return acc;
}

describe('RadioButton', () => {
  it('renderiza sin crashear con label', () => {
    const { getByText } = renderWithTheme(
      <RadioButton value="a" label="Opción A" onSelect={jest.fn()} />
    );
    expect(getByText('Opción A')).toBeTruthy();
  });

  it('expone accessibilityRole="radio" y accessibilityState acorde a selected/disabled', () => {
    const { getByRole, rerender } = renderWithTheme(
      <RadioButton value="a" label="Opción A" selected onSelect={jest.fn()} />
    );
    let radio = getByRole('radio');
    expect(radio.props.accessibilityState).toEqual({ checked: true, disabled: false });

    rerender(
      <ThemeProvider>
        <RadioButton value="a" label="Opción A" disabled onSelect={jest.fn()} />
      </ThemeProvider>
    );
    radio = getByRole('radio');
    expect(radio.props.accessibilityState).toEqual({ checked: false, disabled: true });
  });

  it('usa el label como accessibilityLabel (sin hardcode)', () => {
    const { getByRole } = renderWithTheme(
      <RadioButton value="a" label="Opción A" onSelect={jest.fn()} />
    );
    expect(getByRole('radio').props.accessibilityLabel).toBe('Opción A');
  });

  it('llama a onSelect con su value al presionar cuando no está disabled', () => {
    const onSelect = jest.fn();
    const { getByRole } = renderWithTheme(
      <RadioButton value="a" label="Opción A" onSelect={onSelect} />
    );
    fireEvent.press(getByRole('radio'));
    expect(onSelect).toHaveBeenCalledWith('a');
  });

  it('no llama a onSelect cuando está disabled', () => {
    const onSelect = jest.fn();
    const { getByRole } = renderWithTheme(
      <RadioButton value="a" label="Opción A" disabled onSelect={onSelect} />
    );
    fireEvent.press(getByRole('radio'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it.each([
    { selected: false, disabled: false },
    { selected: true, disabled: false },
    { selected: false, disabled: true },
    { selected: true, disabled: true },
  ])(
    'no resuelve colores undefined para selected=$selected disabled=$disabled',
    ({ selected, disabled }) => {
      const { toJSON } = renderWithTheme(
        <RadioButton value="a" label="Opción A" selected={selected} disabled={disabled} onSelect={jest.fn()} />
      );
      const styles = collectStyles(toJSON());
      const colorKeys = ['borderColor', 'backgroundColor', 'color'] as const;
      const relevantValues = styles
        .flatMap((s) => colorKeys.filter((k) => k in s).map((k) => s[k]))
        .filter((v) => v !== undefined || true); // se detalla abajo

      // Cada estilo que declara una key de color debe tener un valor definido.
      styles.forEach((s) => {
        colorKeys.forEach((k) => {
          if (k in s) {
            expect(s[k]).toBeDefined();
          }
        });
      });
      expect(relevantValues.length).toBeGreaterThan(0);
    }
  );

  it('tamaños small/medium/large no crashean y renderizan', () => {
    (['small', 'medium', 'large'] as const).forEach((size) => {
      const { getByText, unmount } = renderWithTheme(
        <RadioButton value="a" label={`Opción ${size}`} size={size} onSelect={jest.fn()} />
      );
      expect(getByText(`Opción ${size}`)).toBeTruthy();
      unmount();
    });
  });
});

describe('RadioGroup', () => {
  it('renderiza sus RadioItem como RadioButton con el seleccionado marcado', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <RadioGroup value="b" onChange={onChange} label="Elegí una opción">
        <RadioItem value="a" label="A" />
        <RadioItem value="b" label="B" />
      </RadioGroup>
    );

    const radios = getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0].props.accessibilityState.checked).toBe(false);
    expect(radios[1].props.accessibilityState.checked).toBe(true);
  });

  it('propaga onChange al presionar una opción', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <RadioGroup value="a" onChange={onChange}>
        <RadioItem value="a" label="A" />
        <RadioItem value="b" label="B" />
      </RadioGroup>
    );

    fireEvent.press(getAllByRole('radio')[1]);
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('renderiza el mensaje de error con color definido (theme.error)', () => {
    const { getByText, toJSON } = renderWithTheme(
      <RadioGroup value="a" onChange={jest.fn()} error="Campo requerido">
        <RadioItem value="a" label="A" />
      </RadioGroup>
    );

    expect(getByText('Campo requerido')).toBeTruthy();
    const styles = collectStyles(toJSON());
    const errorColors = styles.filter((s) => 'color' in s).map((s) => s.color);
    errorColors.forEach((c) => expect(c).toBeDefined());
  });
});
