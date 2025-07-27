import type { FC } from "react";
import moment from "moment";
import type { Moment } from "moment";
import type { Medication } from "../../../types";
import { toggleActivity, getMedications } from "../api";

interface Props {
  selectedMed: Medication;
  selectedDate: Moment;
  setSelectedMed: (med: Medication | null) => void;
  setMeds: (meds: Medication[]) => void;
  handleUpdateTakeLog: (id: string) => void;
}

export const Modal: FC<Props> = ({
  selectedMed,
  selectedDate,
  setSelectedMed,
  setMeds,
  handleUpdateTakeLog,
}) => {
  const { daysOfWeek, times, id, isActive, takenLog = [] } = selectedMed;

  const dateString = selectedDate.format("YYYY-MM-DD");

  const isTakenOnSelectedDate = takenLog.includes(dateString);

  const handleToggleStatus = async () => {
    try {
      await toggleActivity(id);
      const updatedMeds = await getMedications();
      setMeds(updatedMeds);

      const updatedSelected = updatedMeds.find(
        (med: Medication) => med.id === id
      );
      if (updatedSelected) {
        setSelectedMed(updatedSelected);
      }
    } catch (error) {
      console.error("Failed to toggle active status", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white w-full max-w-xl mx-4 p-8 rounded-xl shadow-xl">
        {/* Toggle Active/Inactive Button */}
        <button
          className={`absolute top-4 right-4 px-3 py-1 text-sm rounded font-medium transition hover:cursor-pointer text-white ${
            isActive
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 hover:bg-gray-500"
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
            className={`px-5 py-2 rounded-md text-white transition hover:cursor-pointer ${
              isTakenOnSelectedDate
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => handleUpdateTakeLog(selectedMed.id)}
          >
            {isTakenOnSelectedDate ? "Mark as not taken" : "Mark as Taken"}
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
