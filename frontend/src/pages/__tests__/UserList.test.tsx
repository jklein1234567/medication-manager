import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserList } from "../UserList";
import { getAllUsers } from "../../api";

jest.mock("../../api", () => ({
  getAllUsers: jest.fn(),
}));

jest.mock("../../components", () => ({
  UserCard: ({ user }: any) => <div>{user.name}</div>,
}));

const mockedGetAllUsers = getAllUsers as jest.Mock;

describe("UserList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and renders users", async () => {
    mockedGetAllUsers.mockResolvedValueOnce([
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ]);

    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedGetAllUsers).toHaveBeenCalled();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });
});
