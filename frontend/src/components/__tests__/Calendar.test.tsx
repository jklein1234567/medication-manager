import { render, fireEvent } from "@testing-library/react";
import moment from "moment";
import { Calendar } from "../Calendar";
import { Medication, ScheduleType } from "../../../../types";

describe("Calendar", () => {
  const currentDate = moment("2025-07-01");
  const mockSetCurrentDate = jest.fn();
  const mockSetSelectedDate = jest.fn();
  const mockSetSelectedMed = jest.fn();

  const meds: Medication[] = [
    {
      id: "med-1",
      name: "Vitamin D",
      userId: "user-1",
      isActive: true,
      times: 1,
      scheduleType: ScheduleType.DAILY,
      takenLog: [],
      type: "Capsule",
      purpose: "Bone health",
      daysOfWeek: [],
    },
  ];

  it("renders the calendar and medication names", () => {
    const { getByText, getAllByText } = render(
      <Calendar
        currentDate={currentDate}
        meds={meds}
        setCurrentDate={mockSetCurrentDate}
        setSelectedDate={mockSetSelectedDate}
        setSelectedMed={mockSetSelectedMed}
      />
    );

    expect(getByText("July 2025")).toBeInTheDocument();
    expect(getAllByText("Vitamin D").length).toBeGreaterThan(0);
  });

  it("navigates to previous month", () => {
    const { getByText } = render(
      <Calendar
        currentDate={currentDate}
        meds={[]}
        setCurrentDate={mockSetCurrentDate}
        setSelectedDate={mockSetSelectedDate}
        setSelectedMed={mockSetSelectedMed}
      />
    );

    fireEvent.click(getByText("← Prev"));
    expect(mockSetCurrentDate).toHaveBeenCalled();
  });

  it("navigates to next month", () => {
    const { getByText } = render(
      <Calendar
        currentDate={currentDate}
        meds={[]}
        setCurrentDate={mockSetCurrentDate}
        setSelectedDate={mockSetSelectedDate}
        setSelectedMed={mockSetSelectedMed}
      />
    );

    fireEvent.click(getByText("Next →"));
    expect(mockSetCurrentDate).toHaveBeenCalled();
  });

  it("selects a medication when clicked", () => {
    const { getAllByText } = render(
      <Calendar
        currentDate={currentDate}
        meds={meds}
        setCurrentDate={mockSetCurrentDate}
        setSelectedDate={mockSetSelectedDate}
        setSelectedMed={mockSetSelectedMed}
      />
    );

    fireEvent.click(getAllByText("Vitamin D")[0]);
    expect(mockSetSelectedDate).toHaveBeenCalled();
    expect(mockSetSelectedMed).toHaveBeenCalledWith(meds[0]);
  });
});
