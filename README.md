# 🎲 Dados - Lanzador de Dados Digital

> Progressive Web App para lanzar dados de juegos de rol y mesa. Optimizado para móvil y pantalla compartida en TV.

[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5a0fc8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)](https://vitejs.dev/)

## ✨ Características

### 🎯 Sistema de Dados Completo
- **Soporte multi-dado**: d4, d6, d8, d10, d12, d20
- **Tiradas combinadas**: Lanza varios dados a la vez (ej: `2d20+1d6`)
- **Modificadores**: Añade bonificadores o penalizadores a tus tiradas
- **Resultados detallados**: Ve cada dado individual y el total
- **Animaciones**: Efectos visuales durante las tiradas

### ⚡ Macros Inteligentes
- **Botones rápidos**: En móvil, tus macros aparecen como botones ejecutables
- **Creación sencilla**: Define tiradas frecuentes con nombre y emoji
- **Sintaxis clara**: Escribe `2d20+1d6` y añade modificadores
- **Persistencia**: Tus macros se guardan automáticamente
- **Panel scrolleable**: Crea todas las macros que necesites

### 📱 Optimizado para Móvil
- **Interfaz compacta**: Diseño ultra-eficiente para pantallas pequeñas
- **Acceso rápido**: Ejecuta macros sin abrir el panel lateral
- **Modo offline**: Funciona sin conexión (PWA)
- **Instalable**: Añádelo a tu pantalla de inicio

### 📺 Modo TV
- **Segunda pantalla**: Proyecta los resultados en TV o monitor
- **Actualización automática**: Los resultados aparecen en tiempo real
- **Sincronización**: Comparte las tiradas con todos los jugadores
- **Vista ampliada**: Lectura fácil desde la distancia

### 🎨 Personalización
- **Tema claro**: Colores cálidos para entornos iluminados
- **Tema oscuro**: Estilo synthwave con neones para ambientes tenues
- **Historial**: Revisa todas tus tiradas anteriores

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Construir para producción
npm run build

# 4. Vista previa de producción
npm preview

# 5. Ejecutar tests
npm test
```

## 💡 Casos de Uso

### Jugador de D&D / Pathfinder
```
Macro: "Espada Larga"
Fórmula: 1d20
Modificador: +5
```
Un click y lanzas tu ataque más común.

### Master / DM
```
Abre tv.html en un segundo monitor o TV
Todos los jugadores ven los resultados en grande
Ideal para tiradas importantes o combates
```

### Juego de Mesa
```
Sustituye dados físicos
Mantén historial de tiradas
Sin dados perdidos bajo la mesa
```

### Entrada Directa
```
Escribe "3d6+2d4" en el campo de entrada rápida
Ejecuta tiradas complejas sin crear macros
```

## 📋 Funcionalidades Detalladas

### Panel de Dados
- Selecciona tipo y cantidad de dados visualmente
- Añade modificadores numéricos (+/-)
- Botón "Lanzar" grande y accesible
- Resultados con animación

### Sistema de Macros
- **Crear**: Nombre personalizado + emoji + fórmula
- **Ejecutar**: Click en el botón de la macro
- **Gestionar**: Botón × para eliminar macros
- **Mobile**: Botones quick-access (4 por fila)
- **Desktop**: Panel lateral siempre visible

### Historial
- Todas las tiradas con timestamp
- Nombre de la macro ejecutada (si aplica)
- Resultados detallados de cada dado
- Total final con modificadores

### Modo TV (`tv.html`)
- **Sincronización**: Lee localStorage cada 900ms
- **Animaciones**: Flash visual en nuevas tiradas
- **Responsive**: Se adapta a cualquier resolución
- **Salida**: Tecla ESC para cerrar

## 🏗️ Arquitectura

```
src/
├── App.jsx              # Lógica principal y estado
├── tv.jsx               # Aplicación TV independiente
├── domain/
│   └── rolls.js         # Lógica pura de tiradas (testeable)
├── repos/
│   └── macroRepository.js  # Persistencia localStorage
└── components/
    ├── DicePanel.jsx    # Selección y visualización
    ├── MacroEditor.jsx  # Creador de macros
    ├── MacroList.jsx    # Lista de macros guardadas
    └── TVView.jsx       # Vista modo TV
```

## 🧪 Testing

El proyecto incluye tests unitarios para la lógica de dominio:

```bash
npm test
```

Tests de `domain/rolls.js`:
- `rollDie(sides)`: Genera número entre 1 y N
- `rollMultiple(sides, count)`: Múltiples dados
- `rollConfig(config)`: Configuración completa

## 🔧 Tecnologías

- **React 18.2**: Framework UI con hooks
- **Vite 5.0**: Build tool ultrarrápido
- **Vitest 0.34**: Testing framework
- **Service Worker**: Soporte offline (PWA)
- **localStorage**: Persistencia sin backend

## 📱 PWA Features

- ✅ **Instalable**: Añade a pantalla de inicio
- ✅ **Offline**: Funciona sin conexión
- ✅ **Responsive**: Móvil, tablet, desktop
- ✅ **Manifest**: Iconos y configuración PWA
- ✅ **Service Worker**: Cache de assets

## 🎨 Temas

### Claro
- Fondo crema (#f9f5f0)
- Paneles cálidos (#fff8f0)
- Acento naranja (#d97706)

### Oscuro (Synthwave)
- Fondo profundo (#0a0a0f)
- Paneles oscuros (#1a1a2e)
- Acento cyan neón (#00ffd5)
- Rosa neón (#ff2d95)

## 🤝 Contribuir

Este es un proyecto personal, pero las sugerencias son bienvenidas.

## 📄 Licencia

MIT

---

**[By rturv (GitHub)](https://github.com/rturv/lanzador-dados)** · Hecho con ❤️ para jugadores de rol
