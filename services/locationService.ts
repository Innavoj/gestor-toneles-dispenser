import { LocationFormData, Location } from '../types';
// import { generateUUID, getCurrentTimestamp } from '../utils'; // No longer needed for mock data

const API_BASE_URL = 'http://localhost:5000/api'; // Assuming backend is served from /api

export const locationService = {
  getAllLocation: async (): Promise<Location[]> => {
    const response = await fetch(`${API_BASE_URL}/location`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch location`);
    }
    return response.json();
  },

  getLocationById: async (idlocation: string): Promise<Location | undefined> => {
    const response = await fetch(`${API_BASE_URL}/location/${idlocation}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to fetch location ${idlocation}`);
    }
    return response.json();
  },

  addLocation: async (locationData: LocationFormData): Promise<Location> => {
    const response = await fetch(`${API_BASE_URL}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to add location`);
    }
    return response.json();
  },

  updateLocation: async (idlocation: string, locationData: Partial<LocationFormData>): Promise<TonelLocation | undefined> => {
    const response = await fetch(`${API_BASE_URL}/location/${idlocation}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
      
    });
    console.log(locationData);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
      throw new Error(errorData.message || `Failed to update location ${idlocation}`);
    }
    return response.json();
  },



  // updateTonelStatusLocation: async (idtonel: string, tonelData: Partial<TonelFormData>): Promise<Tonel | undefined> => {
  //   const response = await fetch(`${API_BASE_URL}/toneles/status/${idtonel}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(tonelData),
      
  //   });
  //   console.log(tonelData);
  //   if (!response.ok) {
  //     if (response.status === 404) return undefined;
  //     const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
  //     throw new Error(errorData.message || `Failed to update tonel Status ${idtonel}`);
  //   }
  //   return response.json();
  // },

  deleteLocation: async (idlocation: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/location/${idlocation}`, {
      method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) { // 204 is a valid success for DELETE with no content
        const errorData = await response.json().catch(() => ({ message: `Error ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.message || `Failed to delete tonel ${idlocation}`);
    }
    return response.ok || response.status === 204;
  },
};
