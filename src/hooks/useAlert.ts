/**
 * useAlert Hook
 * Hook para mostrar diálogos de confirmación con el componente Alert
 */

import { useContext } from 'react';
import { AlertContext } from '../components/overlay/Alert/AlertProvider';

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe usarse dentro de AlertProvider');
  }
  return context;
}
