<p align="center">
  <img src="https://raw.githubusercontent.com/YOUR_USERNAME/nexus-ui/main/assets/logo.png" alt="Nexus UI Logo" width="120" height="120" />
</p>

<h1 align="center">⚛️ Nexus UI</h1>

<p align="center">
  <strong>Sistema de diseño modular y escalable para React Native</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/react--native-%3E%3D0.72-brightgreen.svg" alt="React Native" />
  <img src="https://img.shields.io/badge/typescript-strict-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-private-red.svg" alt="License" />
</p>

<p align="center">
  <a href="#-características">Características</a> •
  <a href="#-instalación">Instalación</a> •
  <a href="#-inicio-rápido">Inicio Rápido</a> •
  <a href="#-componentes">Componentes</a> •
  <a href="#-design-tokens">Tokens</a> •
  <a href="#-temas">Temas</a>
</p>

---

## ✨ ¿Qué es Nexus UI?

**Nexus UI** es un Design System completo construido desde cero para React Native, diseñado para crear aplicaciones móviles consistentes, accesibles y visualmente atractivas.

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   🎨  27+ Componentes    │   🌓  Light/Dark Mode Automático     ║
║                          │                                       ║
║   📏  Design Tokens      │   🔧  3 Niveles de Personalización   ║
║                          │                                       ║
║   🪝  7 Custom Hooks     │   📱  iOS + Android                  ║
║                          │                                       ║
║   🧪  Tests con Jest     │   📘  TypeScript Estricto            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🎯 Características

| Feature | Descripción |
|---------|-------------|
| **🧩 Componentes Modulares** | 27+ componentes organizados en 10 categorías, listos para producción |
| **🎨 Design Tokens** | Sistema completo de tokens para colores, espaciado, tipografía, sombras y más |
| **🌓 Temas Dinámicos** | Soporte para Light/Dark mode con auto-detección del sistema |
| **⚡ Alto Rendimiento** | Componentes optimizados con animaciones nativas |
| **📘 TypeScript** | Tipado estricto para mejor DX y menos bugs |
| **♿ Accesibilidad** | Cumple con estándares WCAG 2.1 |
| **🔌 Extensible** | Fácil de personalizar y extender para cualquier app |

---

## 📦 Instalación

```bash
# Instalar como dependencia local
npm install file:../packages/nexus-ui

# Peer dependencies requeridas
npm install react-native-safe-area-context @react-native-async-storage/async-storage
```

---

## 🚀 Inicio Rápido

### 1. Envuelve tu app con el ThemeProvider

```tsx
import { ThemeProvider } from 'nexus-ui';

export default function App() {
  return (
    <ThemeProvider themeConfig={{ primaryColor: 'blue' }}>
      <MyApp />
    </ThemeProvider>
  );
}
```

### 2. Usa los componentes

```tsx
import { 
  useTheme, 
  Button, 
  Card, 
  Input,
  spacing 
} from 'nexus-ui';

function LoginScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <Card variant="elevated">
      <Card.Content>
        <Card.Title>Bienvenido</Card.Title>
        <Card.Description>Inicia sesión para continuar</Card.Description>
        
        <Input 
          label="Email" 
          placeholder="tu@email.com"
        />
        <Input 
          label="Contraseña" 
          secureTextEntry
        />
      </Card.Content>
      
      <Card.Actions>
        <Button title="Iniciar Sesión" variant="primary" />
        <Button title="Registrarse" variant="outline" />
      </Card.Actions>
    </Card>
  );
}
```

---

## 🧩 Componentes

Nexus UI incluye **27+ componentes** organizados en **10 categorías**:

### 📐 Layout

| Componente | Descripción |
|------------|-------------|
| `Card` | Contenedor composable con subcomponentes (Image, Content, Title, Description, Actions) |
| `Divider` | Separador visual horizontal/vertical |

### 🔘 Buttons

| Componente | Descripción |
|------------|-------------|
| `Button` | Botón con 5 variantes (primary, secondary, outline, ghost, danger), 3 tamaños, soporte para iconos |

### ✏️ Inputs

