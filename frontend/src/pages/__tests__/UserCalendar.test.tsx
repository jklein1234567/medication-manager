import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserCalendar } from "../UserCalender";
import { getMedications, updateTakeLog } from "../../api";
import userEvent from "@testing-library/user-event";
import moment from "moment";

jest.mock("../../api", () => ({
  getMedications: jest.fn(),
  updateTakeLog: jest.fn(),
}));

const mockedGetMedications = getMedications as jest.Mock;
const mockedUpdateTakeLog = updateTakeLog as jest.Mock;

jest.mock("../../components", () => ({
  Calendar: ({ setSelectedMed, setSelectedDate }: any) => (
    <button
      onClick={() => {
        setSelectedMed({ id: "1", name: "TestMed" });
        setSelectedDate(moment("2025-07-28"));
      }}
    >
      Open Modal
    </button>
  ),
  Modal: ({
    handleUpdateTakeLog,
  }: {
    handleUpdateTakeLog: (id: string) => void;
  }) => (
    <button onClick={() => handleUpdateTakeLog("1")}>Confirm</button>
  ),
  Toaster: ({ message }: { message: string }) => <div>{message}</div>,
}));

const renderWithRoute = () =>
  render(
    <MemoryRouter initialEntries={["/123/calendar"]}>
      <Routes>
        <Route path="/:id/calendar" element={<UserCalendar />} />
      </Routes>
    </MemoryRouter>
  );

describe("UserCalendar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads and displays medications on mount", async () => {
    mockedGetMedications.mockResolvedValueOnce([{ id: "1", name: "Aspirin" }]);
    renderWithRoute();
    await waitFor(() => {
      expect(mockedGetMedications).toHaveBeenCalledWith("123");
    });
  });

  it("reacts to confirming medication and shows success toast", async () => {
    mockedGetMedications
      .mockResolvedValueOnce([{ id: "1", name: "TestMed" }]) // initial load
      .mockResolvedValueOnce([]); // after update

    mockedUpdateTakeLog.mockResolvedValueOnce({});

    renderWithRoute();

    await userEvent.click(await screen.findByText("Open Modal"));
    await userEvent.click(await screen.findByText("Confirm"));

    await waitFor(() => {
      expect(mockedUpdateTakeLog).toHaveBeenCalledWith("1", "2025-07-28");
      expect(
        screen.getByText("Marked as taken successfully")
      ).toBeInTheDocument();
    });
  });

  it("shows error toast on update failure", async () => {
    mockedGetMedications
      .mockResolvedValueOnce([{ id: "1", name: "TestMed" }])
      .mockRejectedValueOnce(new Error("Failed"));

    mockedUpdateTakeLog.mockRejectedValueOnce(new Error("Failed"));

    renderWithRoute();

    await userEvent.click(await screen.findByText("Open Modal"));
    await userEvent.click(await screen.findByText("Confirm"));

    await waitFor(() => {
      expect(
        screen.getByText("Error marking medication")
      ).toBeInTheDocument();
    });
  });
});
