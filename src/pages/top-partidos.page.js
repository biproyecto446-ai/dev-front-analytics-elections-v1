/**
 * Página Top Partidos - Composición (arquitectura hexagonal).
 * Conecta puertos, adaptadores, casos de uso y UI.
 */
import { createHttpCongresoApi } from '../adapters/http-congreso-api.adapter.js';
import { createCongresoUseCases } from '../application/use-cases/congreso.use-cases.js';
import { updateChartLabels, renderTopPartidosChart } from '../ui/chart.ui.js';
import { setResultsSubtitle, renderResultsTable } from '../ui/table.ui.js';
import { renderElectionCards } from '../ui/elections-cards.ui.js';

function getRefs() {
  return {
    pageLoader: document.getElementById('pageLoader'),
    pageLoaderText: document.getElementById('pageLoaderText'),
    filterYear: document.getElementById('filterYear'),
    filterCorporacion: document.getElementById('filterCorporacion'),
    filterDept: document.getElementById('filterDept'),
    filterMun: document.getElementById('filterMun'),
    partyTrigger: document.getElementById('partyTrigger'),
    partyTriggerText: document.getElementById('partyTriggerText'),
    partySearchInput: document.getElementById('partySearchInput'),
    partyList: document.getElementById('partyList'),
    filterPartyValue: document.getElementById('filterPartyValue'),
    partyCombobox: document.getElementById('partyCombobox'),
    btnApply: document.getElementById('btnApply'),
    btnClear: document.getElementById('btnClear'),
    tableHeadRow: document.getElementById('tableHeadRow'),
    tableLoading: document.getElementById('tableLoading'),
    tableError: document.getElementById('tableError'),
    tableEmpty: document.getElementById('tableEmpty'),
    tableWrap: document.getElementById('tableWrap'),
    tableBody: document.getElementById('tableBody'),
    electionCards: document.getElementById('electionCards'),
    cardsLoading: document.getElementById('cardsLoading'),
    chartPanel: document.getElementById('chartPanel'),
    chartPlaceholder: document.getElementById('chartPlaceholder'),
    chartLabels: document.getElementById('chartLabels'),
    resultsSubtitle: document.getElementById('resultsSubtitle'),
    topPartidosChart: document.getElementById('topPartidosChart'),
  };
}

function showLoader(refs, text) {
  if (refs.pageLoader) {
    refs.pageLoader.classList.remove('hidden');
    if (refs.pageLoaderText) refs.pageLoaderText.textContent = text || 'Cargando…';
  }
}

function hideLoader(refs) {
  if (refs.pageLoader) refs.pageLoader.classList.add('hidden');
}

