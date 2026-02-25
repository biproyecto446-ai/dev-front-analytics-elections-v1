/**
 * UI: gráfica y etiquetas encima (sin lógica de negocio).
 */

function escapeLabel(s) {
  return String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function updateChartLabels(el, opts) {
  if (!el) return;
  var partyName = opts.partyName;
  var partyTotalVotos = opts.partyTotalVotos;
  var deptName = opts.deptName;
  var totalVotosDept = opts.totalVotosDept;
  var munName = opts.munName;
  var totalVotosMun = opts.totalVotosMun;
  if (!partyName) {
    el.innerHTML = '';
    return;
  }
  var parts = [];
  parts.push('<span class="chart-label party"><strong>' + escapeLabel(partyName) + '</strong></span>');
  if (partyTotalVotos != null && !Number.isNaN(partyTotalVotos)) {
    parts.push('<span class="chart-label party">Total votos: <strong>' + Number(partyTotalVotos).toLocaleString('es-CO') + '</strong></span>');
  }
  if (deptName && totalVotosDept != null && !Number.isNaN(totalVotosDept)) {
    parts.push('<span class="chart-label dept">Total votos ' + escapeLabel(deptName) + ': <strong>' + Number(totalVotosDept).toLocaleString('es-CO') + '</strong></span>');
  }
  if (munName && totalVotosMun != null && !Number.isNaN(totalVotosMun)) {
    parts.push('<span class="chart-label dept">Total votos ' + escapeLabel(munName) + ': <strong>' + Number(totalVotosMun).toLocaleString('es-CO') + '</strong></span>');
  }
  el.innerHTML = parts.join('');
}

export function renderTopPartidosChart(canvas, rows, excludedParty, refs, ChartLib) {
  if (!canvas || !ChartLib) return null;
  var chartPanel = refs.chartPanel;
  var chartPlaceholder = refs.chartPlaceholder;
  var labels = rows.map(function(r) { return r.partido || '—'; });
  var data = rows.map(function(r) { return r.totalVotos != null ? r.totalVotos : 0; });
  var barGray = '#9ca3af';
  var backgroundColors = rows.map(function() { return barGray; });
  if (excludedParty && excludedParty.name && (excludedParty.totalVotos == null || excludedParty.totalVotos > 0)) {
    labels.push('Comparar: ' + (excludedParty.name || '—'));
    data.push(excludedParty.totalVotos || 0);
    backgroundColors.push('#22c55e');
  }
  if (chartPanel) chartPanel.style.display = 'block';
  if (chartPlaceholder) chartPlaceholder.classList.add('hidden');
  var instance = new ChartLib(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total votos',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
        barPercentage: 0.75,
        categoryPercentage: 0.85,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { left: 8, right: 16, top: 8, bottom: 8 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              var v = ctx.raw;
              return v != null ? v.toLocaleString('es-CO') + ' votos' : '';
            },
          },
        },
      },
      scales: {
        x: {
          min: 0,
          ticks: { color: '#6b7280', font: { size: 11 }, callback: function(v) { return typeof v === 'number' ? v.toLocaleString('es-CO') : v; } },
          grid: { color: 'rgba(0,0,0,0.06)' },
        },
        y: {
          ticks: { color: '#374151', font: { size: 11 }, autoSkip: false },
          grid: { display: false },
        },
      },
    },
  });
  return instance;
}
