import { render, screen, fireEvent } from "@testing-library/react";
import { UserCard } from "../UserCard";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const user = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  image: "https://example.com/avatar.jpg"
};

describe("UserCard", () => {
  it("renders user info", () => {
    render(
      <MemoryRouter>
        <UserCard user={user} />
      </MemoryRouter>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByAltText("John Doe's avatar")).toBeInTheDocument();
  });

  it("navigates to calendar on click", () => {
    render(
      <MemoryRouter>
        <UserCard user={user} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("John Doe"));
    expect(mockNavigate).toHaveBeenCalledWith("/user-1/calendar");
  });
});