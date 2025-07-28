import { Link, useParams } from "react-router-dom";
import type { FC } from "react";
import { NavbarLink } from "./NavbarLink";

export const Navbar: FC = () => {
  const { id: userId } = useParams();

  return (
    <nav className="bg-blue-600 text-white flex justify-between items-center p-4 mb-6 rounded">
      <Link to="/" className="text-xl font-bold font-serif tracking-wide">
        💊 Medication Manager
      </Link>
      <div className="flex gap-4">
        {userId ? (
          <>
            <NavbarLink route={`/${userId}/calendar`} title="Calendar" />
            <NavbarLink
              route={`/${userId}/inactive-medications`}
              title="Inactive Medications"
            />
            <NavbarLink
              route={`/${userId}/add-medication`}
              title="Add Medication"
            />
          </>
        ) : (
            // Displays the add user form if no user is selected
          <NavbarLink route="/add-user" title="Add User" />
        )}
      </div>
    </nav>
  );
};
