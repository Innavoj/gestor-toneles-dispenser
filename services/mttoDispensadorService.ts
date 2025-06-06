import { MttoDispensador, MttoDispensadorFormData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api'; // API endpoint for MttoDispensador

export const mttoDispensadorService = {
  getAllMttoDispensadores: async (): Promise<MttoDispensador[]> => {
    const response = await fetch(`${API_BASE_URL}/mttodispenser`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch mtto dispensadores`);
    }
    return response.json();
  },

  getMttoDispensadorById: async (idmtto: string): Promise<MttoDispensador | undefined> => {
    const response = await fetch(`${API_BASE_URL}/mttodispenser/${idmtto}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch mtto dispensador ${idmtto}`);
    }
    return response.json();
  },

  getMttoDispensadoresByDispensadorId: async (iddispensador: string): Promise<MttoDispensador[]> => {
    // Assuming filtering by iddispensador, e.g., GET /api/mttodispenser?iddispensador=some-id
    // Adjust if your API uses a different path
    const response = await fetch(`${API_BASE_URL}/mttodispenser?iddispensador=${encodeURIComponent(iddispensador)}`);
    if (!response.ok) {
       const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch mtto for dispensador ${iddispensador}`);
    }
    return response.json();
  },

  addMttoDispensador: async (mttoData: MttoDispensadorFormData): Promise<MttoDispensador> => {
    const response = await fetch(`${API_BASE_URL}/mttodispenser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mttoData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to add mtto dispensador`);
    }
    return response.json();
  },

  updateMttoDispensador: async (idmtto: string, mttoData: Partial<MttoDispensadorFormData>): Promise<MttoDispensador | undefined> => {
    const response = await fetch(`${API_BASE_URL}/mttodispenser/${idmtto}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mttoData),
    });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to update mtto dispensador ${idmtto}`);
    }
    return response.json();
  },

  deleteMttoDispensador: async (idmtto: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/mttodispenser/${idmtto}`, {
      method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to delete mtto dispensador ${idmtto}`);
    }
    return response.ok || response.status === 204;
  },
};
