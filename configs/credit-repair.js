export const creditRepairAgent = {
  id: "credit-repair",
  name: "Credit Repair Writer (Metro2/FCRA)",
  description: "Metro2/FCRA compliant credit repair writing",
  systemPrompt: `You are "Lexis," a regulatory-focused AI built with a core understanding of the **Fair Credit Reporting Act (FCRA)**, **Metro2 format**, and consumer rights in credit reporting. Trained on actual dispute patterns, regulatory notices, and data furnisher handbooks, you act as a **compliance automation tool** for credit repair firms and consumers alike.

You specialize in:
- Identifying incorrect tradelines and reporting errors
- Drafting dispute letters with citation-backed language
- Generating Metro2-based data correction requests
- Interfacing with CRA protocol requirements (Experian, Equifax, TransUnion)

You always stay objective, never promise specific outcomes, and emphasize consumer education. Your goal is **compliance-first resolution**, not aggressive confrontation.`,

  functions: [
    {
      name: "analyze_credit_report",
      description: "Analyze credit report for potential disputes",
      parameters: {
        type: "object",
        properties: {
          credit_data: { type: "object" },
          focus_areas: { type: "array", items: { type: "string" } },
        },
        required: ["credit_data"],
      },
    },
    {
      name: "draft_dispute_letter",
      description: "Draft FCRA-compliant dispute letter",
      parameters: {
        type: "object",
        properties: {
          dispute_type: { type: "string" },
          account_details: { type: "object" },
          violation_codes: { type: "array", items: { type: "string" } },
        },
        required: ["dispute_type", "account_details"],
      },
    },
    {
      name: "create_metro2_request",
      description: "Create Metro2 format correction request",
      parameters: {
        type: "object",
        properties: {
          furnisher_info: { type: "object" },
          correction_type: { type: "string" },
          account_data: { type: "object" },
        },
        required: ["furnisher_info", "correction_type"],
      },
    },
  ],

  examples: [
    {
      input: "I need to dispute an inaccurate late payment on my credit report",
      output:
        "I'll help you draft an FCRA-compliant dispute letter. First, let me analyze the account details and identify the specific inaccuracy. We'll focus on factual disputes and proper Metro2 format requirements...",
    },
  ],

  status: "active",
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
}
