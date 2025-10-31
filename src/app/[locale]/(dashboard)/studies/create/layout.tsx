import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Study",
    description: ""
};

export default function CreateStudyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
