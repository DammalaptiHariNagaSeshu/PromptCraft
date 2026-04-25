"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { VariationType } from "@promptcraft/types";

interface ComparisonViewProps {
  variations: { type: VariationType; content: string; tokens: number }[];
  selectedVariations: [string, string];
  onToggleSelect: (type: string) => void;
}

const typeLabels: Record<string, { label: string; icon: string }> = {
  professional: { label: "Professional", icon: "💼" },
  creative: { label: "Creative", icon: "🎨" },
  concise: { label: "Concise", icon: "⚡" },
  technical: { label: "Technical", icon: "🔬" },
};

export function ComparisonView({
  variations,
  selectedVariations,
  onToggleSelect,
}: ComparisonViewProps) {
  const [left, right] = selectedVariations;
  const leftVar = variations.find((v) => v.type === left);
  const rightVar = variations.find((v) => v.type === right);

  const diff = useMemo(() => {
    if (!leftVar || !rightVar) return null;
    return computeSimpleDiff(leftVar.content, rightVar.content);
  }, [leftVar, rightVar]);

  return (
    <div className="space-y-4">
      {/* Selection pills */}
      <div className="flex flex-wrap gap-2">
        {variations.map((v) => {
          const config = typeLabels[v.type];
          const sel = selectedVariations.includes(v.type);
          return (
            <button
              key={v.type}
              onClick={() => onToggleSelect(v.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                sel
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
              }`}
            >
              <span>{config?.icon}</span>
              {config?.label}
            </button>
          );
        })}
      </div>

      {/* Side by side */}
      {leftVar && rightVar ? (
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
              <span>{typeLabels[left]?.icon}</span>
              <span className="text-sm font-semibold text-white">
                {typeLabels[left]?.label}
              </span>
              <span className="text-xs text-white/40 ml-auto font-mono">
                {leftVar.tokens} tokens
              </span>
            </div>
            <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-mono">
              {leftVar.content}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
              <span>{typeLabels[right]?.icon}</span>
              <span className="text-sm font-semibold text-white">
                {typeLabels[right]?.label}
              </span>
              <span className="text-xs text-white/40 ml-auto font-mono">
                {rightVar.tokens} tokens
              </span>
            </div>
            <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-mono">
              {rightVar.content}
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 text-sm text-white/40 glass rounded-xl">
          Select 2 variations above to compare side-by-side
        </div>
      )}

      {/* Diff summary */}
      {diff && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          <h4 className="text-sm font-semibold text-white mb-2">
            Key Differences
          </h4>
          <div className="text-xs text-white/60 space-y-1">
            <p>
              <span className="text-green-400">▸ {typeLabels[left]?.label}:</span>{" "}
              {leftVar!.content.length} chars, {leftVar!.tokens} tokens
            </p>
            <p>
              <span className="text-blue-400">▸ {typeLabels[right]?.label}:</span>{" "}
              {rightVar!.content.length} chars, {rightVar!.tokens} tokens
            </p>
            <p className="text-white/40 mt-2">
              Length difference: {Math.abs(leftVar!.content.length - rightVar!.content.length)} characters
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function computeSimpleDiff(a: string, b: string) {
  // Simple word-level diff for display
  const wordsA = a.split(/\s+/);
  const wordsB = b.split(/\s+/);
  return {
    added: wordsB.filter((w) => !wordsA.includes(w)).length,
    removed: wordsA.filter((w) => !wordsB.includes(w)).length,
    total: Math.max(wordsA.length, wordsB.length),
  };
}
