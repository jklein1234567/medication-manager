import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../../types";

interface Props {
  user: User;
}

export const UserCard: FC<Props> = ({ user }: Props) => {
  const navigate = useNavigate();
  return (
    <li
      key={user.id}
      className="p-4 border rounded shadow hover:shadow-md transition hover:cursor-pointer"
      onClick={() => navigate(`/${user.id}/calendar`)}
    >
      <h2 className="text-lg font-semibold">{user.name}</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
    </li>
  );
};
