'use client';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/libs/utils";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function AuthTabsHeader() {
  const locale = useLocale();
  const pathname = usePathname() || '/';
  const currentTab =
    ["/register", "/otp"].some(seg => pathname.includes(seg)) ? "register" : "login";
  return (
    <Tabs value={currentTab} className="w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
      <TabsList className="flex space-x-6 bg-transparent p-0 mb-8 border-none gap-8">
        <TabsTrigger
          value="login"
          className={cn(
            "text-xl cursor-pointer font-normal pb-4 border-b-2 border-transparent transition-all",
            "data-[state=active]:font-bold data-[state=active]:border-green-700"
          )}
        >
          <Link href="/login">Login</Link>
        </TabsTrigger>
        <TabsTrigger
          value="register"
          className={cn(
            "text-xl cursor-pointer font-normal pb-4 border-b-2 border-transparent transition-all",
            "data-[state=active]:font-bold data-[state=active]:border-green-700"
          )}
        >
          <Link href="/register">Registration</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
