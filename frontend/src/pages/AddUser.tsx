import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api";
import type { FC, FormEvent } from "react";
import { Toaster } from "../components";
import { ToastType } from "../../../types";

export const AddUser: FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", image: "" });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUser(form);
      setToast({ message: "User created successfully!", type: "success" });
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setToast({ message: "Failed to create user", type: "error" });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <h1 className="text-2xl font-bold mb-6 text-center">Create New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          className="w-full border p-2 rounded"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <button
          type="submit"
          className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
        >
          Add User
        </button>
      </form>
    </div>
  );
};
