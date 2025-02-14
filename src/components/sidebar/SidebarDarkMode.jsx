import { Switch } from "@/components/ui/switch";
import { SunMoon } from "lucide-react";

export function SidebarDarkMode({ isDarkMode, onToggleTheme }) {
  return (
    <div className="px-3 pb-3 flex items-center gap-2">
      <SunMoon className="w-5 h-5" />
      <span className="text-sm">Dark Mode</span>
      <Switch checked={isDarkMode} onCheckedChange={onToggleTheme} />
    </div>
  );
}
