<script setup lang="ts">
import { useSidebar } from "@/components/ui/sidebar";
import {
  Landmark as Home,
  Wallet as Accounts,
  CreditCard,
  UserPen as Profile,
  Settings,
  ReceiptText,
  Bell,
} from "lucide-vue-next";
import SidebarLink from "@/components/sidebar/SidebarLink.vue";
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
import { useCustomerStore } from "@/stores/customer";
import CustomSidebarFooter from "@/components/sidebar/CustomSidebarFooter.vue";
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
  { to: "notifications", icon: Bell, label: "Notifications" },
  { to: "settings", icon: Settings, label: "Settings" },
];

const { setOpen } = useSidebar();
</script>
<template>
  <Sidebar
    @mouseenter="setOpen(true)"
    @mouseleave="setOpen(false)"
    collapsible="icon"
  >
    <SidebarContent>
      <SidebarGroup>
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
      <CustomSidebarFooter
        :user="{
          name: useCustomerStore().customer.firstName,
          email: useCustomerStore().customer.email,
          avatar: useCustomerStore().customer.photoUrl,
        }"
      />
    </SidebarFooter>
  </Sidebar>
</template>
