"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Upload, BarChart2, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const appNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/progress", label: "Progress", icon: BarChart2 },
];

interface NavbarProps {
  variant?: "landing" | "app";
}

export function Navbar({ variant = "landing" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "border-b border-white/5 bg-bg/80 backdrop-blur-xl"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={variant === "app" ? "/dashboard" : "/"}>
          <Logo />
        </Link>

        {variant === "landing" ? (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop app nav */}
            <div className="hidden items-center gap-1 md:flex">
              {appNavLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-primary/15 text-primary-light"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  document.cookie = "speakup_token=; Max-Age=0; path=/";
                  window.location.href = "/";
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-200 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        )}
      </nav>

      {/* Mobile app menu */}
      {variant === "app" && mobileOpen && (
        <div className="border-t border-white/5 bg-surface px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {appNavLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-primary/15 text-primary-light"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <button
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200"
              onClick={() => {
                document.cookie = "speakup_token=; Max-Age=0; path=/";
                window.location.href = "/";
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
