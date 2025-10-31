import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Studies",
    description: ""
};

export default function StudiesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
