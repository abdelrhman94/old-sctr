import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Activate Account",
    description: ""
};

export default function ActivateLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
