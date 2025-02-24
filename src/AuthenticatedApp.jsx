import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import LedenPage from "./pages/LedenPage";
import DynamicBreadcrumb from "./components/DynamicBreadcrumb";

export default function AuthenticatedApp({ children }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const [userAttributes, setUserAttributes] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (user) {
      const loadUserAttributes = async () => {
        try {
          const attributes = await fetchUserAttributes();
          setUserAttributes(attributes);
        } catch (error) {
          console.error("Failed to fetch user attributes:", error);
        }
      };
      loadUserAttributes();
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
  };

  const username =
    `${userAttributes?.given_name ?? user?.attributes?.given_name ?? ""} ${userAttributes?.family_name ?? user?.attributes?.family_name ?? ""}`.trim() ||
    "Guest";
  const email = userAttributes?.email || user?.attributes?.email || "unknown";

  return (
    <SidebarProvider>
      <AppSidebar
        username={username}
        avatarUrl=""
        email={email}
        isDarkMode={isDarkMode}
        onToggleTheme={handleThemeToggle}
      />
      <SidebarInset>
        <Toaster position="top-right" reverseOrder={false} />
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <DynamicBreadcrumb />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Routes>
            <Route path="/" element={children} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/leden" element={<LedenPage />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
