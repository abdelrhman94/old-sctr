import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP Verification",
  description: ""
};

export default function OTPLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
