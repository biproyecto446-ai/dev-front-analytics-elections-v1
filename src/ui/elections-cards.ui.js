/**
 * UI: tarjetas de resumen de elecciones.
 */

/**
 * @param {HTMLElement} container
 * @param {Array<{ year: number; totalVotos?: number; partidoGanador?: string; votosPartidoGanador?: number }>} summaries
 */
export function renderElectionCards(container, summaries) {
  if (!container) return;
  if (!summaries.length) {
    container.innerHTML = '<p class="cards-loading">No hay datos de elecciones.</p>';
    return;
  }
  container.innerHTML = summaries
    .map((s) => {
      const totalStr = s.totalVotos != null ? s.totalVotos.toLocaleString('es-CO') : '—';
      const winner = s.partidoGanador || '—';
      const votosGanadorStr = s.votosPartidoGanador != null ? s.votosPartidoGanador.toLocaleString('es-CO') : '—';
      return (
        '<div class="election-card">' +
        '<div class="card-year">Elección ' + s.year + '</div>' +
        '<div class="card-total">Total votos: <span>' + totalStr + '</span></div>' +
        '<div class="card-winner">Partido más votado: <strong>' + winner + '</strong></div>' +
        '<div class="card-winner-votes">Votos del partido: <span>' + votosGanadorStr + '</span></div>' +
        '</div>'
      );
    })
    .join('');
}
