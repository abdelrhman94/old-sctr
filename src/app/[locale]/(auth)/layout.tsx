import lab from "@/assets/imgs/lab-background.png";
import logo from "@/assets/imgs/saudi-nih-logo.png";
import Image from "next/image";


export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Left side for forms */}
      <div className="flex flex-col justify-between px-8 py-14">
        {children}
        <Image src={logo} alt="Saudi NIH" className="w-44 mt-auto" />
      </div>

      {/* Right image panel */}
      <div className="md:block hidden relative">
        <Image src={lab} alt="Scientist" fill priority className="object-cover " />
      </div>
    </main>
  );
}
