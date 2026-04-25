"use client";

import { Navbar } from "@/components/layout/navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { PromptEditor } from "@/components/editor/prompt-editor";
import { ResultsPanel } from "@/components/results/results-panel";

export default function GeneratePage() {
  return (
    <>
      <Navbar />
      <CommandPalette />

      <main className="relative min-h-screen pt-20">
        {/* Background effects */}
        <div className="orb orb-purple w-[400px] h-[400px] -top-20 -right-20 opacity-10" />
        <div className="orb orb-indigo w-[300px] h-[300px] bottom-0 -left-10 opacity-10" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Split screen layout */}
          <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
            {/* Left Panel: Editor */}
            <div className="w-full lg:w-[42%] lg:min-w-[400px] flex flex-col">
              <PromptEditor />
            </div>

            {/* Divider */}
            <div className="hidden lg:flex items-stretch">
              <div className="w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </div>

            {/* Right Panel: Results */}
            <div className="w-full lg:flex-1 flex flex-col">
              <ResultsPanel />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
