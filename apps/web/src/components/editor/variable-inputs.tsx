"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Variable, Eye, EyeOff } from "lucide-react";
import { useVariables } from "@/hooks/use-variables";

export function VariableInputs() {
  const { detectedVariables, variables, setVariable, allFilled, resolvedPrompt } =
    useVariables();
  const [showPreview, setShowPreview] = useState(false);

  if (detectedVariables.length === 0) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="glass rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-white/70">
          <Variable className="h-4 w-4 text-purple-400" />
          Variables ({detectedVariables.length})
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          {showPreview ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
          {showPreview ? "Hide" : "Preview"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {detectedVariables.map((varName) => (
          <div key={varName} className="relative">
            <label className="block text-xs text-white/40 mb-1 font-mono">
              {"{{"}
              {varName}
              {"}}"}
            </label>
            <input
              type="text"
              value={variables[varName] || ""}
              onChange={(e) => setVariable(varName, e.target.value)}
              placeholder={`Enter ${varName}...`}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10
                text-sm text-white placeholder:text-white/25 focus:outline-none
                focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
            />
          </div>
        ))}
      </div>

      {!allFilled && (
        <p className="text-xs text-yellow-400/70 flex items-center gap-1">
          ⚠ Fill all variables before generating
        </p>
      )}

      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 text-sm text-white/70 font-mono whitespace-pre-wrap"
        >
          {resolvedPrompt}
        </motion.div>
      )}
    </motion.div>
  );
}