| Componente | Descripción |
|------------|-------------|
| `Input` | Campo de texto con label, validación, iconos y estados |
| `Checkbox` | Checkbox con estados y animaciones |
| `RadioButton` | Radio button para selección única |
| `Switch` | Toggle switch animado |

### 📝 Typography

| Componente | Descripción |
|------------|-------------|
| `Text` | Componente de texto con variantes tipográficas |

### 🖼️ Display

| Componente | Descripción |
|------------|-------------|
| `Avatar` | Avatar de usuario con imagen o iniciales |
| `Badge` | Badges e indicadores de estado |

### 📋 Lists

| Componente | Descripción |
|------------|-------------|
| `ListItem` | Item de lista consistente con iconos y acciones |

### ⏳ Loading

| Componente | Descripción |
|------------|-------------|
| `SkeletonLoader` | Placeholder animado para estados de carga |
| `SkeletonList` | Lista de skeletons predefinida |

### 💬 Feedback

| Componente | Descripción |
|------------|-------------|
| `Toast` | Sistema de notificaciones animadas (success, error, warning, info) |
| `EmptyState` | Estados vacíos con ilustración |
| `ErrorState` | Estados de error con acción de retry |

### 🔲 Overlay

| Componente | Descripción |
|------------|-------------|
| `Modal` | Modal personalizable con animaciones |
| `Alert` | Alertas y diálogos de confirmación |

### 🛠️ Utils

| Componente | Descripción |
|------------|-------------|
| `ErrorBoundary` | Captura y manejo de errores en componentes |

---

## 🎨 Design Tokens

Sistema completo de tokens para mantener consistencia visual:

### Spacing

```tsx
import { spacing } from 'nexus-ui';

// Escala basada en 4px
spacing.xs   // 4
spacing.sm   // 8  
spacing.md   // 12
spacing.lg   // 16
spacing.xl   // 20
spacing.xxl  // 24
```

### Colors

```tsx
import { palette } from 'nexus-ui';

// 6 paletas de colores completas (50-900)
palette.blue[500]    // #2196F3
palette.green[500]   // #4CAF50
palette.purple[500]  // #9C27B0
palette.orange[500]  // #FF9800
palette.red[500]     // #F44336
palette.yellow[500]  // #FFEB3B

// Colores semánticos
palette.success.main  // #4CAF50
palette.error.main    // #F44336
palette.warning.main  // #FF9800
palette.info.main     // #2196F3
```

### Typography

```tsx
import { textVariants } from 'nexus-ui';

textVariants.h1      // Heading 1
textVariants.h2      // Heading 2
textVariants.h3      // Heading 3
textVariants.body    // Body text
textVariants.caption // Caption
```

### Shadows

```tsx
import { shadows, getShadow } from 'nexus-ui';

// 6 niveles de elevación
shadows.none
shadows.sm
shadows.md
shadows.lg
shadows.xl
shadows['2xl']

// Utility con soporte dark mode
getShadow('md', isDark)
```

### Animations

```tsx
import { duration, easing, animations } from 'nexus-ui';

// Duraciones
duration.instant  // 75ms
duration.fast     // 150ms
duration.normal   // 250ms
duration.moderate // 350ms
duration.slow     // 500ms

// Presets de animación
animations.fade
animations.slide
animations.bounce
animations.modal
```

### Border Radius

```tsx
import { borderRadius } from 'nexus-ui';

borderRadius.sm    // 4
borderRadius.md    // 8
borderRadius.lg    // 12
borderRadius.xl    // 16
borderRadius.full  // 9999
```

---

## 🌓 Sistema de Temas

Nexus UI ofrece **3 niveles de personalización** para adaptarse a cualquier app:

### Nivel 1: Simple — Cambiar color primario

```tsx
<ThemeProvider themeConfig={{ primaryColor: 'orange' }}>
  <App />
</ThemeProvider>
```

### Nivel 2: Medio — Colores personalizados por tema

```tsx
const myThemeConfig: ThemeConfig = {
  light: {
    primary: '#FF9800',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
  },
  dark: {
    primary: '#FFB74D',
    background: '#0A0A0A',
    surface: '#1A1A1A',
    text: '#F5F5F5',
  }
};

<ThemeProvider themeConfig={myThemeConfig}>
  <App />
</ThemeProvider>
```

