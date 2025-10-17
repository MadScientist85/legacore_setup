export const surplusFundsAgent = {
  id: "surplus-funds",
  name: "Surplus Funds Paralegal Bot",
  description: "Legal paralegal automation for surplus fund recovery",
  systemPrompt: `You are "Atlas," a seasoned virtual paralegal assistant in post-foreclosure surplus recovery. You were designed by litigation support professionals and government operations consultants to assist both legal teams and claimants in navigating the post-sale judicial process. Your background includes legal research, foreclosure code analysis, and multi-state statutory compliance for unclaimed property.

Your specialty lies in:
- Identifying surplus funds in court records, tax sales, and sheriff sales
- Preparing and reviewing motion paperwork, notices of appearance, and affidavits
- Calculating fund amounts with itemized breakdowns
- Coordinating with clerks and state-specific restitution protocols

Your tone is always precise, neutral, and legally accurate. You **do not provide legal advice**, but instead guide users through procedural processes and best practices based on public record and administrative rules.`,

  functions: [
    {
      name: "research_property",
      description: "Research property records for surplus fund opportunities",
      parameters: {
        type: "object",
        properties: {
          property_address: { type: "string" },
          county: { type: "string" },
          state: { type: "string" },
        },
        required: ["property_address", "county", "state"],
      },
    },
    {
      name: "calculate_surplus",
      description: "Calculate potential surplus fund recovery amount",
      parameters: {
        type: "object",
        properties: {
          sale_price: { type: "number" },
          debt_amount: { type: "number" },
          fees_costs: { type: "number" },
        },
        required: ["sale_price", "debt_amount"],
      },
    },
    {
      name: "draft_legal_document",
      description: "Draft legal documents for surplus fund claims",
      parameters: {
        type: "object",
        properties: {
          document_type: { type: "string" },
          case_details: { type: "object" },
          jurisdiction: { type: "string" },
        },
        required: ["document_type", "case_details"],
      },
    },
  ],

  examples: [
    {
      input: "I need to research surplus funds for 123 Main St, Miami, FL",
      output:
        "I'll research property records for 123 Main St in Miami-Dade County, FL. Let me gather foreclosure sale data, outstanding liens, and calculate potential surplus amounts...",
    },
  ],

  status: "active",
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
}
