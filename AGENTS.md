# AGENTS.md - Dados App

## 📋 Descripción General

**Dados App** es una Progressive Web App (PWA) desarrollada en React que funciona como un lanzador de dados digital, diseñado específicamente para juegos de rol y mesa. La aplicación está optimizada tanto para dispositivos móviles como para visualización en TV.

## 🎯 Propósito

La aplicación permite a los usuarios:
- Lanzar diferentes tipos de dados (d4, d6, d8, d10, d12, d20)
- Crear y guardar macros de tiradas frecuentes
- Ver resultados en tiempo real con animaciones
- Aplicar modificadores a las tiradas
- Mantener un historial de tiradas
- Visualizar resultados en modo TV para compartir con otros jugadores

## 🏗️ Arquitectura

### Tecnologías Principales
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Testing**: Vitest 0.34.3
- **PWA**: Service Worker + Web Manifest

### Estructura del Proyecto

```
dados/
├── src/
│   ├── App.jsx                    # Componente principal con toda la lógica de estado
│   ├── main.jsx                   # Punto de entrada de React
│   ├── tv.jsx                     # Aplicación standalone para modo TV
│   ├── styles.css                 # Estilos globales
│   ├── serviceWorkerRegistration.js
│   ├── components/
│   │   ├── DicePanel.jsx          # Panel de visualización de dados
│   │   ├── Die.jsx                # Componente de dado individual
│   │   ├── DieIcon.jsx            # Iconos de dados
│   │   ├── MacroEditor.jsx        # Editor de macros
│   │   ├── MacroList.jsx          # Lista de macros guardadas
│   │   └── TVView.jsx             # Vista optimizada para TV
│   ├── domain/
│   │   └── rolls.js               # Lógica pura de tiradas (testeable)
│   └── repos/
│       └── macroRepository.js     # Persistencia de macros en localStorage
├── public/
│   ├── manifest.json              # Configuración PWA
│   ├── sw.js                      # Service Worker
│   └── icons/                     # Iconos de la aplicación
└── test/
    └── rolls.test.js              # Tests de lógica de tiradas
```

## 🎮 Funcionalidades Principales

### 1. Sistema de Dados
- Soporte para dados de 4, 6, 8, 10, 12 y 20 caras
- Selección múltiple de dados (ej: 2d20 + 1d6)
- Modificadores numéricos (ej: +5, -2)
- Animaciones durante la tirada
- Visualización clara de resultados individuales y totales

### 2. Sistema de Macros
- Creación de tiradas predefinidas con nombre personalizado
- Iconos emoji para identificación visual
- Formato de texto tipo "2d20+1d6"
- Modificadores asociados a cada macro
- Persistencia en localStorage
- Gestión CRUD de macros (crear, ejecutar, eliminar)

### 3. Historial
- Registro de todas las tiradas realizadas
- Timestamp de cada tirada
- Persistencia en localStorage
- Sincronización con modo TV

### 4. Modo TV
- Vista ampliada para proyección en TV o pantalla compartida
- Actualización automática cada 900ms
- Sincronización con la aplicación principal mediante localStorage
- Animaciones cuando se detectan nuevas tiradas
- Archivo standalone: [tv.html](tv.html) con su propio entry point

### 5. Temas
- Modo claro y oscuro
- Persistencia de preferencia en localStorage
- Aplicación de tema mediante clase CSS en body

## 🔧 Componentes Clave

### App.jsx
Componente principal que gestiona:
- Estado global de la aplicación
- Selección de dados
- Resultados de tiradas
- Macros y su gestión
- Historial
- Modo TV
- Temas

### domain/rolls.js
Módulo de lógica pura (sin efectos secundarios) que contiene:
- `rollDie(sides)`: Lanza un dado de N caras
- `rollMultiple(sides, count)`: Lanza múltiples dados iguales
- `rollConfig(config)`: Procesa una configuración completa de tirada

### macroRepository.js
Abstracción del almacenamiento de macros:
- `load()`: Carga macros desde localStorage
- `save(macros)`: Guarda macros en localStorage

## 📱 Progressive Web App

La aplicación es una PWA completa con:
- Service Worker para funcionamiento offline
- Web Manifest para instalación en dispositivos
- Optimización para móvil y tablet
- Capacidad de añadirse a la pantalla de inicio

## 🎨 Experiencia de Usuario

### Móvil
- Interfaz táctil optimizada
- Paneles desplegables para dados y macros
- Botones grandes y accesibles
- Scroll bloqueado cuando hay paneles abiertos

### TV
- Vista en tiempo real de las tiradas
- Actualización automática sin interacción
- Diseño ampliado para lectura a distancia
- Salida con tecla ESC

## 🧪 Testing

El proyecto incluye tests unitarios para la lógica de dominio:
- Tests de `rollDie`, `rollMultiple`, y `rollConfig`
- Framework: Vitest
- Comando: `npm test`

## 🚀 Uso

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm preview

# Tests
npm test
```

## 💡 Casos de Uso

1. **Jugador de D&D**: Puede crear macros para sus ataques frecuentes (ej: "Espada Larga: 1d20+5") y lanzarlos rápidamente durante el combate.

2. **Master/DM**: Puede usar el modo TV para que todos los jugadores vean los resultados de tiradas importantes en tiempo real.

3. **Juego de Mesa**: Sustituye dados físicos con una solución digital que además mantiene registro histórico.

4. **Entrada Rápida**: Permite escribir directamente fórmulas tipo "2d20+1d6" para tiradas específicas sin crear macros.

## 🎯 Características Técnicas Destacables

- **Sin dependencias pesadas**: Solo React y sus herramientas de desarrollo
- **Arquitectura limpia**: Separación clara entre UI, dominio y persistencia
- **Testeable**: Lógica de negocio pura y aislada
- **Accesible**: Labels ARIA, navegación por teclado
- **Offline-first**: PWA con Service Worker
- **Responsive**: Funciona en móvil, tablet y desktop
- **Multi-pantalla**: Modo TV independiente para segunda pantalla

## 📝 Notas de Desarrollo

- El estado se gestiona con hooks de React (useState, useEffect)
- No usa librerías de routing (es una SPA de una sola vista)
- Persistencia mediante localStorage (sin backend)
- Los IDs se generan con UUID simple basado en Math.random()
- El modo TV es una aplicación React separada que lee el mismo localStorage
    