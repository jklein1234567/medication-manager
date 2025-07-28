import { useEffect, useState } from "react";
import type { FC } from "react";
import { useParams } from "react-router-dom";
import { getMedications, toggleActivity } from "../api";
import type { Medication } from "../../../types";

export const InactiveMedications: FC = () => {
  const [inactiveMeds, setInactiveMeds] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  const { id: userId } = useParams<{ id: string }>();

  const fetchInactiveMeds = async () => {
    const all = await getMedications(userId as string);
    setInactiveMeds(all.filter((med: Medication) => !med.isActive));
    setLoading(false);
  };

  const handleReactivate = async (id: string) => {
    await toggleActivity(id);
    await fetchInactiveMeds();
  };

  useEffect(() => {
    fetchInactiveMeds();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Inactive Medications
      </h1>

      {inactiveMeds.length === 0 ? (
        <p className="text-center text-gray-500">No inactive medications.</p>
      ) : (
        <ul className="space-y-4">
          {inactiveMeds.map((med) => (
            <li
              key={med.id}
              className="flex justify-between items-center bg-white p-4 shadow rounded border border-gray-200"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {med.name}
                </h2>
                <p className="text-sm text-gray-500 capitalize">
                  {med.scheduleType} –{" "}
                  {Array.isArray(med.times) ? med.times.join(", ") : ""}
                </p>
              </div>
              <button
                onClick={() => handleReactivate(med.id)}
                className="bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer px-4 py-2 rounded transition"
              >
                Reactivate
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
