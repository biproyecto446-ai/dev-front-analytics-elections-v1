/**
 * Puerto (interfaz) para el servicio de API Congreso.
 * La aplicación depende de este contrato; el adaptador HTTP lo implementa.
 */

/**
 * @typedef CongresoApiPort
 * @property {() => Promise<{ ok: boolean }>} checkHealth
 * @property {() => Promise<{ years: number[] }>} getYears
 * @property {() => Promise<{ departments: Array<{ codigo_departamento: string; nombre: string }> }>} getDepartments
 * @property {(department: string) => Promise<{ municipalities: Array<{ codigo_divipola: string; nombre?: string }> }>} getMunicipalities
 * @property {(params: { year: string; department?: string; municipality?: string }) => Promise<{ parties: Array<{ partido: string }> }>} getParties
 * @property {(params: { year: string; department?: string; municipality?: string; excludeParty?: string }) => Promise<{ data: Array<{ partido: string; totalVotos: number; rank: number }>; excludedParty?: { name: string; totalVotos: number }; totalVotosAmbito: number; totalVotosDepartamento?: number }>} getTopPartidos
 * @property {() => Promise<{ summaries: Array<{ year: number; totalVotos: number; partidoGanador: string; votosPartidoGanador: number }> }>} getElectionsSummary
 */
