import AppWrapper from "@/components/shared/AppWrapper";
import { routing } from "@/i18n/routing";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: "%s | Saudi NIH",
    default: "Saudi NIH"
  },
  description: "Saudi National Institute for Health Research"
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap"
});

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${poppins.variable}`}>
      <body className="min-h-screen">
        <NextIntlClientProvider>
          <AppWrapper>
            <Toaster position="top-center" />
            {children}
          </AppWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
