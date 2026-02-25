# Frontend – dev-front-appbi-v1

Una sola vista que consume la API del backend **dev-back-appbi-v1** y muestra todos los datos desde la base de datos.

## Contenido de la vista

1. **Estado de conexión** – Indica si la API responde.
2. **Filtros** – Departamentos (máx. 3, valores de `des_dd`) y año (valores de `num_año`).
3. **Reporte electoral** – Partido ganador por departamento, Top 5 partidos, gráfico de tendencia histórica (todo desde la API).
4. **Tabla de registros** – Datos paginados de `election_results_unified_sample` (paginación 50/100/200).

## Requisito

El backend debe estar en marcha en **http://localhost:3001**.

## Uso

```bash
npm run dev
```

Abre **http://localhost:3000** – es la única página; todos los datos se cargan desde la API.

Si el backend usa otro puerto, cambia la constante `API` en `index.html`.
