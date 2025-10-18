<script setup lang="ts">
import {
  Landmark as Home,
  Wallet as Accounts,
  CreditCard,
  UserPen as Profile,
  Settings,
  LogOut,
  ReceiptText,
  Bell,
} from "lucide-vue-next";
import ProfilePhoto from "@/components/ProfilePhoto.vue";
import SidebarLink from "@/components/SidebarLink.vue";
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
const links = [
  { to: "home", icon: Home, label: "Home" },
  { to: "banking-accounts", icon: Accounts, label: "Accounts" },
  { to: "banking-cards", icon: CreditCard, label: "Cards" },
  {
    to: "banking-transactions",
    icon: ReceiptText,
    label: "Pending Transactions",
  },
  { to: "profile", icon: Profile, label: "Profile" },
  { to: "settings", icon: Settings, label: "Settings" },
  { to: "logout", icon: LogOut, label: "Logout" },
];

function handleMouseEnter() {
  setOpen(true);
}
function handleMouseLeave() {
  setOpen(false);
}

import { useSidebar } from "@/components/ui/sidebar";

const { setOpen } = useSidebar();
</script>

<template>
  <Sidebar
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    collapsible="icon"
  >
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in links" :key="item.label">
              <SidebarMenuButton asChild>
                <SidebarLink
                  :to="item.to"
                  :icon="item.icon"
                  :label="item.label"
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <Bell />
      <!-- <CustomAvatar>
        <ProfilePhoto class="rounded w-full h-8 bg-gray-300" />
      </CustomAvatar> -->
    </SidebarFooter>
  </Sidebar>
</template>
