import { useEffect, useState } from 'react';
import { getMedications } from '../api';

export const Home = () => {
  const [meds, setMeds] = useState<any[]>([]);

  useEffect(() => {
    getMedications().then(setMeds);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Upcoming Doses</h1>
      <ul>
        {meds.map((m) => (
          <li key={m.id}>{m.name} – {m.scheduleType}</li>
        ))}
      </ul>
    </div>
  );
};