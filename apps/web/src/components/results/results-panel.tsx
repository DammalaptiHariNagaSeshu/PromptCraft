"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useGenerationStore } from "@/stores/generation-store";
import { VariationCard } from "./variation-card";
import { LoadingSkeleton } from "./loading-skeleton";
import { MetaPromptView } from "./meta-prompt-view";
import { ChatInput } from "../refinement/chat-input";
import { ComparisonView } from "../comparison/comparison-view";
import type { VariationType } from "@promptcraft/types";

const tabs: { id: string; label: string }[] = [
  { id: "all", label: "All Variations" },
  { id: "professional", label: "💼 Professional" },
  { id: "creative", label: "🎨 Creative" },
  { id: "concise", label: "⚡ Concise" },
  { id: "technical", label: "🔬 Technical" },
];

export function ResultsPanel() {
  const {
    currentResult,
    isGenerating,
    streamStatus,
    compareMode,
    setCompareMode,
    selectedVariations,
    setSelectedVariations,
  } = useGenerationStore();
  const [activeTab, setActiveTab] = useState("all");

  const handleToggleSelect = useCallback(
    (type: string) => {
      let next: [string, string];
      if (selectedVariations.includes(type)) {
        next = selectedVariations.map((v: string) => (v === type ? "" : v)) as [string, string];
      } else if (!selectedVariations[0]) {
        next = [type, selectedVariations[1]] as [string, string];
      } else if (!selectedVariations[1]) {
        next = [selectedVariations[0], type] as [string, string];
      } else {
        next = [type, selectedVariations[1]] as [string, string];
      }
      setSelectedVariations(next);
    },
    [selectedVariations, setSelectedVariations]
  );

  const variations: { type: VariationType; content: string; tokens: number }[] =
    currentResult
      ? [
          {
            type: "professional",
            content: currentResult.professional,
            tokens: currentResult.tokenEstimates?.professional || 0,
          },
          {
            type: "creative",
            content: currentResult.creative,
            tokens: currentResult.tokenEstimates?.creative || 0,
          },
          {
            type: "concise",
            content: currentResult.concise,
            tokens: currentResult.tokenEstimates?.concise || 0,
          },
          {
            type: "technical",
            content: currentResult.technical,
            tokens: currentResult.tokenEstimates?.technical || 0,
          },
        ]
      : [];

  const filteredVariations =
    activeTab === "all"
      ? variations
      : variations.filter((v) => v.type === activeTab);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Results</h2>
        <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
          <input
            type="checkbox"
            checked={compareMode}
            onChange={(e) => setCompareMode(e.target.checked)}
            className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/20"
          />
          Compare Mode
        </label>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-white"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="results-tab"
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-400/20 rounded-md border border-purple-500/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Stream Status */}
      {isGenerating && streamStatus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20"
        >
          <div className="w-3 h-3 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-sm text-purple-300">{streamStatus}</span>
        </motion.div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {isGenerating && !currentResult ? (
          <LoadingSkeleton />
        ) : compareMode && currentResult ? (
          <ComparisonView
            variations={variations}
            selectedVariations={selectedVariations}
            onToggleSelect={handleToggleSelect}
          />
        ) : currentResult ? (
          <>
            {filteredVariations.map((v, i) => (
              <VariationCard
                key={v.type}
                type={v.type}
                content={v.content}
                tokenCount={v.tokens}
                index={i}
                compareMode={compareMode}
                isSelected={selectedVariations.includes(v.type)}
                onToggleSelect={() => handleToggleSelect(v.type)}
              />
            ))}
            {activeTab === "all" && currentResult.metaPrompt && (
              <MetaPromptView content={currentResult.metaPrompt} />
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Refinement Chat */}
      {currentResult && <ChatInput />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-400/20 border border-white/10 flex items-center justify-center">
          <span className="text-4xl">✨</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white/80 mb-2">
        Ready to Generate
      </h3>
      <p className="text-sm text-white/40 max-w-xs">
        Write your prompt description in the editor and click Generate to create
        4 optimized variations.
      </p>
    </div>
  );
}
