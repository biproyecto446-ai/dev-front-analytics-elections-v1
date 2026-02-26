/**
 * UI: tarjetas de resumen de elecciones (por año, tabla compacta por corporación).
 */

function escapeHtml(s) {
  if (s == null || s === '') return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

/**
 * @param {HTMLElement} container
 * @param {Array<{ year: number; corporations: Array<{ corporacion: string; totalVotos?: number; partidoGanador?: string; votosPartidoGanador?: number }> }>} summaries
 */
export function renderElectionCards(container, summaries) {
  if (!container) return;
  if (!summaries.length) {
    container.innerHTML = '<p class="cards-loading">No hay datos de elecciones.</p>';
    return;
  }
  container.innerHTML = summaries
    .map((s) => {
      const rowsHtml = (s.corporations || [])
        .map((c) => {
          const totalStr = c.totalVotos != null ? c.totalVotos.toLocaleString('es-CO') : '—';
          const winner = c.partidoGanador || '—';
          const votosStr = c.votosPartidoGanador != null ? c.votosPartidoGanador.toLocaleString('es-CO') : '—';
          return (
            '<tr>' +
            '<td class="election-td-corp">' + escapeHtml(c.corporacion) + '</td>' +
            '<td class="election-td-num">' + totalStr + '</td>' +
            '<td class="election-td-party">' + escapeHtml(winner) + '</td>' +
            '<td class="election-td-num">' + votosStr + '</td>' +
            '</tr>'
          );
        })
        .join('');
      return (
        '<div class="election-card">' +
        '<div class="card-year">Elección ' + s.year + '</div>' +
        '<div class="election-card-table-wrap">' +
        '<table class="election-card-table">' +
        '<thead><tr>' +
        '<th class="election-th-corp">Corporación</th>' +
        '<th class="election-th-num">Total votos</th>' +
        '<th class="election-th-party">Partido más votado</th>' +
        '<th class="election-th-num">Votos</th>' +
        '</tr></thead><tbody>' + rowsHtml + '</tbody></table>' +
        '</div></div>'
      );
    })
    .join('');
}
