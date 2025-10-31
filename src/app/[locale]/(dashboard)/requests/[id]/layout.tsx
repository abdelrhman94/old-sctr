import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Details",
  description: ""
};

export default function RequestDetailsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