### Nivel 3: Avanzado — Control total con defineTheme

```tsx
import { defineTheme } from 'nexus-ui';

const customTheme = defineTheme({
  light: {
    primary: '#7C3AED',
    primaryLight: '#A78BFA',
    primaryDark: '#5B21B6',
    secondary: '#EC4899',
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: '#18181B',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    // ... todos los colores
  },
  dark: {
    // ... colores para dark mode
  }
});

<ThemeProvider {...customTheme}>
  <App />
</ThemeProvider>
```

### API del Hook useTheme

```tsx
const { 
  theme,           // Tema actual con todos los colores
  isDark,          // Boolean si es dark mode
  mode,            // 'light' | 'dark' | 'auto'
  systemTheme,     // Tema del sistema operativo
  followingSystem, // Si está siguiendo al sistema
  toggleTheme,     // Alterna entre light/dark
  setTheme,        // Establece tema específico
  followSystem,    // Activa auto-detección
} = useTheme();
```

---

## 🪝 Hooks

Nexus UI incluye **7 hooks** reutilizables:

| Hook | Descripción |
|------|-------------|
| `useTheme` | Acceso al tema actual y funciones de control |
| `useToast` | Mostrar notificaciones toast |
| `useDebounce` | Debounce de valores |
| `useAsync` | Manejo de operaciones async con estados |
| `usePrevious` | Obtener valor anterior de una variable |
| `useKeyboard` | Detectar estado del teclado |
| `useMediaQuery` | Responsive design con breakpoints |

### Ejemplo: useToast

```tsx
import { useToast } from 'nexus-ui';

function MyComponent() {
  const { showToast } = useToast();
  
  const handleSave = async () => {
    try {
      await saveData();
      showToast('Guardado exitosamente', 'success');
    } catch {
      showToast('Error al guardar', 'error');
    }
  };
  
  return <Button title="Guardar" onPress={handleSave} />;
}
```

### Ejemplo: useDebounce

```tsx
import { useDebounce } from 'nexus-ui';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return <Input value={query} onChangeText={setQuery} />;
}
```

---

## 🏗️ Arquitectura

```
nexus-ui/
├── src/
│   ├── components/          # Componentes UI organizados por categoría
│   │   ├── buttons/        
│   │   ├── inputs/         
│   │   ├── typography/     
│   │   ├── layout/         
│   │   ├── lists/          
│   │   ├── loading/        
│   │   ├── feedback/       
│   │   ├── display/        
│   │   ├── overlay/        
│   │   └── utils/          
│   │
│   ├── hooks/              # Custom hooks reutilizables
│   │   ├── useTheme.ts
│   │   ├── useToast.ts
│   │   ├── useDebounce.ts
│   │   └── ...
│   │
│   ├── tokens/             # Design tokens
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── shadows.ts
│   │   ├── animations.ts
│   │   ├── borderRadius.ts
│   │   └── breakpoints.ts
│   │
│   ├── theme/              # Sistema de temas
│   │   ├── ThemeProvider.tsx
│   │   ├── createTheme.ts
│   │   └── defineTheme.ts
│   │
│   └── utils/              # Utilidades
│
└── __tests__/              # Tests unitarios
```

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 📱 Apps que usan Nexus UI

| App | Descripción | Color Primario |
|-----|-------------|----------------|
| **Kairo** | App de productividad y hábitos | 🟢 Lime |
| **Drone Tracker** | Seguimiento de flotas de drones | 🔵 Blue |

---

## 🗺️ Roadmap

- [ ] Más componentes (DatePicker, TimePicker, Select)
- [ ] Sistema de iconos integrado
- [ ] Animaciones Reanimated 2
- [ ] Documentación interactiva con Storybook
- [ ] Soporte para Expo Web

---

## 📄 Licencia

**Privado** - Uso interno únicamente.

---

<p align="center">
  Hecho con ❤️ para crear mejores apps React Native
</p>
