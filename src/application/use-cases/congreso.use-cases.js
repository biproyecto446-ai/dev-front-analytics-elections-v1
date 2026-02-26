/**
 * Casos de uso Congreso (orquestación sin DOM).
 * Dependen solo del puerto API.
 */

/**
 * @param {import('../../ports/congreso-api.port.js').CongresoApiPort} api
 */
export function createCongresoUseCases(api) {
  return {
    checkConnection() {
      return api.checkHealth();
    },
    loadYears() {
      return api.getYears();
    },
    loadCorporations() {
      return api.getCorporations();
    },
    loadDepartments() {
      return api.getDepartments();
    },
    loadMunicipalities(department) {
      return api.getMunicipalities(department);
    },
    loadParties(params) {
      return api.getParties(params);
    },
    loadTopPartidos(params) {
      return api.getTopPartidos(params);
    },
    loadElectionsSummary() {
      return api.getElectionsSummary();
    },
  };
}
