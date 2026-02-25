# Arquitectura hexagonal - Frontend

## Estructura

```
src/
├── config/           # Configuración (puerto de config)
│   └── index.js      # apiBaseUrl, etc.
├── domain/           # Dominio (entidades, tipos)
│   └── entities.js  # Tipos JSDoc, constantes sin dependencias
├── ports/            # Puertos (contratos)
│   └── congreso-api.port.js   # Interfaz del servicio API Congreso
├── adapters/         # Adaptadores (implementaciones)
│   └── http-congreso-api.adapter.js   # Cliente HTTP que implementa el puerto API
├── application/      # Casos de uso
│   └── use-cases/
│       └── congreso.use-cases.js   # loadYears, loadDepartments, loadTopPartidos, etc.
├── ui/               # Capa de presentación (vista)
│   ├── chart.ui.js         # Gráfica y etiquetas
│   ├── table.ui.js         # Tabla de resultados
│   └── elections-cards.ui.js   # Tarjetas de elecciones
├── pages/            # Composición (entry por página)
│   └── top-partidos.page.js   # Conecta adapters, use cases y UI para Top Partidos
└── main-top-partidos.js   # Entry point: initTopPartidosPage()
```

## Flujo

1. **HTML** carga Chart.js y luego `src/main-top-partidos.js` (módulo ES).
2. **main-top-partidos.js** llama a `initTopPartidosPage()` cuando el DOM está listo.
3. **top-partidos.page.js** (composición):
   - Crea el adaptador HTTP (`createHttpCongresoApi()`) que implementa el puerto.
   - Crea los casos de uso inyectando el adaptador.
   - Obtiene refs del DOM y enlaza eventos.
   - Los casos de uso solo hablan con el puerto; la página actualiza la UI con los datos.

## Dependencias

- **Dominio**: sin dependencias.
- **Puertos**: solo tipos (JSDoc).
- **Adaptadores**: dependen de `config` y del puerto.
- **Use cases**: dependen solo del puerto (inyección).
- **UI**: funciones puras (datos + refs DOM).
- **Páginas**: ensamblan adapters, use cases y UI; conocen el DOM.

## Configuración

Por defecto la API está en `http://localhost:3001`. Para cambiar:

```html
<script>window.__APP_CONFIG__={apiBaseUrl:'https://mi-api.com'};</script>
<script type="module" src="src/main-top-partidos.js"></script>
```
