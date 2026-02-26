/**
 * UI: tabla de resultados y subtítulo (sin lógica de negocio).
 */

/**
 * @param {HTMLElement | null} resultsSubtitle
 * @param {number} count
 * @param {string | null} excludedName
 */
export function setResultsSubtitle(resultsSubtitle, count, excludedName) {
  if (!resultsSubtitle) return;
  if (!count) {
    resultsSubtitle.textContent = '';
    return;
  }
  let text = count + ' partido' + (count !== 1 ? 's' : '');
  if (excludedName) text += ' · Comparando con ' + excludedName;
  resultsSubtitle.textContent = text;
}

function escapeHtml(s) {
  if (s == null || s === '') return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

/**
 * @param {HTMLElement} tableHeadRow
 * @param {HTMLElement} tableBody
 * @param {HTMLElement} tableWrap
 * @param {Array<{ partido: string; totalVotos?: number; rank: number }>} rows
 * @param {{ name: string; totalVotos: number } | undefined} excluded
 */
export function renderResultsTable(tableHeadRow, tableBody, tableWrap, rows, excluded) {
  const showComparacion = excluded?.totalVotos != null && excluded.totalVotos > 0;
  const refVotos = excluded?.totalVotos ?? 0;

  /** Incluir partido a comparar en la tabla: unir, ordenar por votos y reasignar rank. */
  let rowsToShow = rows.map((r) => ({ partido: r.partido, totalVotos: r.totalVotos, rank: r.rank, isComparacion: false }));
  if (excluded?.name != null && excluded.name !== '') {
    rowsToShow.push({
      partido: excluded.name,
      totalVotos: excluded.totalVotos,
      rank: -1,
      isComparacion: true,
    });
    rowsToShow.sort((a, b) => (b.totalVotos ?? 0) - (a.totalVotos ?? 0));
    rowsToShow.forEach((r, i) => {
      r.rank = i + 1;
    });
  }

  const thComparacion = document.getElementById('thComparacion');
  if (showComparacion && !thComparacion) {
    const th = document.createElement('th');
    th.id = 'thComparacion';
    th.className = 'col-comparacion';
    th.textContent = 'Comparación';
    tableHeadRow.appendChild(th);
  } else if (!showComparacion && thComparacion) {
    thComparacion.remove();
  }

  tableBody.innerHTML = rowsToShow
    .map((row) => {
      const votosStr = row.totalVotos != null ? row.totalVotos.toLocaleString('es-CO') : '—';
      let comparacionCell = '';
      if (showComparacion && refVotos > 0 && row.totalVotos != null) {
        if (row.isComparacion) {
          comparacionCell = '<td class="col-comparacion">Referencia</td>';
        } else {
          const pct = ((row.totalVotos - refVotos) / refVotos) * 100;
          const pctStr = (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
          const clase = pct >= 0 ? 'comparacion-arriba' : 'comparacion-abajo';
          const texto = pct >= 0 ? pctStr + ' por encima' : pctStr + ' por debajo';
          comparacionCell = '<td class="col-comparacion ' + clase + '">' + texto + '</td>';
        }
      } else if (showComparacion) {
        comparacionCell = '<td class="col-comparacion">' + (row.isComparacion ? 'Referencia' : '—') + '</td>';
      }
      const trClass = row.isComparacion ? ' tr-partido-comparado' : '';
      return '<tr class="' + trClass + '"><td class="col-rank">' + row.rank + '</td><td class="col-partido">' + escapeHtml(row.partido || '—') + '</td><td class="col-votos">' + votosStr + '</td>' + comparacionCell + '</tr>';
    })
    .join('');
  tableWrap.style.display = 'block';
}
