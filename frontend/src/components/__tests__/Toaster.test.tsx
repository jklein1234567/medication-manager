import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Toaster } from "../Toaster";

describe("Toaster", () => {
  jest.useFakeTimers();

  it("renders success toaster and auto-dismisses", async () => {
    const mockOnClose = jest.fn();
    render(<Toaster message="Success!" type="success" onClose={mockOnClose} />);
    expect(screen.getByText("Success!")).toBeInTheDocument();
    jest.runAllTimers();
    await waitFor(() => expect(mockOnClose).toHaveBeenCalled());
  });

  it("renders error toaster and closes on click", () => {
    const mockOnClose = jest.fn();
    render(<Toaster message="Error!" type="error" onClose={mockOnClose} />);
    fireEvent.click(screen.getByText("×"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});