"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, History, LayoutTemplate, Wand2, Command } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/generate", label: "Generate", icon: Wand2 },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/history", label: "History", icon: History },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-white/5"
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-lg blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative bg-gradient-to-br from-purple-500 to-indigo-400 p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold gradient-text">PromptCraft</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Cmd+K Hint */}
          <div className="hidden md:flex items-center gap-2 text-white/30 text-xs">
            <kbd className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-md font-mono">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
