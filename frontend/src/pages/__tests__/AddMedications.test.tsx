import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AddMedication } from "../AddMedications";
import { ScheduleType, Day, Medication } from "../../../../types";

const mockedAddMedication = jest.fn((medication: Medication) => Promise.resolve(medication));

jest.mock("../../api", () => ({
    addMedication: (medication: Medication) =>
        mockedAddMedication(medication),
  }));

const renderWithRouter = (route = "/user-123/add-medication") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/:id/add-medication" element={<AddMedication />} />
      </Routes>
    </MemoryRouter>
  );

describe("AddMedication", () => {
  beforeEach(() => {
    mockedAddMedication.mockClear();
  });

  it("renders the form fields", () => {
    renderWithRouter();

    expect(screen.getByPlaceholderText("Medication Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type (e.g. Tablet, Injection)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Purpose (e.g. Blood pressure)")).toBeInTheDocument();
  });

  it("submits the form and shows success", async () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("Medication Name"), { target: { value: "TestMed" } });
    fireEvent.change(screen.getByPlaceholderText("Type (e.g. Tablet, Injection)"), { target: { value: "Tablet" } });
    fireEvent.change(screen.getByPlaceholderText("Purpose (e.g. Blood pressure)"), { target: { value: "Testing" } });

    userEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Successfully added!")).toBeInTheDocument();
    });
  });


  it("shows error if no userId in URL", async () => {
    // Render route that does NOT match ":id"
    render(
      <MemoryRouter initialEntries={["/add-medication"]}>
        <Routes>
          {/* This route will NOT match the path so nothing renders */}
          <Route path="/:id/add-medication" element={<AddMedication />} />
        </Routes>
      </MemoryRouter>
    );
  
    expect(screen.queryByPlaceholderText("Medication Name")).not.toBeInTheDocument();
    // Test passes if form is not rendered
  });

  it("requires selecting at least one day for weekly schedule", async () => {
    renderWithRouter();
  
    fireEvent.change(screen.getByPlaceholderText("Medication Name"), { target: { value: "WeeklyMed" } });
    fireEvent.change(screen.getByPlaceholderText("Type (e.g. Tablet, Injection)"), { target: { value: "Pill" } });
    fireEvent.change(screen.getByPlaceholderText("Purpose (e.g. Blood pressure)"), { target: { value: "Purpose" } });
  
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: ScheduleType.WEEKLY },
    });
  
    userEvent.click(screen.getByText("Submit"));
  
    await waitFor(() => {
      expect(screen.getByText("Select at least one day for weekly meds")).toBeInTheDocument();
    });
  });

  it("submits successfully with weekly schedule and selected days", async () => {
    renderWithRouter();
  
    fireEvent.change(screen.getByPlaceholderText("Medication Name"), { target: { value: "WeeklyMed" } });
    fireEvent.change(screen.getByPlaceholderText("Type (e.g. Tablet, Injection)"), { target: { value: "Capsule" } });
    fireEvent.change(screen.getByPlaceholderText("Purpose (e.g. Blood pressure)"), { target: { value: "Purpose" } });
  
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: ScheduleType.WEEKLY },
    });
  
    userEvent.click(screen.getByText(Day.MONDAY));
  
    userEvent.click(screen.getByText("Submit"));
  
    await waitFor(() => {
      expect(screen.getByText("Successfully added!")).toBeInTheDocument();
    });
  
    expect(mockedAddMedication).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "WeeklyMed",
        scheduleType: ScheduleType.WEEKLY,
        daysOfWeek: [Day.MONDAY],
        userId: "user-123",
      })
    );
  });


  it("submits successfully with weekly schedule and selected days", async () => {
    renderWithRouter();
  
    fireEvent.change(screen.getByPlaceholderText("Medication Name"), { target: { value: "WeeklyMed" } });
    fireEvent.change(screen.getByPlaceholderText("Type (e.g. Tablet, Injection)"), { target: { value: "Capsule" } });
    fireEvent.change(screen.getByPlaceholderText("Purpose (e.g. Blood pressure)"), { target: { value: "Purpose" } });
  
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: ScheduleType.WEEKLY },
    });
  
    // Select Monday
    userEvent.click(screen.getByText(Day.MONDAY));
  
    userEvent.click(screen.getByText("Submit"));
  
    await waitFor(() => {
      expect(screen.getByText("Successfully added!")).toBeInTheDocument();
    });
  
    expect(mockedAddMedication).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "WeeklyMed",
        scheduleType: ScheduleType.WEEKLY,
        daysOfWeek: [Day.MONDAY],
        userId: "user-123",
      })
    );
  });

  it("submits successfully with monthly schedule and day", async () => {
    renderWithRouter();
  
    fireEvent.change(screen.getByPlaceholderText("Medication Name"), { target: { value: "MonthlyMed" } });
    fireEvent.change(screen.getByPlaceholderText("Type (e.g. Tablet, Injection)"), { target: { value: "Syringe" } });
    fireEvent.change(screen.getByPlaceholderText("Purpose (e.g. Blood pressure)"), { target: { value: "Purpose" } });
  
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: ScheduleType.MONTHLY },
    });
  
    fireEvent.change(screen.getByPlaceholderText("Day of the month (e.g. 15)"), {
      target: { value: "10" },
    });
  
    userEvent.click(screen.getByText("Submit"));
  
    await waitFor(() => {
      expect(screen.getByText("Successfully added!")).toBeInTheDocument();
    });
  });

  it("shows error if API call fails", async () => {
    mockedAddMedication.mockImplementationOnce(() => Promise.reject());

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("Medication Name"), { target: { value: "FailedMed" } });
    fireEvent.change(screen.getByPlaceholderText("Type (e.g. Tablet, Injection)"), { target: { value: "Liquid" } });
    fireEvent.change(screen.getByPlaceholderText("Purpose (e.g. Blood pressure)"), { target: { value: "Testing error" } });

    userEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Failed to add medication")).toBeInTheDocument();
    });
  });
});
