import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NavbarLink } from "../NavbarLink";

describe("NavbarLinkButton", () => {
  it("renders with active styling when route matches pathname", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <NavbarLink route="/dashboard" title="Dashboard" />
      </MemoryRouter>
    );
    const button = getByText("Dashboard");
    expect(button).toHaveClass("bg-blue-600");
  });

  it("renders with default styling when route does not match pathname", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/settings"]}>
        <NavbarLink route="/dashboard" title="Dashboard" />
      </MemoryRouter>
    );
    const button = getByText("Dashboard");
    expect(button).toHaveClass("bg-white");
  });
});