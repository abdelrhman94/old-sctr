'use client'
import logo from "@/assets/imgs/saudi-nih-logo.png"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserRole } from "@/enums/enums"
import { useRoleAuth } from "@/hooks/useAuthorization"
import { Link, usePathname } from "@/i18n/navigation"
import { Home, MessageCircle, Settings, Users } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"

const LOCALES = ["ar", "en"] as const;

// Normalize path: strip locale prefix and trailing slash
function normalizePath(path: string) {
  let p = path.split("?")[0].split("#")[0];         // remove query/hash if any
  // strip trailing slash (but keep root "/")
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  // strip locale prefix "/ar" or "/en"
  const parts = p.split("/");
  if (parts[1] && LOCALES.includes(parts[1] as any)) {
    p = "/" + parts.slice(2).join("/");
    if (p === "") p = "/"; // if it was just "/ar"
  }
  return p;
}

// Active if current path equals base OR starts with "base/"
function isPathActive(current: string, base: string, match: "prefix" | "exact" = "prefix") {
  const cur = normalizePath(current);
  const b = normalizePath(base);
  if (match === "exact") return cur === b;
  return cur === b || cur.startsWith(b + "/");
}


type MenuItem = {
  title: string;
  url: string;
  icon: any;
  roles: UserRole[];
  match?: "prefix" | "exact"; // defaults to 'prefix'
};

export default function AppSidebar() {
  const t = useTranslations("Shared");
  const pathname = usePathname()
  const locale = useLocale();
  const isRTL = locale?.toLowerCase() === 'ar';
  const { hasRole } = useRoleAuth()
  const menuItems: MenuItem[] = [
    {
      title: t("dashboard"),
      url: "/dashboard",
      icon: Home,
      roles: []
      , match: "prefix"
    },
    {
      title: t("studies"),
      url: "/studies",
      icon: MessageCircle,
      roles: []
    },
    {
      title: t("requests"),
      url: "/requests",
      icon: Settings,
      roles: [UserRole.REVIEWER, UserRole.ORGANIZATION_ADMIN, UserRole.DIRECTOR_MANAGER, UserRole.SUB_USER]
    },
    {
      title: t("users"),
      url: "/users",
      icon: Users,
      roles: [UserRole.REVIEWER, UserRole.ORGANIZATION_ADMIN, UserRole.DIRECTOR_MANAGER, UserRole.SUB_USER]
    },
    {
      title: t("settings"),
      url: "/settings",
      icon: Settings,
      roles: [UserRole.REVIEWER, UserRole.ORGANIZATION_ADMIN, UserRole.DIRECTOR_MANAGER, UserRole.SUB_USER]
    },
  ]

  const authorizedItems = menuItems.filter(item => {
    if (item.roles?.length === 0) return true
    return item.roles?.some(role => hasRole(role))
  })



  return (
    <Sidebar collapsible="icon" className="mx-2" side={isRTL ? 'right' : 'left'}>
      <SidebarHeader className="p-5 flex-row items-center justify-center gap-4">
        <Link href="/">
          <Image src={logo} alt="Saudi NIH" className="w-40 group-data-[collapsible=icon]:hidden" />
        </Link>
        <SidebarTrigger className="-ml-1" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {authorizedItems.map((item) => {
                const active = isPathActive(pathname, item.url, item.match ?? "prefix");

                return (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} >
                      <SidebarMenuButton asChild tooltip={item.title}
                        isActive={active}
                        className={`
                        h-12 px-4 rounded-full transition-all duration-200
                        ${active
                            ? "!bg-primary !text-white hover:!bg-green-700"
                            : "!text-[#A5A5A5] hover:!bg-gray-100 hover:!text-gray-700"
                          }
                      `}>
                        <span>
                          <item.icon />
                          <span>{item.title}</span>
                        </span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
