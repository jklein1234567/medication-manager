import { Link } from "react-router-dom";
import type { FC } from "react";

export const Navbar: FC = () => (
  <nav className="bg-blue-600 text-white flex justify-between items-center p-4 mb-6 rounded">
    <Link to="/" className="text-xl font-bold font-serif tracking-wide">
      💊 Medication Manager
    </Link>
    <div className="flex gap-4">
      <Link
        to="/inactive"
        className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
      >
        Inactive Medications
      </Link>
      <Link
        to="/add"
        className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
      >
        Add Medication
      </Link>
    </div>
  </nav>
);
