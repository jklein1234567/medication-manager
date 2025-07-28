import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { InactiveMedications } from "../InactiveMedications";

const mockedGetMedications = jest.fn();
const mockedToggleActivity = jest.fn();

jest.mock("../../api", () => ({
  getMedications: (...args: any[]) => mockedGetMedications(...args),
  toggleActivity: (...args: any[]) => mockedToggleActivity(...args),
}));

describe("InactiveMedications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRoute = () =>
    render(
      <MemoryRouter initialEntries={["/user-123/inactive-medications"]}>
        <Routes>
          <Route path="/:id/inactive-medications" element={<InactiveMedications />} />
        </Routes>
      </MemoryRouter>
    );

  it("shows loading state initially", async () => {
    mockedGetMedications.mockImplementationOnce(() => new Promise(() => {})); // never resolves

    renderWithRoute();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders 'no inactive medications' when all are active", async () => {
    mockedGetMedications.mockResolvedValueOnce([
      { id: "1", name: "ActiveMed", scheduleType: "daily", times: 1, isActive: true },
    ]);

    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText("No inactive medications.")).toBeInTheDocument();
    });
  });

  it("renders inactive medications and reactivates on click", async () => {
    mockedGetMedications
      .mockResolvedValueOnce([
        { id: "1", name: "TestMed", scheduleType: "daily", times: 1, isActive: false },
      ])
      .mockResolvedValueOnce([]); // after reactivation
  
    renderWithRoute();
  
    await waitFor(() => {
      expect(screen.getByText("TestMed")).toBeInTheDocument();
    });
  
    userEvent.click(screen.getByText("Reactivate"));
  
    await waitFor(() => {
      expect(mockedToggleActivity).toHaveBeenCalledWith("1");
    });
  
    expect(mockedGetMedications).toHaveBeenCalledTimes(2); // once on mount, once after reactivation
  });
  

  it("renders multiple inactive medications", async () => {
    mockedGetMedications.mockResolvedValueOnce([
      { id: "1", name: "Med A", scheduleType: "daily", times: 1, isActive: false },
      { id: "2", name: "Med B", scheduleType: "weekly", times: 2, isActive: false },
    ]);

    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText("Med A")).toBeInTheDocument();
      expect(screen.getByText("Med B")).toBeInTheDocument();
      expect(screen.getAllByText("Reactivate")).toHaveLength(2);
    });
  });
});
