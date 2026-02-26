/**
 * Adaptador HTTP que implementa el puerto CongresoApiPort.
 * Depende de config (base URL).
 */
import { config } from '../config/index.js';

const base = () => config.apiBaseUrl;

async function handleResponse(r) {
  if (!r.ok) throw new Error(r.statusText || 'Error en la petición');
  return r.json();
}

export function createHttpCongresoApi() {
  return {
    checkHealth() {
      return fetch(base() + '/health').then((r) => ({ ok: r.ok }));
    },
    getYears() {
      return fetch(base() + '/api/congreso-report/years').then(handleResponse);
    },
    getCorporations() {
      return fetch(base() + '/api/congreso-report/corporations').then(handleResponse);
    },
    getDepartments() {
      return fetch(base() + '/api/congreso-report/departments').then(handleResponse);
    },
    getMunicipalities(department) {
      if (!department) return Promise.resolve({ municipalities: [] });
      const url = base() + '/api/congreso-report/municipalities?department=' + encodeURIComponent(department);
      return fetch(url).then(handleResponse);
    },
    getParties(params) {
      const q = new URLSearchParams();
      if (params.year) q.set('year', params.year);
      if (params.corporation) q.set('corporation', params.corporation);
      if (params.department) q.set('department', params.department);
      if (params.municipality) q.set('municipality', params.municipality);
      return fetch(base() + '/api/congreso-report/parties?' + q.toString()).then(handleResponse);
    },
    getTopPartidos(params) {
      const q = new URLSearchParams();
      if (params.year) q.set('year', params.year);
      if (params.corporation) q.set('corporation', params.corporation);
      if (params.department) q.set('department', params.department);
      if (params.municipality) q.set('municipality', params.municipality);
      if (params.excludeParty) q.set('excludeParty', params.excludeParty);
      return fetch(base() + '/api/congreso-report/top-partidos?' + q.toString()).then(handleResponse);
    },
    getElectionsSummary() {
      return fetch(base() + '/api/congreso-report/elections-summary').then(handleResponse);
    },
  };
}
