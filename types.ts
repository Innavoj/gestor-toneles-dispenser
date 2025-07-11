
export enum TonelStatus {
  ASIGNADO_A_DISPENSER = 'asignado a dispenser',
  VACIO = 'vacio',
  LLENO = 'lleno',
  MANTENIMIENTO = 'mantenimiento',
  FUERA_SERVICIO = 'fuera servicio',
}

export enum TonelLocation {
  AREA_ALMACENAMIENTO = 'area de almacenamiento',
  CAMARA_FRIA = 'camara fria',
  AREA_DESPACHO = 'area despacho',
  AREA_LLENADO = 'area llenado',
  LUGAR_EVENTO = 'lugar del evento',
  AREA1_CARNAVAL = 'Area1 Carnaval',
}


export interface Location {
  idlocation: string;
  location: string;
  description: string;
}



// Note: KegMaterial is not in the new SQL schema for 'toneles'.
// If material is still relevant, it would need to be added to 'toneles' table or handled differently.
// For now, it's removed from the Tonel type.

export interface Tonel {
  idtonel: string;
  nserial: string;
  capacity: number; // was capacityLiters
  status: TonelStatus;
  location: TonelLocation;
  acquired: string; // DATE, was acquisitionDate
  vidautil: number;
  notas?: string;
  createdAt?: string; // timestamp
  updatedAt?: string; // timestamp
  currentLoteId?: string; // Helper field, derived from lotesproduccion
}

export enum LoteProduccionStyle {
  CRISTAL = 'cristal',
  BUCANERO = 'bucanero',
  HATUEY = 'hatuey',
}

export enum LoteProduccionStatus {
  PLANEADO = 'planeado',
  COMPLETADO = 'completado',
  FERMENTANDO = 'fermentando',
  PRODUCION = 'producion', // Assuming 'produccion'
  LISTO_PARA_ENVASAR = 'listo para envasar',
}

export interface LoteProduccion {
  idlote: string;
  idtonel: string; // Foreign key to Tonel
  lotename: string; // was beerName
  style: LoteProduccionStyle; // was beerStyle
  volumen: number; // was targetVolumeLiters
  status: LoteProduccionStatus;
  entprod: string; // DATETIME, was productionStartDate
  salprod?: string; // DATETIME, was keggingDate
  createdAt?: string;
  updatedAt?: string;
  // removed assignedKegIds as a Lote is for one Tonel
}

export enum MttoTonelTipo {
  INSPECCION_RUTINA = 'inspeccion de rutina',
  PRUEBA_PRESION = 'prueba de presion',
  REMPLAZO_SELLOS = 'remplazo de sellos',
  REMPLAZO_VALVULAS = 'remplazo de valvulas',
  LIMPIEZA_EXTERIOR = 'limpieza exterior',
}

export enum MttoTaskStatus { // Generic status for MttoTonel and MttoDispensador
  PROGRAMADO = 'programado',
  EN_PROCESO = 'en proceso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
}

export interface MttoTonel {
  idmtto: string;
  idtonel: string;
  tipomtto: MttoTonelTipo;
  fechaini: string; // DATE, was scheduledDate
  fechafin?: string; // DATE, was completionDate
  status: MttoTaskStatus;
  // Removed description, notes, cost from SQL definition
}

export enum EventoTonelTipo {
  INSPECCION = 'inspeccion',
  LIMPIEZA_INICIADA = 'limpieza iniciada',
  LIMPIEZA_FINALIZADA = 'limpieza finalizada',
  TRASLADO = 'traslado',
}

export interface EventoTonel {
  idevento: string;
  idtonel: string;
  tipoevento: EventoTonelTipo;
  fechaevento: string; // DATETIME, was timestamp
  descripcion?: string; // was details (simplified)
}

export enum DispensadorStatus {
  ASIGNADO_A_TONEL = 'asignado a tonel',
  MANTENIMIENTO = 'mantenimiento',
  FUERA_SERVICIO = 'fuera servicio',
}

export enum DispensadorLocation {
  LUGAR_EVENTO = 'lugar del evento',
  AREA_ALMACENAMIENTO = 'area de almacenamiento',
}

export interface Dispensador {
  iddispensador: string;
  nserial: string;
  status: DispensadorStatus;
  location: DispensadorLocation;
  acquired: string; // DATE
  notas?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum MttoDispensadorTipo {
  INSPECCION_RUTINA = 'inspeccion de rutina',
  SOLDADURA = 'soldadura',
  LIMPIEZA_EXTERIOR = 'limpieza exterior',
}

export interface MttoDispensador {
  idmtto: string;
  iddispensador: string;
  tipomtto: MttoDispensadorTipo;
  fechaini: string; // DATE
  fechafin?: string; // DATE
  status: MttoTaskStatus;
}


// FormData types
export type TonelFormData = Omit<Tonel, 'idtonel' | 'createdAt' | 'updatedAt' | 'currentLoteId'> & {
  // Allow optional status/location for creation if backend sets defaults
  status?: TonelStatus;
  location?: TonelLocation;
};

export type LocationFormData = Omit<Location, 'idlocation'> & {
 location?: string;
 description?: string;
}

export type LoteProduccionFormData = Omit<LoteProduccion, 'idlote' | 'createdAt' | 'updatedAt'>;

export type MttoTonelFormData = Omit<MttoTonel, 'idmtto'>;

export type DispensadorFormData = Omit<Dispensador, 'iddispensador' | 'createdAt' | 'updatedAt'>;

export type MttoDispensadorFormData = Omit<MttoDispensador, 'idmtto'>;


export interface SelectOption {
  value: string;
  label: string;
}
