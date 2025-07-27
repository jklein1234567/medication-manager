import type { FC } from "react";
import type { Medication } from "../../../types";

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
  const { daysOfWeek } = selectedMed;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl mx-4 p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {selectedMed.name}
        </h2>

        <p className="text-gray-700 text-base mb-2">
          <span className="font-medium capitalize">
            {selectedMed.scheduleType}
          </span>{" "}
          – {selectedMed.times.join(", ")}
        </p>
        {/* Check is daysOfWeek is included since it's an optional array of days */}
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
