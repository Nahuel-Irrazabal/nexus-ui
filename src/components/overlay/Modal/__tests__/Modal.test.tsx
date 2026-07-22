/**
 * Modal Component Tests
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Modal } from '../Modal';
import { ThemeProvider } from '../../../../theme/ThemeProvider';
import { defaultLightTheme } from '../../../../theme/createTheme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

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

describe('Modal', () => {
  it('renderiza su contenido sin crashear', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <Modal visible onClose={jest.fn()} testID="modal">
        <Text>Contenido del modal</Text>
      </Modal>
    );

    expect(getByTestId('modal')).toBeTruthy();
    expect(getByText('Contenido del modal')).toBeTruthy();
  });

  it.each(['small', 'medium', 'large', 'fullscreen'] as const)(
    'renderiza sin crashear en tamaño %s',
    (size) => {
      const { getByText, unmount } = renderWithTheme(
        <Modal visible onClose={jest.fn()} size={size}>
          <Text>{`Contenido ${size}`}</Text>
        </Modal>
      );
      expect(getByText(`Contenido ${size}`)).toBeTruthy();
      unmount();
    }
  );

  it('llama a onClose al presionar el backdrop cuando dismissible', () => {
    const onClose = jest.fn();
    const { getByText } = renderWithTheme(
      <Modal visible onClose={onClose} dismissible testID="modal">
        <Text>Contenido</Text>
      </Modal>
    );

    const backdrop = getByText('Contenido').parent?.parent;
    fireEvent.press(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('no llama a onClose al presionar el backdrop cuando dismissible=false', () => {
    const onClose = jest.fn();
    const { getByText } = renderWithTheme(
      <Modal visible onClose={onClose} dismissible={false} testID="modal">
        <Text>Contenido</Text>
      </Modal>
    );

    const backdrop = getByText('Contenido').parent?.parent;
    fireEvent.press(backdrop);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('marca el contenedor del diálogo con accessibilityViewIsModal', () => {
    const { getByText } = renderWithTheme(
      <Modal visible onClose={jest.fn()}>
        <Text>Contenido</Text>
      </Modal>
    );

    const dialogContainer = getByText('Contenido').parent;
    expect(dialogContainer?.props.accessibilityViewIsModal).toBe(true);
  });

  it('marca el contenedor fullscreen con accessibilityViewIsModal', () => {
    const { getByText } = renderWithTheme(
      <Modal visible onClose={jest.fn()} size="fullscreen">
        <Text>Contenido fullscreen</Text>
      </Modal>
    );

    const fullscreenContainer = getByText('Contenido fullscreen').parent;
    expect(fullscreenContainer?.props.accessibilityViewIsModal).toBe(true);
  });

  describe('Modal.CloseButton', () => {
    it('expone accessibilityRole="button" y accessibilityLabel por defecto "Cerrar"', () => {
      const { getByLabelText } = renderWithTheme(<Modal.CloseButton onPress={jest.fn()} />);
      const button = getByLabelText('Cerrar');
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessibilityLabel).toBe('Cerrar');
    });

    it('permite sobreescribir accessibilityLabel vía prop', () => {
      const { getByLabelText } = renderWithTheme(
        <Modal.CloseButton onPress={jest.fn()} accessibilityLabel="Cerrar modal de ejemplo" />
      );
      expect(getByLabelText('Cerrar modal de ejemplo')).toBeTruthy();
    });

    it('llama a onPress al presionarlo', () => {
      const onPress = jest.fn();
      const { getByLabelText } = renderWithTheme(<Modal.CloseButton onPress={onPress} />);
      fireEvent.press(getByLabelText('Cerrar'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  it('compone Header/Title/CloseButton/Content/Footer sin crashear', () => {
    const onClose = jest.fn();
    const { getByText, getByLabelText } = renderWithTheme(
      <Modal visible onClose={onClose} testID="modal">
        <Modal.Header>
          <Modal.Title>Título</Modal.Title>
          <Modal.CloseButton onPress={onClose} />
        </Modal.Header>
        <Modal.Content>
          <Text>Cuerpo</Text>
        </Modal.Content>
        <Modal.Footer>
          <Text>Pie</Text>
        </Modal.Footer>
      </Modal>
    );

    expect(getByText('Título')).toBeTruthy();
    expect(getByText('Cuerpo')).toBeTruthy();
    expect(getByText('Pie')).toBeTruthy();

    fireEvent.press(getByLabelText('Cerrar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Modal.Content en modo scrollable renderiza sus hijos', () => {
    const { getByText } = renderWithTheme(
      <Modal visible onClose={jest.fn()}>
        <Modal.Content scrollable>
          <Text>Contenido scrolleable</Text>
        </Modal.Content>
      </Modal>
    );

    expect(getByText('Contenido scrolleable')).toBeTruthy();
  });

  it('usa fontSizes.xxxl para el ícono de cierre y fontSizes.xxl para el título (tokens, no hardcode)', () => {
    const { getByText } = renderWithTheme(
      <>
        <Modal.CloseButton onPress={jest.fn()} />
        <Modal.Title>Título</Modal.Title>
      </>
    );

    const closeIcon = getByText('×');
    const closeStyle = Array.isArray(closeIcon.props.style)
      ? Object.assign({}, ...closeIcon.props.style)
      : closeIcon.props.style;
    expect(closeStyle.fontSize).toBe(24);

    const title = getByText('Título');
    const titleStyle = Array.isArray(title.props.style)
      ? title.props.style.find((s: any) => s && 'fontSize' in s)
      : title.props.style;
    expect(titleStyle.fontSize).toBe(20);
  });

  it('resuelve todos los colores de theme.* sin dejar ninguno undefined', () => {
    const { toJSON } = renderWithTheme(
      <Modal visible onClose={jest.fn()} testID="modal">
        <Modal.Header>
          <Modal.Title>Título</Modal.Title>
          <Modal.CloseButton onPress={jest.fn()} />
        </Modal.Header>
        <Modal.Content>
          <Text>Cuerpo</Text>
        </Modal.Content>
        <Modal.Footer>
          <Text>Pie</Text>
        </Modal.Footer>
      </Modal>
    );

    const styles = collectStyles(toJSON());
    const colorKeys = ['backgroundColor', 'borderColor', 'borderBottomColor', 'borderTopColor', 'color'] as const;
    let checkedAtLeastOne = false;

    styles.forEach((s) => {
      colorKeys.forEach((k) => {
        if (k in s) {
          checkedAtLeastOne = true;
          expect(s[k]).toBeDefined();
        }
      });
    });

    expect(checkedAtLeastOne).toBe(true);
  });

  it('el backdrop usa theme.overlay y el diálogo theme.surface', () => {
    const { getByText } = renderWithTheme(
      <Modal visible onClose={jest.fn()}>
        <Text>Contenido</Text>
      </Modal>
    );

    const dialog = getByText('Contenido').parent;
    const backdrop = dialog?.parent;

    const dialogBg = Array.isArray(dialog?.props.style)
      ? dialog?.props.style.find((s: any) => s && 'backgroundColor' in s)?.backgroundColor
      : undefined;
    const backdropBg = Array.isArray(backdrop?.props.style)
      ? backdrop?.props.style.find((s: any) => s && 'backgroundColor' in s)?.backgroundColor
      : undefined;

    expect(dialogBg).toBe(defaultLightTheme.surface);
    expect(backdropBg).toBe(defaultLightTheme.overlay);
  });

  it('Modal.displayName es "Modal"', () => {
    expect(Modal.displayName).toBe('Modal');
  });
});
