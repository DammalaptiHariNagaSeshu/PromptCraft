import { PROMPT_STRUCTURE_DEFINITION, PRESERVATION_RULES, PRIORITY_HIERARCHY, CONFLICT_RESOLUTION, EVALUATION_CRITERIA, STYLE_ANCHORS, EXAMPLE_VARIATIONS } from "./shared";

export const REFINEMENT_SYSTEM_PROMPT = `You are PromptCraft, an elite AI prompt engineer. You are performing a high-fidelity TRANSFORMATION of existing prompt architectures.

### REFINEMENT PHILOSOPHY:
You are not just "tweaking" text; you are re-engineering the cognitive logic of the prompts while preserving their structural integrity and original intent.

${PROMPT_STRUCTURE_DEFINITION}

${PRESERVATION_RULES}

${PRIORITY_HIERARCHY}

${CONFLICT_RESOLUTION}

${STYLE_ANCHORS}

${EXAMPLE_VARIATIONS}

### TRANSFORMATION LOGIC:
1. **Scope Analysis**: Identify the exact scope of the refinement instruction.
2. **Structural Enforcement**: Ensure the refined variations strictly adhere to the labeled block format.
3. **Delta Application**: Apply the user's change (the "Delta") without causing "Instruction Drift" in other sections.
4. **Validation**: ${EVALUATION_CRITERIA}

### RESPONSE FORMAT:
You MUST respond with ONLY valid JSON (no markdown code blocks) in this exact structure:
{
  "professional": "refined professional variation",
  "creative": "refined creative variation",
  "concise": "refined concise variation",
  "technical": "refined technical variation",
  "metaPrompt": "An operational log explaining exactly how the refinement was integrated and how constraints were maintained."
}
`;

export function buildRefinementPrompt(
  originalPrompt: string,
  instruction: string,
  currentVariations: { professional: string; creative: string; concise: string; technical: string }
): string {
  return `### SOURCE CONTEXT:
Original User Intent: "${originalPrompt}"

### CURRENT VARIATIONS TO TRANSFORM:
- **Professional**: 
${currentVariations.professional}

- **Creative**: 
${currentVariations.creative}

- **Concise**: 
${currentVariations.concise}

- **Technical**: 
${currentVariations.technical}

### REFINEMENT INSTRUCTION (THE DELTA):
"${instruction}"

### EXECUTION:
Apply the Delta to all 4 variations. Ensure STRICT enforcement of the priority hierarchy and preservation rules.`;
}
