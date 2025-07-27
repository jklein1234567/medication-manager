import { useEffect, useState } from "react";
import { getMedications, markAsTaken } from "../api";
import moment from "moment";
import { Navbar } from "../components/Navbar";
import { Toaster } from "../components";
import { ToastType } from "../../../types";

export const HomePage = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [meds, setMeds] = useState<any[]>([]);
  const [selectedMed, setSelectedMed] = useState<any | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    getMedications().then(setMeds);
  }, []);

  const start = currentDate.clone().startOf("month").startOf("week");
  const end = currentDate.clone().endOf("month").endOf("week");
  const days = [];
  const day = start.clone();
  while (day.isBefore(end)) {
    days.push(day.clone());
    day.add(1, "day");
  }

  const handleMarkAsTaken = async (id: string) => {
    try {
      await markAsTaken(id);
      const updated = await getMedications();
      setMeds(updated);
      setToast({ message: "Marked as taken successfully", type: "success" });
    } catch {
      setToast({ message: "Error marking medication", type: "error" });
    }
    setSelectedMed(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Navbar />
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setCurrentDate(currentDate.clone().subtract(1, "month"))
          }
        >
          &larr; Prev
        </button>
        <h2 className="text-xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <button
          onClick={() => setCurrentDate(currentDate.clone().add(1, "month"))}
        >
          Next &rarr;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => {
          const greyedOut = day.isBefore(moment(), "day");
          const today = day.isSame(moment(), "day");
          return (
            <div
              key={day.toISOString()}
              className={`border rounded p-2 min-h-[80px] ${
                greyedOut ? "bg-gray-100 text-gray-400 pointer-events-none" : ""
              } ${today ? "bg-yellow-100 border-yellow-500" : ""}`}
            >
              <div className="text-sm font-semibold">{day.format("D")}</div>
              {meds
                .filter(
                  (m) =>
                    m.scheduleType === "daily" ||
                    (m.scheduleType === "weekly" &&
                      m.daysOfWeek?.includes(day.format("ddd")))
                )
                .map((med) => (
                  <button
                    key={med.id}
                    className="text-xs text-blue-600 underline disabled:opacity-50"
                    disabled={greyedOut}
                    onClick={() => !greyedOut && setSelectedMed(med)}
                  >
                    {med.name}
                  </button>
                ))}
            </div>
          );
        })}
      </div>

      {selectedMed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-2">{selectedMed.name}</h2>
            <p className="text-sm text-gray-700 mb-2">
              {selectedMed.scheduleType} – {selectedMed.times.join(", ")}
            </p>
            {selectedMed.daysOfWeek?.length > 0 && (
              <p className="text-sm text-gray-500 mb-4">
                Days: {selectedMed.daysOfWeek.join(", ")}
              </p>
            )}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => handleMarkAsTaken(selectedMed.id)}
            >
              ✅ Mark as Taken
            </button>
            <button
              className="ml-2 text-sm text-gray-600 hover:underline"
              onClick={() => setSelectedMed(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
