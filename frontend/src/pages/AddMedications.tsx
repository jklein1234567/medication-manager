import { useState } from 'react';
import { addMedication } from '../api';

export const AddMedication = () => {
  const [name, setName] = useState('');
  const [scheduleType, setScheduleType] = useState<'daily' | 'weekly'>('daily');
  const [times, setTimes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMedication({ name, scheduleType, times: times.split(',').map((t) => t.trim()) });
    setName('');
    setScheduleType('daily');
    setTimes('');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Add New Medication</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Medication Name"
          required
        />
        <select
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value as 'daily' | 'weekly')}
          className="w-full p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          value={times}
          onChange={(e) => setTimes(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Times (comma separated, e.g. 08:00,14:00)"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Medication
        </button>
      </form>
    </div>
  );
};