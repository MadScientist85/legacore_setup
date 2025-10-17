export interface CompanyConfig {
  id: string
  name: string
  slug: string
  description: string
  domain?: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  features: string[]
}

export const companies: Record<string, CompanyConfig> = {
  "hbu-asset-recovery": {
    id: "hbu-asset-recovery",
    name: "HBU Asset Recovery",
    slug: "hbu",
    description: "Surplus Funds Recovery Services",
    colors: {
      primary: "#1E40AF",
      secondary: "#3B82F6",
      accent: "#60A5FA",
    },
    features: ["surplus-funds", "property-search", "claim-filing", "document-prep"],
  },
  "vivat-legacy": {
    id: "vivat-legacy",
    name: "Vivat Legacy Solutions",
    slug: "vivat",
    description: "Estate Planning and Document Preparation",
    colors: {
      primary: "#059669",
      secondary: "#10B981",
      accent: "#34D399",
    },
    features: ["estate-planning", "will-prep", "trust-setup", "document-notary"],
  },
  "turnaround-financial": {
    id: "turnaround-financial",
    name: "Turnaround Financial Solutions",
    slug: "turnaround",
    description: "Credit Repair and Financial Consulting",
    colors: {
      primary: "#7C3AED",
      secondary: "#8B5CF6",
      accent: "#A78BFA",
    },
    features: ["credit-repair", "debt-analysis", "financial-consulting", "credit-monitoring"],
  },
  "quorentis-financial": {
    id: "quorentis-financial",
    name: "Quorentis Financial Group",
    slug: "quorentis",
    description: "Debt Buying and Portfolio Management",
    colors: {
      primary: "#DC2626",
      secondary: "#EF4444",
      accent: "#F87171",
    },
    features: ["debt-acquisition", "portfolio-management", "collections", "analytics"],
  },
  "aurelian-digital": {
    id: "aurelian-digital",
    name: "Aurelian Digital Enterprises",
    slug: "aurelian",
    description: "Digital Marketing and Affiliate Services",
    colors: {
      primary: "#4B0082",
      secondary: "#6A0DAD",
      accent: "#FFD700",
    },
    features: ["digital-marketing", "seo", "content-creation", "affiliate-management"],
  },
  "lumora-creations": {
    id: "lumora-creations",
    name: "Lumora Creations",
    slug: "lumora",
    description: "Print-on-Demand and E-commerce",
    colors: {
      primary: "#F59E0B",
      secondary: "#FBBF24",
      accent: "#FCD34D",
    },
    features: ["print-on-demand", "merchandise", "e-commerce", "custom-designs"],
  },
}

export function getCompanyById(id: string): CompanyConfig | undefined {
  return companies[id]
}

export function getCompanyBySlug(slug: string): CompanyConfig | undefined {
  return Object.values(companies).find((company) => company.slug === slug)
}

export function getAllCompanies(): CompanyConfig[] {
  return Object.values(companies)
}
