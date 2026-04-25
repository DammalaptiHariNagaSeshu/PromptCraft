"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useRefine } from "@/hooks/use-refine";
import { useGenerationStore } from "@/stores/generation-store";

const quickActions = [
  "Make it more formal",
  "Add emoji",
  "Shorten by 50%",
  "More conversational",
  "Add examples",
  "Make it simpler",
];

export function ChatInput() {
  const [instruction, setInstruction] = useState("");
  const { refine } = useRefine();
  const { isRefining } = useGenerationStore();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!instruction.trim() || isRefining) return;
      refine(instruction.trim());
      setInstruction("");
    },
    [instruction, isRefining, refine]
  );

  const handleQuickAction = useCallback(
    (action: string) => {
      if (isRefining) return;
      refine(action);
    },
    [isRefining, refine]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 space-y-3"
    >
      {/* Quick action chips */}
      <div className="flex flex-wrap gap-1.5">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => handleQuickAction(action)}
            disabled={isRefining}
            className="px-2.5 py-1 rounded-full text-xs text-white/50 bg-white/5 border border-white/10
              hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-500/20
              transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Refine: &quot;Make it more formal&quot; or &quot;Add bullet points&quot;..."
          disabled={isRefining}
          className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10
            text-sm text-white placeholder:text-white/30 focus:outline-none
            focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20
            disabled:opacity-50 transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!instruction.trim() || isRefining}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-400
            text-white text-sm font-medium shadow-lg shadow-purple-500/20
            disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isRefining ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
