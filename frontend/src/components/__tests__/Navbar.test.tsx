import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "../Navbar";

describe("Navbar", () => {
  it("renders links for a user when userId is present in the URL", () => {
    render(
      <MemoryRouter initialEntries={["/user-1/calendar"]}>
        <Routes>
          <Route path="/:id/calendar" element={<Navbar />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Medication Manager/)).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Inactive Medications")).toBeInTheDocument();
    expect(screen.getByText("Add Medication")).toBeInTheDocument();
  });

  it("renders Add User link when no userId is present in the URL", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Navbar />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Medication Manager/)).toBeInTheDocument();
    expect(screen.getByText("Add User")).toBeInTheDocument();
    expect(screen.queryByText("Calendar")).not.toBeInTheDocument();
    expect(screen.queryByText("Inactive Medications")).not.toBeInTheDocument();
    expect(screen.queryByText("Add Medication")).not.toBeInTheDocument();
  });
});
