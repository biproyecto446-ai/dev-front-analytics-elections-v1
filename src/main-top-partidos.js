/**
 * Entry point página Top Partidos.
 */
import { initTopPartidosPage } from './pages/top-partidos.page.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTopPartidosPage);
} else {
  initTopPartidosPage();
}
