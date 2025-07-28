import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { getMedications, updateTakeLog } from "../api";
import { Calendar, Toaster, Modal } from "../components";
import type { Medication, ToastType } from "../../../types";
import type { Moment } from "moment";

export const UserCalendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const { id: userId } = useParams<{ id: string }>();

  useEffect(() => {
    if (userId) getMedications(userId).then(setMeds);
  }, [userId]);

  const handleUpdateTakeLog = async (medId: string) => {
    if (!selectedDate || !userId) return;

    try {
      await updateTakeLog(medId, selectedDate.format("YYYY-MM-DD"));
      const updated = await getMedications(userId);
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
        setSelectedMed={setSelectedMed}
        setSelectedDate={setSelectedDate}
      />

      {selectedMed && selectedDate && (
        <Modal
          selectedMed={selectedMed}
          selectedDate={selectedDate}
          setSelectedMed={setSelectedMed}
          setMeds={setMeds}
          handleUpdateTakeLog={handleUpdateTakeLog}
          userId={userId || ''}
        />
      )}
    </div>
  );
}
