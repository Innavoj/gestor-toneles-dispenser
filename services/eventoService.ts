import { EventoTonel, EventoTonelTipo } from '../types';

const API_BASE_URL = 'http://localhost:5000/api'; // Assuming events are at /api/eventostoneles

interface AddEventoPayload {
  idtonel: string;
  tipoevento: EventoTonelTipo;
  descripcion?: string;
  // fechaevento is usually set by backend on creation
}

export const eventoService = {
  getAllEventos: async (): Promise<EventoTonel[]> => {
    const response = await fetch(`${API_BASE_URL}/eventostonel`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch eventos`);
    }
    return response.json();
  },

  getEventosByTonelId: async (idtonel: string): Promise<EventoTonel[]> => {
    // Assuming filtering by idtonel, e.g., GET /api/eventostoneles?idtonel=some-id
    // Adjust if your API uses a different path like /api/toneles/{idtonel}/eventos
   // const response = await fetch(`${API_BASE_URL}/eventostonel/${idtonel}`);
    const response = await fetch(`${API_BASE_URL}/eventostonel?idtonel=${encodeURIComponent(idtonel)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch eventos for tonel ${idtonel}`);
    }
    const eventos: EventoTonel[] = await response.json();
 
    return eventos.sort((a, b) => new Date(b.fechaevento).getTime() - new Date(a.fechaevento).getTime());
 
  },

  addEventoTonel: async (payload: AddEventoPayload): Promise<EventoTonel> => {
    const response = await fetch(`${API_BASE_URL}/eventostonel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to add evento tonel`);
    }
    return response.json();
  },
  // Delete or update for eventos might not be common from frontend,
  // but can be added if needed, following similar patterns.
};
