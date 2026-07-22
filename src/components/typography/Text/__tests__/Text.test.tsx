/**
 * Text Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../Text';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { textVariants, fontWeights } from '../../../../tokens/typography';

const renderWithTheme = (ui: React.ReactElement, themeConfig?: object) =>
  render(<ThemeProvider themeConfig={themeConfig}>{ui}</ThemeProvider>);

const flattenStyle = (style: any): Record<string, any> => {
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style ?? {};
};

describe('Text', () => {
  it('renderiza el children sin crashear', () => {
    const { getByText } = renderWithTheme(<Text>Hola mundo</Text>);
    expect(getByText('Hola mundo')).toBeTruthy();
  });

  it('tiene displayName seteado para debugging', () => {
    expect(Text.displayName).toBe('Text');
  });

  it.each(['display', 'h1', 'h2', 'h3', 'subtitle', 'title', 'body', 'button', 'caption', 'overline'] as const)(
    'aplica el tamaño de fuente del token para la variante "%s"',
    (variant) => {
      const { getByText } = renderWithTheme(<Text variant={variant}>Texto</Text>);
      const style = flattenStyle(getByText('Texto').props.style);
      expect(style.fontSize).toBe(textVariants[variant].fontSize);
      expect(style.fontSize).not.toBeUndefined();
    }
  );

  it('cae en la variante "body" cuando la variante no existe', () => {
    const { getByText } = renderWithTheme(<Text variant="no-existe">Texto</Text>);
    const style = flattenStyle(getByText('Texto').props.style);
    expect(style.fontSize).toBe(textVariants.body.fontSize);
  });

  it('resuelve el color desde theme.text cuando no se pasa color', () => {
    const { getByText } = renderWithTheme(<Text>Texto</Text>);
    const style = flattenStyle(getByText('Texto').props.style);
    expect(style.color).not.toBeUndefined();
    expect(typeof style.color).toBe('string');
  });

  it('permite pisar el color via prop "color"', () => {
    const { getByText } = renderWithTheme(<Text color="#123456">Texto</Text>);
    const style = flattenStyle(getByText('Texto').props.style);
    expect(style.color).toBe('#123456');
  });

  it('aplica fontWeight.bold del token cuando bold=true', () => {
    const { getByText } = renderWithTheme(<Text bold>Texto</Text>);
    const style = flattenStyle(getByText('Texto').props.style);
    expect(style.fontWeight).toBe(fontWeights.bold);
    expect(style.fontWeight).not.toBeUndefined();
  });

  it('aplica fontStyle italic cuando italic=true', () => {
    const { getByText } = renderWithTheme(<Text italic>Texto</Text>);
    const style = flattenStyle(getByText('Texto').props.style);
    expect(style.fontStyle).toBe('italic');
  });

  it.each(['left', 'center', 'right', 'justify'] as const)(
    'respeta el align "%s"',
    (align) => {
      const { getByText } = renderWithTheme(<Text align={align}>Texto</Text>);
      const style = flattenStyle(getByText('Texto').props.style);
      expect(style.textAlign).toBe(align);
    }
  );

  it('propaga props de accesibilidad heredadas de RNTextProps', () => {
    const { getByLabelText } = renderWithTheme(
      <Text accessibilityRole="header" accessibilityLabel="Titulo de sección">
        Sección
      </Text>
    );
    const node = getByLabelText('Titulo de sección');
    expect(node.props.accessibilityRole).toBe('header');
    expect(node.props.accessibilityLabel).toBe('Titulo de sección');
  });

  it('ningún color resuelto en las variantes queda undefined con un theme custom', () => {
    const { getByText } = renderWithTheme(
      <Text color={undefined}>Texto</Text>,
      { primaryColor: 'orange' }
    );
    const style = flattenStyle(getByText('Texto').props.style);
    expect(style.color).not.toBeUndefined();
    expect(style.color).not.toBe('undefined');
  });

  it('permite overridear una variante via theme.components.text.variants', () => {
    const { getByText } = renderWithTheme(<Text variant="body">Texto</Text>, {
      components: {
        text: {
          variants: {
            body: { fontSize: 99 },
          },
        },
      },
    });
    const style = flattenStyle(getByText('Texto').props.style);
    expect(style.fontSize).toBe(99);
  });
});
