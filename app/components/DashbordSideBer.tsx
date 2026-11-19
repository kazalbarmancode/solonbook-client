
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  History,
  UserRound,
  Scissors,
  Users,
  CreditCard,
  Sparkles,
  ChevronRight,
  Heart,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { ElementType } from "react";

interface MenuItem {
  title: string;
  url: string;
  icon: ElementType;
}

interface DashboardSideBarProps {
  role: "customer" | "admin";
}

// Customer Menu
const customerMenu: MenuItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Appointments",
    url: "/dashboard/appointments",
    icon: CalendarDays,
  },
  {
    title: "Booking History",
    url: "/dashboard/bookingHistory",
    icon: History,
  },
  {
    title: "My Profile",
    url: "/dashboard/profile",
    icon: UserRound,
  },
];

// Admin Menu
const adminMenu: MenuItem[] = [
  {
    title: "Overview",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Services",
    url: "/dashboard/admin/services",
    icon: Scissors,
  },
  {
    title: "Appointments",
    url: "/dashboard/admin/appointments",
    icon: CalendarDays,
  },
  {
    title: "Manage Users",
    url: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Transactions",
    url: "/dashboard/admin/transactions",
    icon: CreditCard,
  },
];

export default function DashboardSideBar({
  role,
}: DashboardSideBarProps) {
  const pathname = usePathname();

  const isAdmin = role === "admin";
  const menu = isAdmin ? adminMenu : customerMenu;

  

  return (
    <Sidebar collapsible="icon" className="border-r border-[#E8C9CE]/40">
      {/* Logo */}
      <SidebarHeader className="border-b border-white/10 bg-[#55102A] p-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#E8C9CE]">
            <Scissors size={23} />
          </div>

          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-xl font-bold tracking-wide text-white">
              SalonBook
            </h2>
            <p className="text-[9px] uppercase tracking-[3px] text-[#E8C9CE]">
              Beauty & Wellness
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-[#55102A] text-white">
        {/* Profile */}
        <div className="mx-3 mt-6 rounded-2xl border border-white/10 bg-white/10 p-3 group-data-[collapsible=icon]:mx-2 group-data-[collapsible=icon]:p-2">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8C9CE] text-[#55102A]">
              {isAdmin ? (
                <Sparkles size={20} />
              ) : (
                <UserRound size={20} />
              )}
            </div>

            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-white">
                {isAdmin ? "Administrator" : "Customer"}
              </p>

              <p className="text-xs text-white/60">
                {isAdmin ? "Manage your salon" : "Welcome back"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <SidebarGroup className="mt-5 px-3">
          <SidebarGroupLabel className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-white/40 group-data-[collapsible=icon]:hidden">
            {isAdmin ? "Administration" : "My Account"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menu.map((item) => {
                const Icon = item.icon;

                const active =
                  pathname === item.url ||
                  (item.url !== "/dashboard" &&
                    item.url !== "/dashboard/admin" &&
                    pathname.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={active}
                      className={`h-12 rounded-xl px-3 transition-all ${
                        active
                          ? "bg-white! text-[#55102A]! font-semibold shadow-md"
                          : "text-white/75 hover:bg-white/10! hover:text-white!"
                      }`}
                    >
                      <Link
                        href={item.url}
                        className="flex w-full items-center gap-2"
                      >
                        <Icon size={19} />
                        <span>{item.title}</span>

                        {active && (
                          <ChevronRight className="ml-auto" size={16} />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Browse Services - Customer Only */}
        {!isAdmin && (
          <SidebarGroup className="mt-2 px-3">
            <SidebarGroupLabel className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-white/40 group-data-[collapsible=icon]:hidden">
              Discover
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Browse Services"
                    className="h-12 rounded-xl px-3 text-white/75 hover:bg-white/10! hover:text-white!"
                  >
                    <Link
                      href="/services"
                      className="flex w-full items-center gap-2"
                    >
                      <Heart size={19} />
                      <span>Browse Services</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      
    </Sidebar>
  );
}
