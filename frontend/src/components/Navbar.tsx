import { Link, useParams } from "react-router-dom";
import type { FC } from "react";
import { NavbarLinkButton } from "./NavbarLink";

export const Navbar: FC = () => {
  const { id: userId } = useParams();

  return (
    <nav className="bg-blue-600 text-white flex justify-between items-center p-4 mb-6 rounded">
      <Link to="/" className="text-xl font-bold font-serif tracking-wide">
        💊 Medication Manager
      </Link>
      <div className="flex gap-4">
        <NavbarLinkButton route={`/${userId}/calendar`} title="Calendar" />
        <NavbarLinkButton
          route={`/${userId}/inactive`}
          title="Inactive Medications"
        />
        <NavbarLinkButton route={`/${userId}/add`} title="Add Medication" />
      </div>
    </nav>
  );
};
