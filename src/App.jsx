import { useEffect, useState } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import AccountPage from "./components/AccountPage";
import { Toaster } from "react-hot-toast";
import { translations } from "@aws-amplify/ui-react";
import { I18n } from "aws-amplify/utils";
I18n.putVocabularies(translations);
I18n.setLanguage("nl");

I18n.putVocabularies({
  nl: {
    "Given Name": "Voornaam",
    "Family Name": "Achternaam",
    Birthdate: "Geboortedatum",
    "Enter your Given Name": "Voer je voornaam in",
    "Enter your Family Name": "Voer je achternaam in",
  },
});

const DynamicBreadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { path, label };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <span key={item.path} className="inline-flex items-center gap-3">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.path}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default function App({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userAttributes, setUserAttributes] = useState({});

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.getItem("theme") === "dark",
    );
    setIsDarkMode(localStorage.getItem("theme") === "dark");
  }, []);

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !isDarkMode);
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const loadUserAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setUserAttributes(attributes);
      } catch (error) {
        console.error("Failed to fetch user attributes:", error);
      }
    };
    loadUserAttributes();
  }, []);

  const username =
    `${userAttributes?.given_name ?? ""} ${userAttributes?.family_name ?? ""}`.trim() ||
    "Guest";

  return (
    <Router>
      <Authenticator className="flex flex-col h-screen">
        <SidebarProvider>
          <AppSidebar
            username={username}
            avatarUrl=""
            email={userAttributes?.email || "unknown"}
            isDarkMode={isDarkMode}
            onToggleTheme={handleThemeToggle}
          />
          <SidebarInset>
            <Toaster position="top-right" reverseOrder={false} />
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 cursor-pointer" />
                <DynamicBreadcrumb />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Routes>
                <Route path="/" element={children} />
                <Route path="/account" element={<AccountPage />} />
              </Routes>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </Authenticator>
    </Router>
  );
}
