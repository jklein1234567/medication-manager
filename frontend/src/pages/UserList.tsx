import { useEffect, useState } from "react";
import { getAllUsers } from "../api";
import { useNavigate } from "react-router-dom";
import { UserCard } from "../components";
import type { User } from "../../../types";

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Select a User</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {users.map((user) => (
          <UserCard user={user} key={user.id} />
        ))}
      </ul>
    </div>
  );
};
