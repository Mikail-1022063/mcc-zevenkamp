import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronsUpDown,
  LogOut,
  BadgeCheck,
  CreditCard,
  Bell,
} from "lucide-react";

export function SidebarUserMenu({ username, avatarUrl, email }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="cursor-pointer">
              <Avatar className="h-8 w-8 rounded-lg">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={username} />
                ) : (
                  <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm">
                <span className="font-semibold">{username}</span>
                <span className="text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2 text-sm">
                <Avatar className="h-8 w-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={username} />
                  ) : (
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="text-left grid">
                  <span className="font-semibold">{username}</span>
                  <span className="text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck /> Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard /> Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell /> Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
