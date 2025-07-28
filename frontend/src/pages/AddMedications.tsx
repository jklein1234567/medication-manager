import { useState } from "react";
import type { FC, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addMedication } from "../api";
import { Toaster } from "../components";
import { Day, ScheduleType, ToastType } from "../../../types";

export const AddMedication: FC = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    name: "",
    type: "",
    purpose: "",
    times: 1,
    scheduleType: ScheduleType.DAILY,
    daysOfWeek: [] as Day[],
    dayOfMonth: "",
  });

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setToast({ message: "Missing user ID", type: "error" });
      return;
    }

    try {
      if (
        form.scheduleType === ScheduleType.WEEKLY &&
        form.daysOfWeek.length === 0
      ) {
        setToast({
          message: "Select at least one day for weekly meds",
          type: "error",
        });
        return;
      }

      if (form.scheduleType === ScheduleType.MONTHLY && !form.dayOfMonth) {
        setToast({
          message: "Select a day of the month for monthly meds",
          type: "error",
        });
        return;
      }

      await addMedication({
        ...form,
        userId,
        isActive: true,
        takenLog: [],
      });

      setToast({ message: "Successfully added!", type: "success" });
      setTimeout(() => navigate(`/${userId}/calendar`), 3000); // ✅ Redirect to calendar for the same user
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

        <input
          className="w-full border p-2 rounded"
          placeholder="Type (e.g. Tablet, Injection)"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Purpose (e.g. Blood pressure)"
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          required
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Times (per schedule)"
          value={form.times}
          onChange={(e) => setForm({ ...form, times: Number(e.target.value) })}
          required
          min={1}
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

        {form.scheduleType === ScheduleType.MONTHLY && (
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Day of the month (e.g. 15)"
            value={form.dayOfMonth}
            onChange={(e) => setForm({ ...form, dayOfMonth: e.target.value })}
            min={1}
            max={31}
            required
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
