/**
 * Entidades y tipos del dominio (Top Partidos).
 * Sin dependencias externas.
 */

/** @typedef {{ year: number; totalVotos: number; partidoGanador: string; votosPartidoGanador: number }} ElectionSummary */
/** @typedef {{ partido: string; totalVotos: number; rank: number }} TopPartidoRow */
/** @typedef {{ name: string; totalVotos: number }} ExcludedParty */
/** @typedef {{ codigo: string; nombre: string }} DepartamentoOption */
/** @typedef {{ codigo_divipola: string; nombre?: string }} MunicipioOption */
/** @typedef {{ partido: string }} PartyOption */

export const COLORS = Object.freeze(['#3b82f6', '#22c55e', '#6366f1', '#0ea5e9', '#14b8a6', '#f59e0b', '#ec4899']);
