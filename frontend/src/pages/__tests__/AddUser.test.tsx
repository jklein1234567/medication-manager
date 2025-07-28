import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AddUser } from "../AddUser";
import { User } from "../../../../types";

const mockedCreateUser = jest.fn((user: User) => Promise.resolve(user));

jest.mock("../../api", () => ({
  createUser: (user: User) => mockedCreateUser(user),
}));

describe("AddUser", () => {
  beforeEach(() => {
    mockedCreateUser.mockClear();
  });

  it("renders form fields", () => {
    render(
      <MemoryRouter>
        <AddUser />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Image URL (optional)")).toBeInTheDocument();
  });

  it("submits and shows success", async () => {
    render(
      <MemoryRouter>
        <AddUser />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });

    userEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      expect(screen.getByText("User created successfully!")).toBeInTheDocument();
    });

    expect(mockedCreateUser).toHaveBeenCalledWith({
      name: "John",
      email: "john@example.com",
      image: "",
    });
  });

  it("submits with image field filled", async () => {
    render(
      <MemoryRouter>
        <AddUser />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Image URL (optional)"), {
      target: { value: "https://example.com/avatar.jpg" },
    });

    userEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      expect(screen.getByText("User created successfully!")).toBeInTheDocument();
    });

    expect(mockedCreateUser).toHaveBeenCalledWith({
      name: "Jane",
      email: "jane@example.com",
      image: "https://example.com/avatar.jpg",
    });
  });

  it("shows error message when API call fails", async () => {
    mockedCreateUser.mockImplementationOnce(() => Promise.reject());

    render(
      <MemoryRouter>
        <AddUser />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Bob" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "bob@example.com" },
    });

    userEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      expect(screen.getByText("Failed to create user")).toBeInTheDocument();
    });
  });

  it("renders a submit button", () => {
    render(
      <MemoryRouter>
        <AddUser />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: "Add User" });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("does not submit if required fields are missing", async () => {
    render(
      <MemoryRouter>
        <AddUser />
      </MemoryRouter>
    );

    userEvent.click(screen.getByText("Add User"));

    await waitFor(() => {
      expect(mockedCreateUser).not.toHaveBeenCalled();
    });
  });
});
