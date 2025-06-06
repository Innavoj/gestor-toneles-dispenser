import { MttoTonel, MttoTonelFormData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api'; // API endpoint for MttoTonel

export const mttoTonelService = {
  getAllMttoToneles: async (): Promise<MttoTonel[]> => {
    const response = await fetch(`${API_BASE_URL}/mttotonel`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch mtto toneles`);
    }
    return response.json();
  },

  getMttoTonelById: async (idmtto: string): Promise<MttoTonel | undefined> => {
    const response = await fetch(`${API_BASE_URL}/mttotonel/${idmtto}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch mtto tonel ${idmtto}`);
    }
    return response.json();
  },

  getMttoTonelesByTonelId: async (idtonel: string): Promise<MttoTonel[]> => {
    // Assuming filtering by idtonel, e.g., GET /api/mttotonel?idtonel=some-id
    // Adjust if your API uses a different path like /api/toneles/{idtonel}/mttotonel
    const response = await fetch(`${API_BASE_URL}/mttotonel?idtonel=${encodeURIComponent(idtonel)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch mtto toneles for tonel ${idtonel}`);
    }
    return response.json();
  },

  addMttoTonel: async (mttoData: MttoTonelFormData): Promise<MttoTonel> => {
    const response = await fetch(`${API_BASE_URL}/mttotonel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mttoData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to add mtto tonel`);
    }
    return response.json();
  },

  updateMttoTonel: async (idmtto: string, mttoData: Partial<MttoTonelFormData>): Promise<MttoTonel | undefined> => {
    const response = await fetch(`${API_BASE_URL}/mttotonel/${idmtto}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mttoData),
    });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to update mtto tonel ${idmtto}`);
    }
    return response.json();
  },

  deleteMttoTonel: async (idmtto: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/mttotonel/${idmtto}`, {
      method: 'DELETE',
    });
     if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to delete mtto tonel ${idmtto}`);
    }
    return response.ok || response.status === 204;
  },
};
