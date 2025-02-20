import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarUserMenu } from "../components/sidebar/SidebarUserMenu";
import "@testing-library/jest-dom";

if (typeof window !== "undefined") {
  window.matchMedia =
    window.matchMedia ||
    (() => {
      return {
        matches: false,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      };
    });
}

test("displays user menu with correct information", () => {
  render(
    <MemoryRouter>
      <SidebarProvider>
        <SidebarUserMenu
          username="Test User"
          email="test@example.com"
          avatarUrl=""
        />
      </SidebarProvider>
    </MemoryRouter>
  );

  expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
});
