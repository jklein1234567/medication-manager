import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

export const getMedications = async () => {
  const res = await axios.get(`${API_BASE}/medications`, {
    headers: {
      'x-api-key': import.meta.env.VITE_API_KEY,
    },
  });
  return res.data;
};

export const addMedication = async (data: any) => {
  const res = await axios.post(`${API_BASE}/medications`, data, {
    headers: {
      'x-api-key': import.meta.env.VITE_API_KEY,
    },
  });
  return res.data;
};