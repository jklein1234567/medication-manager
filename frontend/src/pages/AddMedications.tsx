import { useState } from "react";
import type { FC, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { addMedication } from "../api";
import { Toaster } from "../components";
import { Day, ScheduleType, ToastType } from "../../../types";

export const AddMedication: FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    scheduleType: ScheduleType.DAILY,
    times: "",
    daysOfWeek: [] as Day[],
  });
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addMedication({
        ...form,
        times: form.times.split(",").map((t) => t.trim()),
        isActive: true,
        takenLog: [],
      });
      setToast({ message: "Successfully added!", type: "success" });
      setTimeout(() => navigate("/"), 3000);
    } catch {
      setToast({ message: "Failed to add medication", type: "error" });
    }
  };

  const toggleDay = (day: Day) => {
    setForm((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
       <h1 className="text-2xl font-bold mb-6 text-center">Add Medication</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Medication Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <select
          className="w-full border p-2 rounded"
          value={form.scheduleType}
          onChange={(e) =>
            setForm({ ...form, scheduleType: e.target.value as ScheduleType })
          }
        >
          <option value={ScheduleType.DAILY}>Daily</option>
          <option value={ScheduleType.WEEKLY}>Weekly</option>
          <option value={ScheduleType.MONTHLY}>Monthly</option>
        </select>

        <input
          className="w-full border p-2 rounded"
          placeholder="Times (e.g. 08:00, 20:00)"
          value={form.times}
          onChange={(e) => setForm({ ...form, times: e.target.value })}
        />

        {form.scheduleType === ScheduleType.WEEKLY && (
          <div className="flex flex-wrap gap-2">
            {Object.values(Day).map((d) => (
              <button
                type="button"
                key={d}
                className={`px-3 py-1 rounded border ${
                  form.daysOfWeek.includes(d) ? "bg-blue-600 text-white" : ""
                }`}
                onClick={() => toggleDay(d)}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
