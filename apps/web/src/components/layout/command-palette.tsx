"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Wand2,
  LayoutTemplate,
  History,
  Home,
  Sparkles,
  Search,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      className="glass-strong shadow-2xl shadow-purple-500/10 rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 border-b border-white/10">
        <Search className="h-4 w-4 text-white/40" />
        <Command.Input placeholder="Type a command or search..." />
      </div>
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Navigation">
          <Command.Item onSelect={() => navigate("/")} className="group">
            <Home className="h-4 w-4 text-purple-400" />
            <span>Home</span>
          </Command.Item>
          <Command.Item onSelect={() => navigate("/generate")} className="group">
            <Wand2 className="h-4 w-4 text-purple-400" />
            <span>Generate Prompts</span>
          </Command.Item>
          <Command.Item onSelect={() => navigate("/templates")} className="group">
            <LayoutTemplate className="h-4 w-4 text-purple-400" />
            <span>Templates</span>
          </Command.Item>
          <Command.Item onSelect={() => navigate("/history")} className="group">
            <History className="h-4 w-4 text-purple-400" />
            <span>History</span>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Quick Actions">
          <Command.Item
            onSelect={() => {
              navigate("/generate");
            }}
            className="group"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>New Generation</span>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
