import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";
import { SidebarDarkMode } from "@/components/sidebar/SidebarDarkMode";

test("toggles dark mode", () => {
  const handleToggle = jest.fn();
  render(<SidebarDarkMode isDarkMode={false} onToggleTheme={handleToggle} />);

  const toggleButton = screen.getByRole("switch");
  fireEvent.click(toggleButton);
  expect(handleToggle).toHaveBeenCalledTimes(1);
});
