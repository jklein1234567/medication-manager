import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Modal } from "../Modal";
import moment from "moment";
import { Medication, ScheduleType } from "../../../../types";

jest.mock("../../api", () => ({
  toggleActivity: jest.fn(() => Promise.resolve()),
  getMedications: jest.fn(() => Promise.resolve([])),
}));

const mockSetSelectedMed = jest.fn();
const mockSetMeds = jest.fn();
const mockHandleUpdateTakeLog = jest.fn();

const selectedMed: Medication = {
  id: "med-123",
  name: "TestMed",
  isActive: true,
  times: 2,
  scheduleType: ScheduleType.DAILY,
  takenLog: [],
  userId: "user-1",
  type: "Tablet",
  purpose: "Testing",
  daysOfWeek: [],
};

describe("Modal", () => {
  const today = moment();

  beforeEach(() => {
    render(
      <Modal
        userId="user-1"
        selectedMed={selectedMed}
        selectedDate={today}
        setSelectedMed={mockSetSelectedMed}
        setMeds={mockSetMeds}
        handleUpdateTakeLog={mockHandleUpdateTakeLog}
      />
    );
  });

  it("renders medication info", () => {
    expect(screen.getByText("TestMed")).toBeInTheDocument();

    expect(
      screen.getByText(
        (content, element) => element?.textContent === "Purpose: Testing"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        (content, element) => element?.textContent === "Type: Tablet"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        (content, element) => element?.textContent === "Schedule: daily – 2x"
      )
    ).toBeInTheDocument();
  });

  it("calls toggleActivity on Active button click", async () => {
    fireEvent.click(screen.getByText("Active"));
    await waitFor(() => {
      expect(mockSetMeds).toHaveBeenCalled();
    });
  });

  it("calls handleUpdateTakeLog on 'Mark as Taken' click", () => {
    fireEvent.click(screen.getByText("Mark as Taken"));
    expect(mockHandleUpdateTakeLog).toHaveBeenCalledWith("med-123");
  });

  it("closes modal on Cancel", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockSetSelectedMed).toHaveBeenCalledWith(null);
  });
});
