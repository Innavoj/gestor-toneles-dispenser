import { Tonel, TonelFormData } from '../types';
// import { generateUUID, getCurrentTimestamp } from '../utils'; // No longer needed for mock data

const API_BASE_URL = 'http://localhost:5000/api'; // Assuming backend is served from /api

export const tonelService = {
  getAllToneles: async (): Promise<Tonel[]> => {
    const response = await fetch(`${API_BASE_URL}/toneles`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch toneles`);
    }
    return response.json();
  },

  getTonelById: async (idtonel: string): Promise<Tonel | undefined> => {
    const response = await fetch(`${API_BASE_URL}/toneles/${idtonel}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch tonel ${idtonel}`);
    }
    return response.json();
  },

  addTonel: async (tonelData: TonelFormData): Promise<Tonel> => {
    const response = await fetch(`${API_BASE_URL}/toneles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tonelData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to add tonel`);
    }
    return response.json();
  },

  updateTonel: async (idtonel: string, tonelData: Partial<TonelFormData>): Promise<Tonel | undefined> => {
    const response = await fetch(`${API_BASE_URL}/toneles/${idtonel}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tonelData),
      
    });
    console.log(tonelData);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to update tonel ${idtonel}`);
    }
    return response.json();
  },



  updateTonelStatusLocation: async (idtonel: string, tonelData: Partial<TonelFormData>): Promise<Tonel | undefined> => {
    const response = await fetch(`${API_BASE_URL}/toneles/status/${idtonel}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tonelData),
      
    });
    console.log(tonelData);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to update tonel Status ${idtonel}`);
    }
    return response.json();
  },

  deleteTonel: async (idtonel: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/toneles/${idtonel}`, {
      method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) { // 204 is a valid success for DELETE with no content
        const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.message || `Failed to delete tonel ${idtonel}`);
    }
    return response.ok || response.status === 204;
  },
};
