import { useEffect, useState } from "react";
import type { FC } from "react";
import moment from "moment";
import { getMedications, updateTakeLog } from "../api";
import { Toaster, Calendar, Modal } from "../components";
import type { ToastType, Medication } from "../../../types";
import type { Moment } from "moment";

export const HomePage: FC = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  useEffect(() => {
    getMedications().then(setMeds);
  }, []);

  const handleUpdateTakeLog = async (id: string) => {
    if (!selectedDate) return;

    try {
      await updateTakeLog(id, selectedDate.format("YYYY-MM-DD"));
      const updated = await getMedications();
      setMeds(updated);
      setToast({ message: "Marked as taken successfully", type: "success" });
    } catch {
      setToast({ message: "Error marking medication", type: "error" });
    }
    setSelectedMed(null);
    setSelectedDate(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Calendar
        currentDate={currentDate}
        meds={meds}
        setCurrentDate={setCurrentDate}
        setSelectedMed={(med) => {
          setSelectedMed(med);
        }}
        setSelectedDate={setSelectedDate}
      />

      {selectedMed && selectedDate && (
        <Modal
          selectedMed={selectedMed}
          selectedDate={selectedDate}
          setSelectedMed={setSelectedMed}
          setMeds={setMeds}
          handleUpdateTakeLog={handleUpdateTakeLog}
        />
      )}
    </div>
  );
};