function setConnectionStatus(refs, ok, msg) {
  var dot = document.getElementById('apiStatusDot');
  var a11y = document.getElementById('apiStatusA11y');
  if (dot) dot.className = 'status-dot ' + (ok ? 'ok' : 'error');
  if (dot) dot.title = ok ? 'Conectado a la API' : (msg || 'Sin conexión');
  if (a11y) a11y.textContent = ok ? 'Conectado a la API' : (msg || 'Error de conexión');
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function initTopPartidosPage() {
  const refs = getRefs();
  const api = createHttpCongresoApi();
  const useCases = createCongresoUseCases(api);
  var years = [];
  var departments = [];
  var municipalities = [];
  var partiesList = [];
  var topPartidosChartInstance = null;
  const ChartLib = typeof window !== 'undefined' && window.Chart ? window.Chart : null;

  function renderPartyDropdown(query) {
    var q = (query || '').toLowerCase();
    var filtered = q ? partiesList.filter(function(p) { return p.partido.toLowerCase().indexOf(q) !== -1; }) : partiesList;
    var html = '<div class="party-option none" data-value="">Ninguno</div>';
    filtered.forEach(function(p) {
      var partido = p.partido || '';
      html += '<div class="party-option" data-value="' + escapeHtml(partido) + '">' + escapeHtml(partido) + '</div>';
    });
    if (q && filtered.length === 0) html += '<div class="party-option no-match">Sin coincidencias</div>';
    refs.partyList.innerHTML = html;
    refs.partyList.setAttribute('role', 'listbox');
    var opts = refs.partyList.querySelectorAll('.party-option:not(.no-match)');
    opts.forEach(function(el) {
      el.addEventListener('click', function() {
        var val = el.getAttribute('data-value') || '';
        var label = val ? (el.textContent || '').trim() : 'Seleccione partido a comparar';
        refs.filterPartyValue.value = val;
        refs.partyTriggerText.textContent = label;
        refs.partySearchInput.value = '';
        refs.partyCombobox.classList.remove('open');
        refs.partyTrigger.setAttribute('aria-expanded', 'false');
        refs.partySearchInput.blur();
      });
    });
  }

  function openPartyDropdown() {
    refs.partyCombobox.classList.add('open');
    refs.partyTrigger.setAttribute('aria-expanded', 'true');
    if (!refs.filterYear.value) {
      refs.partyList.innerHTML = '<div class="party-option none">Selecciona un año primero</div>';
    } else {
      renderPartyDropdown((refs.partySearchInput.value || '').trim());
      setTimeout(function() { refs.partySearchInput.focus(); }, 0);
    }
  }

  function loadYears() {
    return useCases.loadYears()
      .then(function(data) {
        years = data.years || [];
        refs.filterYear.innerHTML = '<option value="">Selecciona año</option>' +
          years.map(function(y) { return '<option value="' + y + '">' + y + '</option>'; }).join('');
        if (years.length > 0) {
          var lastYear = Math.max.apply(null, years);
          refs.filterYear.value = String(lastYear);
          if (refs.filterDept.value) loadMunicipalities();
          loadParties();
        }
      })
      .catch(function() {
        refs.filterYear.innerHTML = '<option value="">Error al cargar años</option>';
      });
  }

  function loadCorporations() {
    return useCases.loadCorporations()
      .then(function(data) {
        var list = data.corporations || [];
        refs.filterCorporacion.innerHTML = '<option value="">Todas</option>' +
          list.map(function(c) { return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>'; }).join('');
        var senado = list.find(function(c) { return String(c).toLowerCase() === 'senado'; });
        if (senado) refs.filterCorporacion.value = senado;
      })
      .catch(function() {
        refs.filterCorporacion.innerHTML = '<option value="">Todas</option><option value="" disabled>Error al cargar</option>';
      });
  }

  function loadDepartments() {
    return useCases.loadDepartments()
      .then(function(data) {
        departments = (data.departments || []).map(function(d) { return { codigo: d.codigo_departamento, nombre: d.nombre }; });
        refs.filterDept.innerHTML = '<option value="">Todos</option>' +
          departments.map(function(d) { return '<option value="' + String(d.codigo ?? '').trim() + '">' + (d.nombre || d.codigo || '') + '</option>'; }).join('');
        refs.filterMun.innerHTML = '<option value="">Todos</option>';
        municipalities = [];
      })
      .catch(function() {
        refs.filterDept.innerHTML = '<option value="">Error al cargar departamentos</option>';
      });
  }

  function loadMunicipalities() {
    var dept = (refs.filterDept.value || '').trim();
    refs.filterMun.innerHTML = '<option value="">Todos</option>';
    municipalities = [];
    if (!dept) return;
    useCases.loadMunicipalities(dept)
      .then(function(data) {
        municipalities = data.municipalities || [];
        refs.filterMun.innerHTML = '<option value="">Todos</option>' +
          municipalities.map(function(m) {
            var cod = String(m.codigo_divipola ?? '').trim();
            var label = (m.nombre || cod || 'Municipio').trim();
            return '<option value="' + cod + '">' + label + '</option>';
          }).join('');
      })
      .catch(function() {
        refs.filterMun.innerHTML = '<option value="">Todos</option><option value="" disabled>Error al cargar</option>';
      });
  }

  function loadParties() {
    var year = (refs.filterYear.value || '').trim();
    partiesList = [];
    refs.filterPartyValue.value = '';
    refs.partyTriggerText.textContent = 'Seleccione partido a comparar';
    refs.partySearchInput.value = '';
    if (!year) {
      refs.partyList.innerHTML = '<div class="party-option none">Selecciona un año primero</div>';
      return;
    }
    var params = { year: year };
    var corp = (refs.filterCorporacion.value || '').trim();
    var dept = (refs.filterDept.value || '').trim();
    var mun = (refs.filterMun.value || '').trim();
    if (corp) params.corporation = corp;
    if (dept) params.department = dept;
    if (mun) params.municipality = mun;
    useCases.loadParties(params)
      .then(function(data) {
        partiesList = (data.parties || []).map(function(p) { return { partido: (p.partido || '').trim() }; }).filter(function(p) { return p.partido; });
        renderPartyDropdown((refs.partySearchInput.value || '').trim());
      })
      .catch(function() {
        partiesList = [];
        refs.partyList.innerHTML = '<div class="party-option none">Error al cargar partidos</div>';
      });
  }

  function loadTopPartidos() {
    var year = (refs.filterYear.value || '').trim();
    if (!year) {
      refs.tableLoading.style.display = 'block';
      refs.tableLoading.textContent = 'Selecciona un año.';
      refs.tableError.style.display = 'none';
      refs.tableEmpty.style.display = 'none';
      refs.tableWrap.style.display = 'none';
      return;
    }
    showLoader(refs, 'Cargando datos…');
    refs.tableLoading.style.display = 'block';
    refs.tableLoading.textContent = 'Cargando…';
    refs.tableError.style.display = 'none';
    refs.tableEmpty.style.display = 'none';
    refs.tableWrap.style.display = 'none';
    refs.chartPanel.style.display = 'none';
    if (refs.chartPlaceholder) refs.chartPlaceholder.classList.remove('hidden');
    if (topPartidosChartInstance) {
      topPartidosChartInstance.destroy();
      topPartidosChartInstance = null;
    }
    var corp = String(refs.filterCorporacion.value || '').trim();
    var dept = String(refs.filterDept.value || '').trim();
    var mun = String(refs.filterMun.value || '').trim();
    var party = (refs.filterPartyValue.value || '').trim();
    var params = { year: year };
    if (corp) params.corporation = corp;
    if (dept) params.department = dept;
    if (mun) params.municipality = mun;
    if (party) params.excludeParty = party;
    useCases.loadTopPartidos(params)
      .then(function(data) {
        hideLoader(refs);
        refs.tableLoading.style.display = 'none';
        var rows = data.data || [];
        var excluded = data.excludedParty;
        if (rows.length === 0) {
          refs.tableEmpty.style.display = 'block';
          refs.tableWrap.style.display = 'none';
          refs.chartPanel.style.display = 'none';
          if (refs.chartPlaceholder) refs.chartPlaceholder.classList.remove('hidden');
          setResultsSubtitle(refs.resultsSubtitle, 0, null);
          updateChartLabels(refs.chartLabels, {});
          if (topPartidosChartInstance) { topPartidosChartInstance.destroy(); topPartidosChartInstance = null; }
          return;
        }
        var countForSubtitle = rows.length + (excluded && excluded.name ? 1 : 0);
        setResultsSubtitle(refs.resultsSubtitle, countForSubtitle, excluded && excluded.name ? excluded.name : null);
        var totalVotosAmbito = data.totalVotosAmbito != null ? data.totalVotosAmbito : 0;
        var totalVotosDepartamento = data.totalVotosDepartamento != null ? data.totalVotosDepartamento : null;
        var deptName = '';
        var munName = '';
        if (dept) {
          var selDept = refs.filterDept.options[refs.filterDept.selectedIndex];
          deptName = selDept ? selDept.text : 'departamento';
        }
        if (mun) {
          var selMun = refs.filterMun.options[refs.filterMun.selectedIndex];
          munName = selMun ? selMun.text : 'municipio';
        }
        updateChartLabels(refs.chartLabels, {
          partyName: excluded && excluded.name ? excluded.name : null,
          partyTotalVotos: excluded && excluded.totalVotos != null ? excluded.totalVotos : null,
          deptName: deptName || null,
          totalVotosDept: (deptName && !munName) ? totalVotosAmbito : (totalVotosDepartamento != null ? totalVotosDepartamento : null),
          munName: munName || null,
          totalVotosMun: munName ? totalVotosAmbito : null,
        });
        if (refs.topPartidosChart && ChartLib) {
          topPartidosChartInstance = renderTopPartidosChart(refs.topPartidosChart, rows, excluded, { chartPanel: refs.chartPanel, chartPlaceholder: refs.chartPlaceholder }, ChartLib);
        }
        renderResultsTable(refs.tableHeadRow, refs.tableBody, refs.tableWrap, rows, excluded);
      })
      .catch(function(err) {
        hideLoader(refs);
        refs.tableLoading.style.display = 'none';
        refs.chartPanel.style.display = 'none';
        if (refs.chartPlaceholder) refs.chartPlaceholder.classList.remove('hidden');
        if (topPartidosChartInstance) { topPartidosChartInstance.destroy(); topPartidosChartInstance = null; }
        refs.tableError.style.display = 'block';
        refs.tableError.textContent = 'No se pudieron cargar los datos: ' + (err.message || 'Error de conexión');
      });
  }

  useCases.checkConnection()
    .then(function(r) { setConnectionStatus(refs, r.ok, r.ok ? null : 'API no responde'); })
    .catch(function() { setConnectionStatus(refs, false, 'No se pudo conectar. ¿Backend en marcha?'); });

  useCases.loadElectionsSummary()
    .then(function(data) {
      refs.cardsLoading.style.display = 'none';
      renderElectionCards(refs.electionCards, data.summaries || []);
    })
    .catch(function() {
      refs.cardsLoading.textContent = 'No se pudo cargar el resumen de elecciones.';
    });

  refs.partyTrigger.addEventListener('click', function() {
    if (refs.partyCombobox.classList.contains('open')) {
      refs.partyCombobox.classList.remove('open');
      refs.partyTrigger.setAttribute('aria-expanded', 'false');
    } else {
      openPartyDropdown();
    }
  });
  refs.partySearchInput.addEventListener('input', function() {
    renderPartyDropdown((this.value || '').trim());
  });
  refs.partySearchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      refs.partyCombobox.classList.remove('open');
      refs.partyTrigger.setAttribute('aria-expanded', 'false');
      this.value = '';
      this.blur();
      refs.partyTrigger.focus();
    }
  });
  refs.partyCombobox.addEventListener('focusout', function(e) {
    var rel = e.relatedTarget;
    if (rel && refs.partyCombobox.contains(rel)) return;
    setTimeout(function() {
      refs.partyCombobox.classList.remove('open');
      refs.partyTrigger.setAttribute('aria-expanded', 'false');
    }, 150);
  });

  refs.filterCorporacion.addEventListener('change', loadParties);
  refs.filterDept.addEventListener('change', function() { loadMunicipalities(); loadParties(); });
  refs.filterMun.addEventListener('change', loadParties);
  refs.filterYear.addEventListener('change', function() {
    if (refs.filterDept.value) loadMunicipalities();
    loadParties();
  });
  refs.btnApply.addEventListener('click', loadTopPartidos);
  refs.btnClear.addEventListener('click', function() {
    refs.filterCorporacion.value = '';
    refs.filterDept.value = '';
    refs.filterMun.innerHTML = '<option value="">Todos</option>';
    municipalities = [];
    refs.filterPartyValue.value = '';
    refs.partyTriggerText.textContent = 'Seleccione partido a comparar';
    refs.partySearchInput.value = '';
    if (years.length > 0) {
      var lastYear = Math.max.apply(null, years);
      refs.filterYear.value = String(lastYear);
    }
    loadMunicipalities();
    loadParties();
    loadTopPartidos();
  });

  Promise.all([loadYears(), loadDepartments(), loadCorporations()]).then(function() {
    hideLoader(refs);
    loadTopPartidos();
  }).catch(function() {
    hideLoader(refs);
  });
}
