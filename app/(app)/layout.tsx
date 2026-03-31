import { Navbar } from "@/components/shared/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("speakup_token");
  if (!token) redirect("/login");

  return (
    <div className="min-h-screen bg-bg">
      <Navbar variant="app" />
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
