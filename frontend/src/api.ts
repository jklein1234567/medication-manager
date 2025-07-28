import axios from "axios";
import type { User, Medication } from "../../types";

const { VITE_API_BASE, VITE_API_KEY } = import.meta.env;

// -----------------------------
// USER ENDPOINTS
// -----------------------------

export const getAllUsers = async () => {
  const res = await fetch(`${VITE_API_BASE}/users`);
  return await res.json();
};

export const getUserById = async (id: string) => {
  const res = await fetch(`${VITE_API_BASE}/users/${id}`);
  return await res.json();
};

export const createUser = async (data: Omit<User, 'id'>) => {
  const res = await axios.post(`${VITE_API_BASE}/users`, data, {
    headers: {
      "x-api-key": VITE_API_KEY,
    },
  });
  return res.data;
};

// -----------------------------
// MEDICATION ENDPOINTS
// -----------------------------

export const getMedications = async (userId: string) => {
  const res = await fetch(`${VITE_API_BASE}/medications?userId=${userId}`);
  return await res.json();
};

export const addMedication = async (data: Omit<Medication, 'id'>) => {
  const res = await axios.post(`${VITE_API_BASE}/medications`, data, {
    headers: {
      "x-api-key": VITE_API_KEY,
    },
  });
  return res.data;
};

export const updateTakeLog = async (id: string, date: string) => {
  const res = await axios.put(
    `${VITE_API_BASE}/medications/${id}/take`,
    { date },
    {
      headers: {
        "x-api-key": VITE_API_KEY,
      },
    }
  );
  return res.data;
};

export const toggleActivity = async (id: string) => {
  const res = await axios.put(
    `${VITE_API_BASE}/medications/${id}/toggle`,
    {},
    {
      headers: {
        "x-api-key": VITE_API_KEY,
      },
    }
  );
  return res.data;
};
