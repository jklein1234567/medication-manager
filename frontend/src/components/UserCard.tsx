import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../../types";

interface Props {
  user: User;
}

export const UserCard: FC<Props> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <li
      key={user.id}
      className="flex items-center gap-4 p-4 border rounded shadow hover:shadow-md transition hover:cursor-pointer"
      onClick={() => navigate(`/${user.id}/calendar`)}
    >
      {user.image && (
        <img
          src={user.image}
          alt={`${user.name}'s avatar`}
          className="w-14 h-14 object-cover rounded-full border"
        />
      )}
      <div>
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
    </li>
  );
};
