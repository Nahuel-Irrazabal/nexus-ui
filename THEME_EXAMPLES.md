# 🎨 Guía Completa de Personalización de Temas

Esta guía muestra cómo personalizar colores y temas en **@nexus-ui/design-system** con ejemplos prácticos para diferentes niveles de complejidad.

---

## 📚 Tabla de Contenidos

1. [Nivel 1: Simple - Solo cambiar color primario](#nivel-1-simple)
2. [Nivel 2: Medio - Personalización por tema](#nivel-2-medio)
3. [Nivel 3: Avanzado - Control total](#nivel-3-avanzado)
4. [Ejemplos Completos por App](#ejemplos-completos)
5. [Estilos de componentes (Input)](#estilos-de-componentes-input)
6. [Tips y Mejores Prácticas](#tips-y-mejores-prácticas)

---

## 🟢 NIVEL 1: Simple - Solo cambiar color primario

**Caso de uso:** Necesitas cambiar rápidamente el color primario de tu app usando una paleta predefinida.

**Colores disponibles:** `'blue'`, `'green'`, `'purple'`, `'orange'`, `'red'`, `'yellow'`

### Ejemplo: App con Color Naranja

```typescript
// App.tsx
import { ThemeProvider } from '@nexus-ui/design-system';

export default function App() {
  return (
    <ThemeProvider themeConfig={{ primaryColor: 'orange' }}>
      <MyApp />
    </ThemeProvider>
  );
}
```

**Resultado:**
- ✅ Light theme: Naranja 500, 300, 700
- ✅ Dark theme: Naranja 400, 300, 600
- ✅ Todo lo demás usa valores por defecto

---

## 🟡 NIVEL 2: Medio - Personalización por tema

**Caso de uso:** Necesitas colores específicos o personalizar superficies, textos y bordes para cada tema.

### Ejemplo 1: Calculator App - Naranja Personalizado

```typescript
// calculator-app/src/theme/calculatorTheme.ts
import { ThemeConfig } from '@nexus-ui/design-system';

export const calculatorThemeConfig: ThemeConfig = {
  light: {
    // Primarios
    primary: '#FF9800',
    primaryLight: '#FFB74D',
    primaryDark: '#F57C00',
    
    // Superficies
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceVariant: '#EEEEEE',
    
    // Textos
    text: '#212121',
    textSecondary: '#616161',
    textDisabled: '#9E9E9E',
    
    // Bordes
    border: '#E0E0E0',
    divider: '#EEEEEE',
  },
  
  dark: {
    // Primarios más claros para dark
    primary: '#FFB74D',
    primaryLight: '#FFCC80',
    primaryDark: '#FB8C00',
    
    // Superficies oscuras personalizadas
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceVariant: '#2A2A2A',
    
    // Textos claros
    text: '#F5F5F5',
    textSecondary: '#BDBDBD',
    textDisabled: '#757575',
    
    // Bordes
    border: '#424242',
    divider: '#2A2A2A',
  },
};
```

```typescript
// calculator-app/App.tsx
import { ThemeProvider } from '@nexus-ui/design-system';
import { calculatorThemeConfig } from './src/theme/calculatorTheme';

export default function App() {
  return (
    <ThemeProvider themeConfig={calculatorThemeConfig}>
      <CalculatorApp />
    </ThemeProvider>
  );
}
```

### Ejemplo 2: Archive Box - Azul Profesional

```typescript
// archive-box/src/theme/archiveBoxTheme.ts
import { ThemeConfig } from '@nexus-ui/design-system';

export const archiveBoxThemeConfig: ThemeConfig = {
  light: {
    // Azules profesionales
    primary: '#1976D2',
    primaryLight: '#42A5F5',
    primaryDark: '#1565C0',
    
    // Superficies limpias
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceVariant: '#F3F4F6',
    
    // Textos con alto contraste
    text: '#111827',
    textSecondary: '#6B7280',
    textDisabled: '#9CA3AF',
    
    // Bordes sutiles
    border: '#E5E7EB',
    divider: '#F3F4F6',
  },
  
  dark: {
    // Azules para dark mode
    primary: '#42A5F5',
    primaryLight: '#64B5F6',
    primaryDark: '#1E88E5',
    
    // Oscuro profundo
    background: '#0F1419',
    surface: '#1A1F26',
    surfaceVariant: '#252A31',
    
    // Textos
    text: '#F3F4F6',
    textSecondary: '#9CA3AF',
    textDisabled: '#6B7280',
    
    // Bordes
    border: '#374151',
    divider: '#1F2937',
  },
};
```

### Ejemplo 3: Kairo - Lime Energético (Ya implementado)

```typescript
// kairo/src/theme/kairoTheme.ts
import { ThemeConfig } from 'nexus-ui';

export const kairoThemeConfig: ThemeConfig = {
  light: {
    // Lime energético
    primary: '#9AE66E',
    primaryLight: '#BFF4A5',
    primaryDark: '#6FBA4D',
    
    // Fondo claro y minimal
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    
    // Textos con alto contraste
    text: '#0B0F14',
    textSecondary: '#475569',
    textDisabled: '#94A3B8',
    
    // Bordes sutiles
    border: '#E5E7EB',
    divider: '#E5E7EB',
  },
  
  dark: {
    // Lime más brillante para dark
    primary: '#BFF4A5',
    primaryLight: '#D4F8C4',
    primaryDark: '#9AE66E',
    
    // Oscuro con contraste
    background: '#0F172A',
    surface: '#1E293B',
    surfaceVariant: '#334155',
    
    // Textos
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textDisabled: '#64748B',
    
    // Bordes
    border: '#475569',
    divider: '#334155',
  },
};
```

---

## 🔴 NIVEL 3: Avanzado - Control total

**Caso de uso:** Necesitas control absoluto sobre TODOS los colores, incluyendo estados (success, error, etc) y efectos.

### Ejemplo: E-commerce App con Identidad Completa

```typescript
// ecommerce-app/src/theme/ecommerceTheme.ts
import { defineTheme } from '@nexus-ui/design-system';

export const ecommerceTheme = defineTheme({
  light: {
    // Primarios (Brand colors)
    primary: '#7C3AED',        // Púrpura vibrante
    primaryLight: '#A78BFA',
    primaryDark: '#5B21B6',
    
    // Secundarios (Accent)
    secondary: '#EC4899',      // Rosa para promociones
    secondaryLight: '#F472B6',
    secondaryDark: '#BE185D',
    
    // Superficies
    background: '#FFFFFF',
    surface: '#FAFAFA',
    surfaceVariant: '#F5F5F5',
    
    // Textos
    text: '#18181B',
    textSecondary: '#71717A',
    textDisabled: '#A1A1AA',
    
    // Bordes
    border: '#E4E4E7',
    divider: '#F4F4F5',
    
    // Estados personalizados
    success: '#10B981',        // Verde para "Añadido al carrito"
    error: '#EF4444',          // Rojo para errores
    warning: '#F59E0B',        // Ámbar para stock bajo
    info: '#3B82F6',           // Azul para información
    
    // Efectos
    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  
  dark: {
    // Primarios más claros para dark
    primary: '#A78BFA',
    primaryLight: '#C4B5FD',
    primaryDark: '#7C3AED',
    
    // Secundarios
    secondary: '#F472B6',
    secondaryLight: '#F9A8D4',
    secondaryDark: '#EC4899',
    
    // Superficies oscuras premium
    background: '#09090B',     // Negro casi puro
    surface: '#18181B',        // Zinc 900
    surfaceVariant: '#27272A', // Zinc 800
    
    // Textos
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textDisabled: '#52525B',
    
    // Bordes
    border: '#3F3F46',
    divider: '#27272A',
    
    // Estados
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
    
    // Efectos
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.75)',
  },
});
```

```typescript
// ecommerce-app/App.tsx
import { ThemeProvider } from '@nexus-ui/design-system';
import { ecommerceTheme } from './src/theme/ecommerceTheme';

export default function App() {
  return (
    <ThemeProvider {...ecommerceTheme}>
      <EcommerceApp />
    </ThemeProvider>
  );
}
```

**Ventajas de `defineTheme()`:**
- ✅ Control total sobre TODOS los colores
- ✅ Personalización de estados (success, error, etc)
- ✅ Personalización de efectos (sombras, overlays)
- ✅ Type-safety completo
- ✅ Defaults inteligentes

---

## 📋 Ejemplos Completos por App

### Calculator App (Naranja Energético)

<details>
<summary>Ver código completo</summary>

```typescript
// calculator-app/src/theme/calculatorTheme.ts
import { ThemeConfig } from '@nexus-ui/design-system';

/**
 * Tema Calculator - Naranja energético y moderno
 * Inspirado en calculadoras premium con interfaz limpia
 */
export const calculatorThemeConfig: ThemeConfig = {
  light: {
    primary: '#FF9800',
    primaryLight: '#FFB74D',
    primaryDark: '#F57C00',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#616161',
    border: '#E0E0E0',
  },
  dark: {
    primary: '#FFB74D',
    primaryLight: '#FFCC80',
    primaryDark: '#FB8C00',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#F5F5F5',
    textSecondary: '#BDBDBD',
    border: '#424242',
  },
};
```

```typescript
// calculator-app/App.tsx
import { ThemeProvider } from '@nexus-ui/design-system';
import { calculatorThemeConfig } from './src/theme/calculatorTheme';

export default function App() {
  return (
    <ThemeProvider themeConfig={calculatorThemeConfig}>
      <CalculatorScreen />
    </ThemeProvider>
  );
}
```
</details>

### Archive Box (Azul Profesional)

<details>
<summary>Ver código completo</summary>

```typescript
// archive-box/src/theme/archiveBoxTheme.ts
import { ThemeConfig } from '@nexus-ui/design-system';

/**
 * Tema Archive Box - Azul profesional y confiable
 * Diseñado para lectura prolongada y organización
 */
export const archiveBoxThemeConfig: ThemeConfig = {
  light: {
    primary: '#1976D2',
    primaryLight: '#42A5F5',
    primaryDark: '#1565C0',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceVariant: '#F3F4F6',
    text: '#111827',
    textSecondary: '#6B7280',
    textDisabled: '#9CA3AF',
    border: '#E5E7EB',
    divider: '#F3F4F6',
  },
  dark: {
    primary: '#42A5F5',
    primaryLight: '#64B5F6',
    primaryDark: '#1E88E5',
    background: '#0F1419',
    surface: '#1A1F26',
    surfaceVariant: '#252A31',
    text: '#F3F4F6',
    textSecondary: '#9CA3AF',
    textDisabled: '#6B7280',
    border: '#374151',
    divider: '#1F2937',
  },
};
```

```typescript
// archive-box/App.tsx
import { ThemeProvider } from '@nexus-ui/design-system';
import { archiveBoxThemeConfig } from './src/theme/archiveBoxTheme';

export default function App() {
  return (
    <ThemeProvider themeConfig={archiveBoxThemeConfig}>
      <AppNavigator />
    </ThemeProvider>
  );
}
```
</details>

---

## 🧩 Estilos de componentes (Input)

**Caso de uso:** Definir el look de los inputs (box con borde completo, underline, etc.) por app vía theme, sin tocar cada pantalla.

El tema admite `components.input` con propiedades opcionales: `borderRadius`, `borderWidth`, `borderBottomWidth`, `backgroundColor`, `paddingHorizontal`, `paddingVertical`, `labelFontSize`, `helperFontSize`, `inputFontSize`. La librería exporta el preset **`underlineInputTheme`** (solo borde inferior, fondo transparente).

### Con defineTheme (recomendado)

```typescript
import { defineTheme, underlineInputTheme } from 'nexus-ui';

export const myTheme = defineTheme({
  light: {
    primary: '#3B82F6',
    background: '#F8FAFC',
    // ... resto de colores
    components: { input: underlineInputTheme },
  },
  dark: {
    primary: '#60A5FA',
    background: '#0F172A',
    // ... resto de colores
    components: { input: underlineInputTheme },
  },
});
```

### Con createTheme (themeConfig)

```typescript
import { createTheme } from 'nexus-ui';

const { light, dark } = createTheme({
  components: {
    input: {
      borderWidth: 0,
      borderBottomWidth: 1,
      backgroundColor: 'transparent',
      borderRadius: 0,
    },
  },
});
// Pasar light/dark a ThemeProvider vía lightTheme/darkTheme
```

### Personalización granular

```typescript
components: {
  input: {
    ...underlineInputTheme,
    labelFontSize: 15,
    paddingVertical: 14,
  },
},
```

---

## 💡 Tips y Mejores Prácticas

### 1. **Contraste de Colores**

Asegúrate de que tus colores cumplan con WCAG 2.1:
- Texto sobre fondo: Mínimo 4.5:1
- Textos grandes: Mínimo 3:1

```typescript
// ✅ BIEN: Alto contraste
text: '#111827',        // Muy oscuro
background: '#FFFFFF',  // Blanco

// ❌ MAL: Bajo contraste
text: '#CCCCCC',        // Gris claro
background: '#FFFFFF',  // Blanco
```

### 2. **Dark Theme - Colores más claros**

En dark mode, los primarios deben ser más claros para mantener contraste:

```typescript
light: {
  primary: '#FF9800',  // Naranja 500
},
dark: {
  primary: '#FFB74D',  // Naranja 300-400 (más claro)
}
```

### 3. **Superficies en Dark Mode**

Usa grises muy oscuros, no negro puro:

```typescript
// ✅ BIEN: Oscuros pero con contraste
background: '#0A0A0A',  // Casi negro
surface: '#1A1A1A',     // Gris muy oscuro
surfaceVariant: '#2A2A2A', // Gris oscuro

// ❌ MAL: Todo negro puro
background: '#000000',
surface: '#000000',
surfaceVariant: '#000000',
```

### 4. **Consistencia entre Temas**

Mantén la misma jerarquía visual en ambos temas:

```typescript
// ✅ BIEN: Jerarquía consistente
light: {
  text: '#111827',           // Muy oscuro
  textSecondary: '#6B7280',  // Gris medio
  textDisabled: '#9CA3AF',   // Gris claro
},
dark: {
  text: '#F3F4F6',           // Muy claro
  textSecondary: '#9CA3AF',  // Gris medio
  textDisabled: '#6B7280',   // Gris oscuro
}
```

### 5. **Testing en Ambos Temas**

Siempre prueba tu app en light y dark:

```typescript
// En tu pantalla de settings
<Button 
  title="Toggle Theme" 
  onPress={toggleTheme}
/>
```

### 6. **Paletas Predefinidas son tu Amigo**

Para empezar rápido, usa las paletas de `palette`:

```typescript
import { palette } from '@nexus-ui/design-system';

// Usar paleta completa
light: {
  primary: palette.purple[500],
  primaryLight: palette.purple[300],
  primaryDark: palette.purple[700],
}
```

---

## 🎨 Generadores de Paletas Recomendados

- **[Coolors.co](https://coolors.co/)** - Generador de paletas
- **[Paletton](https://paletton.com/)** - Esquemas de color
- **[Adobe Color](https://color.adobe.com/)** - Herramienta profesional
- **[Contrast Checker](https://webaim.org/resources/contrastchecker/)** - Verificar accesibilidad

---

## 📚 Referencias

- [Material Design Color System](https://material.io/design/color/the-color-system.html)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [iOS Human Interface Guidelines - Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)

---

**¿Tienes dudas?** Consulta el [README principal](./README.md) o revisa los archivos de tema de las apps existentes como referencia.

