import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forget Password",
    description: ""
};

export default function ForgetPasswordLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
