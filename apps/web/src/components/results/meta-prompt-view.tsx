"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";

interface MetaPromptViewProps {
  content: string;
}

export function MetaPromptView({ content }: MetaPromptViewProps) {
  const [expanded, setExpanded] = useState(false);

  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10">
            <Brain className="h-4 w-4 text-purple-400" />
          </div>
          <span className="text-sm font-semibold text-white">
            Meta-Prompt Analysis
          </span>
          <span className="text-xs text-white/40">
            — Why these prompts work
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-white/40" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/40" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/5">
              <div className="mt-4 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
