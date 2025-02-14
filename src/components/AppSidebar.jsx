import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarMenuItems } from "./sidebar/SidebarMenuItems";
import { SidebarUserMenu } from "./sidebar/SidebarUserMenu";
import { SidebarDarkMode } from "./sidebar/SidebarDarkMode";

export function AppSidebar({
  username,
  avatarUrl,
  email,
  isDarkMode,
  onToggleTheme,
}) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenuItems />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserMenu
          username={username}
          avatarUrl={avatarUrl}
          email={email}
        />
        <SidebarDarkMode
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
