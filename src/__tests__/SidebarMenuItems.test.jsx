import React from "react";
import { render, screen } from "@testing-library/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarMenuItems } from "../components/sidebar/SidebarMenuItems";
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

test("renders all menu items", () => {
  render(
    <SidebarProvider>
      <SidebarMenuItems />
    </SidebarProvider>,
  );
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Inbox/i)).toBeInTheDocument();
  expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
  expect(screen.getByText(/Search/i)).toBeInTheDocument();
  expect(screen.getByText(/Settings/i)).toBeInTheDocument();
});
