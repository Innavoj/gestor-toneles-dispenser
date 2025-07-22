import { MttoTonel, MttoDispensador, Tonel, Dispensador } from '../../types';

// Analiza los toneles con más mantenimientos totales
export function getTopTonelesByMaintenance(mttoToneles: MttoTonel[], toneles: Tonel[], topN = 5) {
  const counts: Record<string, number> = {};
  mttoToneles.forEach(mtto => {
    counts[mtto.idtonel] = (counts[mtto.idtonel] || 0) + 1;
  });
  return toneles
    .map(t => ({ ...t, mttoCount: counts[t.idtonel] || 0 }))
    .sort((a, b) => b.mttoCount - a.mttoCount)
    .slice(0, topN);
}

// Analiza los toneles por tipo de mantenimiento
export function getTonelesByMaintenanceType(mttoToneles: MttoTonel[], toneles: Tonel) {
  const result: Record<string, Record<string, number>> = {};
  toneles.forEach(t => {
    result[t.idtonel] = {};
  });
  mttoToneles.forEach(mtto => {
    if (!result[mtto.idtonel]) result[mtto.idtonel] = {};
    result[mtto.idtonel][mtto.tipomtto] = (result[mtto.idtonel][mtto.tipomtto] || 0) + 1;
  });
  return result;
}

// Analiza los toneles por fecha de mantenimiento
export function getTonelesByMaintenanceDate(mttoToneles: MttoTonel[], toneles: Tonel) {
  const result: Record<string, Record<string, number>> = {};
  toneles.forEach(t => {
    result[t.idtonel] = {};
  });
  mttoToneles.forEach(mtto => {
    const fecha = mtto.fechaini?.slice(0, 10); // YYYY-MM-DD
    if (!result[mtto.idtonel]) result[mtto.idtonel] = {};
    result[mtto.idtonel][fecha] = (result[mtto.idtonel][fecha] || 0) + 1;
  });
  return result;
}

// Toneles fuera de servicio
export function getTonelesFueraDeServicio(toneles: Tonel[]) {
  return toneles.filter(t => t.status === 'fuera servicio');
}

// Dispensadores con más mantenimientos
export function getTopDispensadoresByMaintenance(mttoDispensadores: MttoDispensador[], dispensadores: Dispensador[], topN = 5) {
  const counts: Record<string, number> = {};
  mttoDispensadores.forEach(mtto => {
    counts[mtto.iddispensador] = (counts[mtto.iddispensador] || 0) + 1;
  });
  return dispensadores
    .map(d => ({ ...d, mttoCount: counts[d.iddispensador] || 0 }))
    .sort((a, b) => b.mttoCount - a.mttoCount)
    .slice(0, topN);
}

// Dispensadores por tipo de mantenimiento
export function getDispensadoresByMaintenanceType(mttoDispensadores: MttoDispensador[], dispensadores: Dispensador[]) {
  const result: Record<string, Record<string, number>> = {};
  dispensadores.forEach(d => {
    result[d.iddispensador] = {};
  });
  mttoDispensadores.forEach(mtto => {
    if (!result[mtto.iddispensador]) result[mtto.iddispensador] = {};
    result[mtto.iddispensador][mtto.tipomtto] = (result[mtto.iddispensador][mtto.tipomtto] || 0) + 1;
  });
  return result;
}

// Dispensadores por fecha de mantenimiento
export function getDispensadoresByMaintenanceDate(mttoDispensadores: MttoDispensador[], dispensadores: Dispensador[]) {
  const result: Record<string, Record<string, number>> = {};
  dispensadores.forEach(d => {
    result[d.iddispensador] = {};
  });
  mttoDispensadores.forEach(mtto => {
    const fecha = mtto.fechaini?.slice(0, 10); // YYYY-MM-DD
    if (!result[mtto.iddispensador]) result[mtto.iddispensador] = {};
    result[mtto.iddispensador][fecha] = (result[mtto.iddispensador][fecha] || 0) + 1;
  });
  return result;
}

// Dispensadores fuera de servicio
export function getDispensadoresFueraDeServicio(dispensadores: Dispensador[]) {
  return dispensadores.filter(d => d.status === 'fuera servicio');
}