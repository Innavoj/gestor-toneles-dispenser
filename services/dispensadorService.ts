import { Dispensador, DispensadorFormData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api'; // API endpoint for Dispensador

export const dispensadorService = {
  getAllDispensadores: async (): Promise<Dispensador[]> => {
    const response = await fetch(`${API_BASE_URL}/dispenser`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch dispensadores`);
    }
    return response.json();
  },

  getDispensadorById: async (iddispensador: string): Promise<Dispensador | undefined> => {
    const response = await fetch(`${API_BASE_URL}/dispenser/${iddispensador}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch dispensador ${iddispensador}`);
    }
    return response.json();
  },

  addDispensador: async (dispensadorData: DispensadorFormData): Promise<Dispensador> => {
    const response = await fetch(`${API_BASE_URL}/dispenser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dispensadorData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to add dispensador`);
    }
    return response.json();
  },

  updateDispensador: async (iddispensador: string, dispensadorData: Partial<DispensadorFormData>): Promise<Dispensador | undefined> => {
    const response = await fetch(`${API_BASE_URL}/dispenser/${iddispensador}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dispensadorData),
    });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to update dispensador ${iddispensador}`);
    }
    return response.json();
  },

  deleteDispensador: async (iddispensador: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/dispenser/${iddispensador}`, {
      method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.message || `Failed to delete dispensador ${iddispensador}`);
    }
    return response.ok || response.status === 204;
  },
};
