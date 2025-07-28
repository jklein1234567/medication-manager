import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
  route: string;
  title: string;
}

export const NavbarLink: FC<Props> = ({ route, title }: Props) => {
  const { pathname } = useLocation();
  return (
    <Link
      to={route}
      className={`px-4 py-2 rounded font-medium transition ${
        pathname === route
          ? "bg-blue-600 text-white border border-white"
          : "bg-white text-blue-600 hover:bg-gray-100"
      }`}
    >
      {title}
    </Link>
  );
};
