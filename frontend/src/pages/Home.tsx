import { useEffect, useState } from 'react';
import { getMedications, markAsTaken } from '../api';
import moment from 'moment';
import clsx from 'clsx';

export const Home = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [meds, setMeds] = useState<any[]>([]);
  const [selectedMed, setSelectedMed] = useState<any | null>(null);

  useEffect(() => {
    getMedications().then(setMeds);
  }, []);

  const start = currentDate.clone().startOf('month').startOf('week');
  const end = currentDate.clone().endOf('month').endOf('week');
  const days = [];
  const day = start.clone();
  while (day.isBefore(end)) {
    days.push(day.clone());
    day.add(1, 'day');
  }

  const isPast = (date: moment.Moment) => date.isBefore(moment(), 'day');
  const isToday = (date: moment.Moment) => date.isSame(moment(), 'day');

  const handleMarkAsTaken = async (id: string) => {
    await markAsTaken(id);
    getMedications().then(setMeds);
    setSelectedMed(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setCurrentDate(currentDate.clone().subtract(1, 'month'))}
        >
          ← Prev
        </button>
        <h2 className="text-2xl font-bold">{currentDate.format('MMMM YYYY')}</h2>
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setCurrentDate(currentDate.clone().add(1, 'month'))}
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2 font-semibold text-gray-600">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const medsForDay = meds.filter(
            (m) =>
              m.scheduleType === 'daily' ||
              (m.scheduleType === 'weekly' && m.daysOfWeek?.includes(day.format('ddd')))
          );

          return (
            <div
              key={day.toISOString()}
              className={clsx(
                'border rounded p-2 min-h-[100px] text-left transition',
                isPast(day) ? 'bg-gray-100 text-gray-400' : '',
                isToday(day) ? 'bg-yellow-100 border-yellow-500 shadow' : 'hover:shadow'
              )}
            >
              <div className="text-sm font-semibold">{day.format('D')}</div>
              <div className="mt-1 space-y-1">
                {medsForDay.map((med) => (
                  <button
                    key={med.id}
                    className="block w-full text-xs text-blue-600 underline text-left disabled:opacity-40"
                    onClick={() => !isPast(day) && setSelectedMed(med)}
                    disabled={isPast(day)}
                  >
                    {med.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedMed && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-2">{selectedMed.name}</h2>
            <p className="text-sm text-gray-700 mb-1">
              {selectedMed.scheduleType} — {selectedMed.times.join(', ')}
            </p>
            {selectedMed.daysOfWeek?.length > 0 && (
              <p className="text-sm text-gray-500 mb-4">
                Days: {selectedMed.daysOfWeek.join(', ')}
              </p>
            )}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => handleMarkAsTaken(selectedMed.id)}
            >
              ✅ Mark as Taken
            </button>
            <button
              className="ml-4 text-sm text-gray-600 hover:underline"
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
