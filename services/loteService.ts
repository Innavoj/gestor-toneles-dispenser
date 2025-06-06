import { LoteProduccion, LoteProduccionFormData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const loteService = {
  getAllLotes: async (): Promise<LoteProduccion[]> => {
    const response = await fetch(`${API_BASE_URL}/lotes`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch lotes`);
    }
    return response.json();
  },

  getLoteById: async (idlote: string): Promise<LoteProduccion | undefined> => {
    const response = await fetch(`${API_BASE_URL}/lotes/${idlote}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch lote ${idlote}`);
    }
    return response.json();
  },

  addLote: async (loteData: LoteProduccionFormData): Promise<LoteProduccion> => {
    const response = await fetch(`${API_BASE_URL}/lotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loteData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to add lote`);
    }
    return response.json();
  },

  updateLote: async (idlote: string, loteData: Partial<LoteProduccionFormData>): Promise<LoteProduccion | undefined> => {
    const response = await fetch(`${API_BASE_URL}/lotes/${idlote}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loteData),
    });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to update lote ${idlote}`);
    }
    return response.json();
  },

  deleteLote: async (idlote: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/lotes/${idlote}`, {
      method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to delete lote ${idlote}`);
    }
    return response.ok || response.status === 204;
  },

  getLotesByTonelId: async (idtonel: string): Promise<LoteProduccion[]> => {
    // Assuming the backend API for lotes supports filtering by idtonel via query parameter.
    // e.g., GET /api/lotes?idtonel=some-tonel-id
    // Adjust the endpoint if your backend expects a different route structure, e.g., /api/toneles/{idtonel}/lotes
    const response = await fetch(`${API_BASE_URL}/lotes?idtonel=${encodeURIComponent(idtonel)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch lotes for tonel ${idtonel}`);
    }
    return response.json();
  }
};
