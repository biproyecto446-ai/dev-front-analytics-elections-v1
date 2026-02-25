/**
 * Configuración de la aplicación (puerto de configuración).
 * En producción puede inyectarse desde variables de entorno o otro adaptador.
 */
export const config = {
  apiBaseUrl: window.__APP_CONFIG__?.apiBaseUrl ?? 'http://localhost:3001',
};
