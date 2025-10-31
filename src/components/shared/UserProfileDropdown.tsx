'use client'
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/libs/utils";
import { useLogoutUserMutation } from "@/store/api/authApi";
import { logout } from "@/store/slices/authSlice";
import Cookies from 'js-cookie';
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";


export type UserBadgeWithLocaleProps = {
  firstName?: string;
  familyName?: string;
  role?: string | string[];
  locale: string;
  locales?: { code: string; label?: string }[];
  className?: string;
};

export default function UserBadgeWithLocale({
  firstName,
  familyName,
  role,
  locale,
  locales = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ],


  className,
}: UserBadgeWithLocaleProps) {
  const dispatch = useDispatch();
  const t = useTranslations("Shared")
  const router = useRouter();
  const pathname = usePathname();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();


  const handleLogout = async () => {
    try {
      await logoutUser(undefined).unwrap();
      dispatch(logout());
      router.push("/login");
      Cookies.set('NEXT_LOCALE', "en", { expires: 365 });
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }

  };

  const roleLabel = Array.isArray(role)
    ? (role[0] ?? "")
    : (role ?? "");

  function getInitials(first?: string, family?: string) {
    const f = first?.charAt(0)?.toUpperCase() ?? "";
    const l = family?.charAt(0)?.toUpperCase() ?? "";
    return f + l;
  }

  const searchParams = useSearchParams();
  const onLocaleChange = (code: string) => {
    const qs = searchParams.toString();
    Cookies.set('NEXT_LOCALE', locale, { expires: 365 });
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { locale: code });
  };


  return (
    <div className={cn("w-full flex justify-end items-center  gap-4", className)}>
      {/* User pill */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "group inline-flex items-center gap-3 rounded-full bg-[#F8F8F8] p-2 pe-3 shadow-sm cursor-pointer",
              "hover:shadow transition-shadow"
            )}
          >
            <span className="relative inline-grid place-items-center size-10 rounded-full bg-black/5">
              <Avatar className="size-10">
                <AvatarFallback className="bg-transparent text-xs font-medium">
                  {getInitials(firstName, familyName)}
                </AvatarFallback>
              </Avatar>
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-semibold text-black">{firstName} {familyName} </span>
              {roleLabel ? (
                <span className="block text-xs text-[#8F8F8F]">{roleLabel}</span>
              ) : null}
            </span>
            <ChevronDown className="ms-1 size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={locale === "en" ? "start" : "end"} className={cn(
          "w-56 me-4",
          locale === "en" ? "text-left" : "text-right"
        )}>
          <DropdownMenuLabel className="font-medium">{t("sign_in_as")}</DropdownMenuLabel>
          <div className="px-2 pb-2 text-sm text-muted-foreground truncate">{firstName} {familyName} </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled >{t("profile")}</DropdownMenuItem>
          <DropdownMenuItem disabled>{t("settings")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 focus:text-red-700 " disabled={isLoading} onClick={handleLogout} >
            {isLoading ? t("loading") : t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Locale pill */}
      <DropdownMenu >
        <DropdownMenuTrigger asChild >
          <button
            type="button"
            className={cn(
              "hidden  items-center  gap-2 rounded-full border border-black/5 bg-[#F8F8F8] px-4 py-4 text-sm font-semibold shadow-sm cursor-pointer",
              "hover:shadow transition-shadow"
            )}
            aria-label="Change language"
          >
            <span className="inline-flex items-center gap-1">
              {locale.toUpperCase()}
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={locale === "en" ? "end" : "start"} className="w-44">
          <DropdownMenuLabel className={cn(

            locale === "en" ? "text-left" : "text-right"
          )}>{t("language")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {locales.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onClick={() => onLocaleChange?.(l.code)}
              className={cn(l.code.toUpperCase() === locale.toUpperCase() && "font-semibold", "")}
            >

              {l.label ?? l.code.toUpperCase()}

            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

