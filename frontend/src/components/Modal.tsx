import type { FC } from "react";
import type { Medication } from "../../../types";
import { markAsTaken } from "../api"; // adjust path as needed
import { useState } from "react";

interface Props {
  selectedMed: Medication;
  setSelectedMed: (med: Medication | null) => void;
  handleMarkAsTaken: (id: string) => void;
}

export const Modal: FC<Props> = ({
  selectedMed,
  setSelectedMed,
  handleMarkAsTaken,
}) => {
  const { daysOfWeek, times, id } = selectedMed;
  const [isActive, setIsActive] = useState(selectedMed.isActive);

  const handleToggleStatus = async () => {
    try {
      await markAsTaken(id);
      setIsActive(!isActive);
    } catch (error) {
      console.error("Failed to toggle active status", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white w-full max-w-xl mx-4 p-8 rounded-xl shadow-xl">
        {/* Toggle Button in Top Right */}
        <button
          className={`absolute top-4 right-4 px-3 py-1 text-sm rounded font-medium transition text-white ${
            isActive ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"
          }`}
          onClick={handleToggleStatus}
        >
          {isActive ? "Active" : "Inactive"}
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {selectedMed.name}
        </h2>

        <p className="text-gray-700 text-base mb-2">
          <span className="font-medium capitalize">
            {selectedMed.scheduleType}
          </span>{" "}
          – {Array.isArray(times) && times.join(", ")}
        </p>

        {Array.isArray(daysOfWeek) && daysOfWeek.length > 0 && (
          <p className="text-gray-500 text-sm mb-6">
            <span className="font-medium">Days:</span> {daysOfWeek.join(", ")}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition hover:cursor-pointer"
            onClick={() => handleMarkAsTaken(selectedMed.id)}
          >
            Mark as Taken
          </button>
          <button
            className="text-gray-600 hover:underline text-sm hover:cursor-pointer"
            onClick={() => setSelectedMed(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
