"use client";

import dynamic from "next/dynamic";
import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Sparkles, AlertCircle } from "lucide-react";
import { useGenerationStore } from "@/stores/generation-store";
import { useGenerate } from "@/hooks/use-generate";
import { useEnhance } from "@/hooks/use-enhance";
import { useVariables } from "@/hooks/use-variables";
import { VariableInputs } from "./variable-inputs";
import { SlashCommands } from "./slash-commands";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-xl glass flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/40">
        <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        Loading editor...
      </div>
    </div>
  ),
});

export function PromptEditor() {
  const { prompt, setPrompt, temperature, setTemperature, isGenerating } =
    useGenerationStore();
  const { generate, abort } = useGenerate();
  const { enhance } = useEnhance();
  const { detectedVariables } = useVariables();
  const editorRef = useRef<any>(null);
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });

  const charCount = prompt.length;
  const isWarning = charCount > 800;
  const isOver = charCount > 1000;

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const newValue = value || "";
      setPrompt(newValue);

      // Detect slash command
      if (newValue.endsWith("/")) {
        setShowSlashCommands(true);
      } else {
        setShowSlashCommands(false);
      }
    },
    [setPrompt]
  );

  const handleSlashSelect = useCallback(
    (template: string) => {
      // Remove the trailing slash and append the template
      const newPrompt = prompt.endsWith("/")
        ? prompt.slice(0, -1) + template
        : prompt + template;
      setPrompt(newPrompt);
      setShowSlashCommands(false);
    },
    [prompt, setPrompt]
  );

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    // Custom theme registration would go here
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Prompt Input
        </h2>
        <div className="flex items-center gap-3">
          {/* Character counter */}
          <span
            className={`text-xs font-mono transition-colors ${
              isOver
                ? "text-red-400"
                : isWarning
                  ? "text-yellow-400"
                  : "text-white/40"
            }`}
          >
            {isOver && <AlertCircle className="inline h-3 w-3 mr-1" />}
            {charCount}/1000
          </span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="relative flex-1 min-h-[300px] rounded-xl overflow-hidden border border-white/10 bg-slate-900/50">
        <MonacoEditor
          height="100%"
          defaultLanguage="markdown"
          value={prompt}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            wordWrap: "on",
            lineNumbers: "off",
            renderLineHighlight: "none",
            scrollBeyondLastLine: false,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            padding: { top: 16, bottom: 16 },
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            placeholder: "Describe what you want the AI to do...\n\nTip: Use {{variable_name}} for dynamic parts\nTip: Type / for quick templates",
          }}
        />

        {/* Slash Commands Dropdown */}
        {showSlashCommands && (
          <SlashCommands
            onSelect={handleSlashSelect}
            onClose={() => setShowSlashCommands(false)}
          />
        )}
      </div>

      {/* Variable Inputs */}
      {detectedVariables.length > 0 && <VariableInputs />}

      {/* Temperature Slider */}
      <div className="glass p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-white/70">
            Temperature
          </label>
          <span className="text-sm font-mono text-purple-400">
            {temperature.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r
            [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-indigo-400
            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/30
            [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
        />
        <div className="flex justify-between mt-1 text-xs text-white/30">
          <span>Precise</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={enhance}
          disabled={isGenerating || !prompt.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
            bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white
            transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
        >
          <Wand2 className="h-4 w-4" />
          Enhance Input
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isGenerating ? abort : generate}
          disabled={!prompt.trim() || isOver}
          className={`flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-xl
            font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm
            ${
              isGenerating
                ? "bg-red-500/20 border border-red-500/30 hover:bg-red-500/30"
                : "bg-gradient-to-r from-purple-500 to-indigo-400 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 glow-button"
            }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Stop
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Variations
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
