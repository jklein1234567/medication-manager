import axios from 'axios';

const { VITE_API_BASE, VITE_API_KEY } = import.meta.env;

export const getMedications = async () => {
  const res = await axios.get(`${VITE_API_BASE}/medications`, {
    headers: {
      'x-api-key': VITE_API_KEY,
    },
  });
  return res.data;
};

export const addMedication = async (data: any) => {
  const res = await axios.post(`${VITE_API_BASE}/medications`, data, {
    headers: {
      'x-api-key': VITE_API_KEY,
    },
  });
  return res.data;
};

export const markAsTaken = async (id: string) => {
  const res = await axios.post(`${VITE_API_BASE}/medications/${id}/take`, {}, {
    headers: {
      'x-api-key': VITE_API_KEY,
    },
  });
  return res.data;
};
