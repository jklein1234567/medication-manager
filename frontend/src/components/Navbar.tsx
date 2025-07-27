import { Link } from "react-router-dom";

export const Navbar = () => (
  <nav className="bg-blue-600 text-white flex justify-between items-center p-4 mb-6 rounded">
    <h1 className="text-xl font-bold font-serif tracking-wide">
      💊 Medication Manager
    </h1>
    <Link
      to="/add"
      className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 font-medium"
    >
      + Add Medication
    </Link>
  </nav>
);
