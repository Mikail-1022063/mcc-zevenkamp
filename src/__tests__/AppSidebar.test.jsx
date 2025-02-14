import React from "react";
import { render, screen } from "@testing-library/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
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

describe("AppSidebar Component", () => {
  test("renders sidebar with menu items", () => {
    render(
      <SidebarProvider>
        <AppSidebar
          username="Test User"
          email="test@example.com"
          isDarkMode={false}
        />
      </SidebarProvider>,
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Inbox/i)).toBeInTheDocument();
  });

  test("displays the user information", () => {
    render(
      <SidebarProvider>
        <AppSidebar
          username="Test User"
          email="test@example.com"
          isDarkMode={false}
        />
      </SidebarProvider>,
    );
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });
});
