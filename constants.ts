
import { 
  TonelStatus, TonelLocation, 
  LoteProduccionStyle, LoteProduccionStatus,
  MttoTonelTipo, MttoTaskStatus, EventoTonelTipo,
  DispensadorStatus, DispensadorLocation,
  MttoDispensadorTipo,
  SelectOption 
} from './types';

export const APP_NAME = "Gestor de Toneles";

export const DEFAULT_TONEL_LOCATIONS: SelectOption[] = Object.values(TonelLocation).map(loc => ({
  value: loc,
  label: loc.charAt(0).toUpperCase() + loc.slice(1),
}));

export const TONEL_STATUS_OPTIONS: SelectOption[] = Object.values(TonelStatus).map(status => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));

export const LOTE_STYLE_OPTIONS: SelectOption[] = Object.values(LoteProduccionStyle).map(style => ({
  value: style,
  label: style.charAt(0).toUpperCase() + style.slice(1),
}));

export const LOTE_STATUS_OPTIONS: SelectOption[] = Object.values(LoteProduccionStatus).map(status => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));

export const MTTO_TONEL_TIPO_OPTIONS: SelectOption[] = Object.values(MttoTonelTipo).map(type => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));

export const MTTO_TASK_STATUS_OPTIONS: SelectOption[] = Object.values(MttoTaskStatus).map(status => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));

export const EVENTO_TONEL_TIPO_OPTIONS: SelectOption[] = Object.values(EventoTonelTipo).map(type => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));

// Dispensador Constants
export const DISPENSADOR_STATUS_OPTIONS: SelectOption[] = Object.values(DispensadorStatus).map(status => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));

export const DISPENSADOR_LOCATION_OPTIONS: SelectOption[] = Object.values(DispensadorLocation).map(loc => ({
  value: loc,
  label: loc.charAt(0).toUpperCase() + loc.slice(1),
}));

export const MTTO_DISPENSADOR_TIPO_OPTIONS: SelectOption[] = Object.values(MttoDispensadorTipo).map(type => ({
  value: type,
  label: type.charAt(0).toUpperCase() + type.slice(1),
}));


// Common Maintenance tasks are now specific to MttoTonelTipo and MttoDispensadorTipo
export const COMMON_MTTO_TONEL_TASKS: string[] = Object.values(MttoTonelTipo);
export const COMMON_MTTO_DISPENSADOR_TASKS: string[] = Object.values(MttoDispensadorTipo);


export const ITEMS_PER_PAGE = 10;
