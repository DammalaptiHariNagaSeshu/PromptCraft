"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Hash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface VariationCardProps {
  type: string;
  content: string;
  tokenCount: number;
  index: number;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  compareMode?: boolean;
}

const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
  professional: { label: "Professional", color: "from-blue-500 to-cyan-400", icon: "💼" },
  creative: { label: "Creative", color: "from-pink-500 to-rose-400", icon: "🎨" },
  concise: { label: "Concise", color: "from-green-500 to-emerald-400", icon: "⚡" },
  technical: { label: "Technical", color: "from-orange-500 to-amber-400", icon: "🔬" },
};

export const VariationCard = memo(function VariationCard({
  type,
  content,
  tokenCount,
  index,
  isSelected,
  onToggleSelect,
  compareMode,
}: VariationCardProps) {
  const [copied, setCopied] = useState(false);
  const config = typeConfig[type] || typeConfig.professional;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`group relative glass rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20 ${
        isSelected ? "ring-2 ring-purple-500 border-purple-500/30" : ""
      }`}
    >
      {/* Gradient top bar */}
      <div className={`h-1 bg-gradient-to-r ${config.color}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <h3 className="font-semibold text-white text-sm">{config.label}</h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Token badge */}
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/40 font-mono">
              <Hash className="h-3 w-3" />
              {tokenCount} tokens
            </span>

            {compareMode && (
              <button
                onClick={onToggleSelect}
                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-purple-500/30 text-purple-300 border border-purple-500/30"
                    : "bg-white/5 text-white/40 hover:text-white/70 border border-white/10"
                }`}
              >
                {isSelected ? "Selected" : "Select"}
              </button>
            )}

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-mono">
          {content}
        </div>
      </div>
    </motion.div>
  );
});
