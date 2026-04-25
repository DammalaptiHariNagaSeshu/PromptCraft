/**
 * Shared prompt components to ensure consistency across generation and refinement.
 */

export const PROMPT_STRUCTURE_DEFINITION = `
CRITICAL STRUCTURE REQUIREMENTS:
Every prompt variation MUST be segmented into these specific, labeled blocks:
- **[ACT_AS]**: Define a highly specific expert persona.
- **[CONTEXT]**: Detailed background, target audience, and emotional/situational state.
- **[TASK]**: The singular, clear objective to be achieved.
- **[PROCESS]**: Step-by-step cognitive instructions (The "How").
- **[STYLE_VOICE]**: Tone traits, cadence, and specific vocabulary constraints (what to use and what to AVOID).
- **[CONSTRAINTS]**: Hard rules, length limits, formatting requirements, and mandatory elements.
`;

export const PRESERVATION_RULES = `
PRESERVATION RULES:
1. Core Intent: Never drift from the user's original goal.
2. Variables: Always preserve {{variables}} exactly as they appear.
3. Structure: Maintain the [ACT_AS], [CONTEXT], [TASK], [PROCESS], [STYLE_VOICE], [CONSTRAINTS] format.
`;

export const PRIORITY_HIERARCHY = `
PRIORITY HIERARCHY:
1. **Hard Constraints**: Length, format, and variable preservation.
2. **Refinement Instructions**: User-requested changes (e.g., "Make it formal").
3. **Variation Tone**: Maintaining the unique Professional/Creative/Concise/Technical identity.
`;

export const CONFLICT_RESOLUTION = `
CONFLICT RESOLUTION:
- If a user instruction conflicts with a constraint (e.g., "Add more detail" vs "Keep it short"), prioritize the constraint but satisfy the instruction as much as possible within those bounds.
- If instructions are contradictory, prioritize the most recent instruction.
`;

export const EVALUATION_CRITERIA = `
SELF-EVALUATION STEP:
Before outputting, evaluate your prompts against:
1. Clarity: Is the instruction unambiguous?
2. Engineering: Does it use advanced cognitive frameworks?
3. Adherence: Does it strictly follow the user's refinement?
`;

export const EXAMPLE_VARIATIONS = `
### EXAMPLE OF HIGH-QUALITY OUTPUT:
{
  "professional": "**[ACT_AS]**: Strategic B2B Content Architect... **[CONTEXT]**: Enterprise SaaS decision-makers... **[TASK]**: Draft a whitepaper outline... **[PROCESS]**: 1. Identify pain points. 2. Map solutions... **[STYLE_VOICE]**: Authoritative, data-backed... **[CONSTRAINTS]**: Markdown headers, max 800 words.",
  "creative": "**[ACT_AS]**: Narrative World-Builder... **[CONTEXT]**: Readers seeking immersion... **[TASK]**: Craft a lore fragment... **[PROCESS]**: 1. Set the sensory stage. 2. Introduce conflict... **[STYLE_VOICE]**: Poetic, evocative... **[CONSTRAINTS]**: Zero passive voice, exactly 3 paragraphs."
}
`;

export const STYLE_ANCHORS = `
### STYLE ANCHORS:
- **Professional**: "Write like a McKinsey consultant."
- **Creative**: "Write like a Pixar screenwriter."
- **Concise**: "Write like a senior developer's README."
- **Technical**: "Write like a research scientist."
`;
