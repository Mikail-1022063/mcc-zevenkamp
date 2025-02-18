import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, HandCoins, UsersRound, Search, Settings } from "lucide-react";

const menuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Betalingen", url: "#", icon: HandCoins },
  { title: "Gebruikers", url: "#", icon: UsersRound },
  { title: "Zoeken", url: "#", icon: Search },
  { title: "Instellingen", url: "#", icon: Settings },
];

export function SidebarMenuItems() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>MCC Ledenadministratie</SidebarGroupLabel>
      <SidebarGroupContent className="">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
