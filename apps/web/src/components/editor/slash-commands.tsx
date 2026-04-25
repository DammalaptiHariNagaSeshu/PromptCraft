"use client";

import { motion } from "framer-motion";
import {
  Megaphone,
  Code2,
  GraduationCap,
  PenTool,
} from "lucide-react";

const slashTemplates = [
  {
    name: "Marketing Copy",
    icon: Megaphone,
    template:
      "Write compelling marketing copy for {{product}} targeting {{audience}}. Include a headline, subheadline, and three key benefits.",
  },
  {
    name: "Code Generation",
    icon: Code2,
    template:
      "Write a {{language}} function that {{description}}. Include error handling, type annotations, and example usage.",
  },
  {
    name: "Academic Research",
    icon: GraduationCap,
    template:
      "Analyze {{topic}} from an academic perspective. Include relevant theories, methodologies, and cite potential sources.",
  },
  {
    name: "Creative Writing",
    icon: PenTool,
    template:
      "Write a creative {{format}} about {{theme}}. Use vivid imagery, metaphors, and engaging narrative structure.",
  },
];

interface SlashCommandsProps {
  onSelect: (template: string) => void;
  onClose: () => void;
}

export function SlashCommands({ onSelect, onClose }: SlashCommandsProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        className="absolute left-4 bottom-4 z-50 w-80 glass-strong rounded-xl shadow-2xl shadow-purple-500/10 overflow-hidden"
      >
        <div className="px-3 py-2 border-b border-white/10">
          <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
            Quick Templates
          </span>
        </div>
        <div className="p-1">
          {slashTemplates.map((item) => (
            <button
              key={item.name}
              onClick={() => onSelect(item.template)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                text-white/70 hover:text-white hover:bg-purple-500/20 transition-colors text-left"
            >
              <div className="p-1.5 rounded-md bg-purple-500/10">
                <item.icon className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-white/90">{item.name}</div>
                <div className="text-xs text-white/40 line-clamp-1">
                  {item.template.slice(0, 50)}...
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}
