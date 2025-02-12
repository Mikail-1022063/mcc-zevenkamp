import { useEffect, useState } from "react";
import Header from "./components/Header";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  function handleThemeToggle() {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  }

  return (
    <div className="flex items-start py-4 justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Header
        title="MCC Ledenadministratie"
        username="Mikail Köker"
        avatarUrl=""
        isDarkMode={isDarkMode}
        onToggleTheme={handleThemeToggle}
      />
    </div>
  );
}

export default App;
