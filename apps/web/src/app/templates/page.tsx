"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  Code2,
  GraduationCap,
  PenTool,
  BarChart3,
  HeadsetIcon,
  Share2,
  FileText,
  X,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { useGenerationStore } from "@/stores/generation-store";
import type { Template } from "@promptcraft/types";

const templates: Template[] = [
  {
    id: "marketing",
    title: "Marketing Copy",
    description: "Generate compelling marketing copy, ad headlines, and brand messaging.",
    icon: "Megaphone",
    category: "business",
    prompt: "Write compelling marketing copy for {{product}} targeting {{audience}}. Include a powerful headline, emotional hook, three key benefits, and a clear call-to-action.",
    variables: ["product", "audience"],
    color: "from-pink-500 to-rose-400",
  },
  {
    id: "code",
    title: "Code Generation",
    description: "Generate code with proper structure, error handling, and documentation.",
    icon: "Code2",
    category: "development",
    prompt: "Write a {{language}} implementation for {{description}}. Include proper error handling, type annotations, inline documentation, and example usage. Follow best practices and design patterns.",
    variables: ["language", "description"],
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "academic",
    title: "Academic Research",
    description: "Structure research queries with proper academic methodology.",
    icon: "GraduationCap",
    category: "education",
    prompt: "Conduct a comprehensive academic analysis of {{topic}} in the field of {{field}}. Include relevant theoretical frameworks, methodology recommendations, key literature references, and potential research gaps.",
    variables: ["topic", "field"],
    color: "from-green-500 to-emerald-400",
  },
  {
    id: "creative",
    title: "Creative Writing",
    description: "Craft engaging stories, poems, scripts, and creative content.",
    icon: "PenTool",
    category: "creative",
    prompt: "Write a creative {{format}} about {{theme}}. Use vivid sensory imagery, compelling metaphors, dynamic character voice, and an engaging narrative arc that resonates emotionally with the reader.",
    variables: ["format", "theme"],
    color: "from-purple-500 to-violet-400",
  },
  {
    id: "data",
    title: "Data Analysis",
    description: "Create prompts for data analysis, visualization, and insights.",
    icon: "BarChart3",
    category: "analytics",
    prompt: "Analyze {{dataset_description}} data to identify {{analysis_goal}}. Include statistical methods, visualization recommendations, key metrics to track, and actionable insights for stakeholders.",
    variables: ["dataset_description", "analysis_goal"],
    color: "from-orange-500 to-amber-400",
  },
  {
    id: "support",
    title: "Customer Support",
    description: "Generate professional support responses and knowledge articles.",
    icon: "HeadsetIcon",
    category: "support",
    prompt: "Draft a professional customer support response for {{issue_type}}. The customer is experiencing {{problem}}. Include empathetic acknowledgment, step-by-step resolution, and proactive prevention tips.",
    variables: ["issue_type", "problem"],
    color: "from-teal-500 to-cyan-400",
  },
  {
    id: "social",
    title: "Social Media",
    description: "Create engaging social media posts for any platform.",
    icon: "Share2",
    category: "marketing",
    prompt: "Create a {{platform}} post about {{topic}}. Optimize for engagement with appropriate hashtags, emojis, hook in the first line, and a call-to-action. Match the platform's tone and character limits.",
    variables: ["platform", "topic"],
    color: "from-indigo-500 to-blue-400",
  },
  {
    id: "docs",
    title: "Technical Documentation",
    description: "Generate clear, structured technical documentation.",
    icon: "FileText",
    category: "development",
    prompt: "Write technical documentation for {{component}}. Include overview, architecture decisions, API reference with parameters and return types, usage examples, error handling guide, and troubleshooting tips.",
    variables: ["component"],
    color: "from-slate-400 to-zinc-400",
  },
];

const iconMap: Record<string, any> = {
  Megaphone,
  Code2,
  GraduationCap,
  PenTool,
  BarChart3,
  HeadsetIcon,
  Share2,
  FileText,
};

export default function TemplatesPage() {
  const router = useRouter();
  const { setPrompt, setVariables } = useGenerationStore();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setVariableValues({});
  };

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    setPrompt(selectedTemplate.prompt);
    const vars: Record<string, string> = {};
    for (const v of selectedTemplate.variables) {
      vars[v] = variableValues[v] || "";
    }
    setVariables(vars);
    router.push("/generate");
  };

  return (
    <>
      <Navbar />
      <CommandPalette />

      <main className="relative min-h-screen pt-24 pb-16 px-4">
        <div className="orb orb-purple w-[400px] h-[400px] -top-20 right-20 opacity-10" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Prompt <span className="gradient-text">Templates</span>
            </h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Start with a proven template and customize it for your needs.
              Each template includes smart variables you can fill in.
            </p>
          </motion.div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template, i) => {
              const Icon = iconMap[template.icon] || FileText;
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => handleSelectTemplate(template)}
                  className="group glass rounded-xl p-6 cursor-pointer hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${template.color} mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {template.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-3">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((v) => (
                      <span
                        key={v}
                        className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30 font-mono"
                      >
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Variable Input Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedTemplate(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-lg glass-strong rounded-2xl shadow-2xl shadow-purple-500/10 p-6"
            >
              <button
                onClick={() => setSelectedTemplate(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-bold text-white mb-1">
                {selectedTemplate.title}
              </h2>
              <p className="text-sm text-white/50 mb-6">
                Fill in the variables to customize your template.
              </p>

              <div className="space-y-4 mb-6">
                {selectedTemplate.variables.map((v) => (
                  <div key={v}>
                    <label className="block text-sm font-medium text-white/70 mb-1.5 font-mono">
                      {`{{${v}}}`}
                    </label>
                    <input
                      type="text"
                      value={variableValues[v] || ""}
                      onChange={(e) =>
                        setVariableValues((prev) => ({
                          ...prev,
                          [v]: e.target.value,
                        }))
                      }
                      placeholder={`Enter ${v.replace(/_/g, " ")}...`}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                        text-white placeholder:text-white/25 focus:outline-none
                        focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 mb-6">
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                  Preview
                </span>
                <p className="text-sm text-white/70 mt-2 font-mono leading-relaxed">
                  {selectedTemplate.variables.reduce(
                    (text, v) =>
                      text.replaceAll(
                        `{{${v}}}`,
                        variableValues[v] || `{{${v}}}`
                      ),
                    selectedTemplate.prompt
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10
                    text-white/70 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUseTemplate}
                  className="flex-[2] px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-400
                    text-white font-semibold shadow-lg shadow-purple-500/20 glow-button text-sm"
                >
                  Use Template →
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </>
  );
}
