import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SunMoon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Header = ({ title, username, avatarUrl, isDarkMode, onToggleTheme }) => {
  return (
    <Card className="container py-3 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-between gap-6 rounded-2xl shadow-lg transition-colors">
      <p className="text-xl font-medium">{title}</p>

      <div className="flex items-center gap-3">
        {/* Username */}
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {username}
        </span>

        {/* Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={`${username}'s Avatar`} />
              ) : (
                <AvatarFallback>
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-gray-800"
          >
            <DropdownMenuItem onClick={() => alert("Profile Clicked")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert("Settings Clicked")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert("Logout Clicked")}>
              Logout
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* Dark Mode Toggle */}
            <DropdownMenuItem className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <SunMoon className="w-4 h-4" />
                Dark Mode
              </span>
              <Switch checked={isDarkMode} onCheckedChange={onToggleTheme} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default Header;
