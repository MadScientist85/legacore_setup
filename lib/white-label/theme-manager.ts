import { supabase } from "@/lib/supabase/client"

export interface ThemeConfig {
  id: string
  company_id: string
  primary_color: string
  secondary_color: string
  accent_color: string
  logo_url?: string
  favicon_url?: string
  font_family: string
  custom_css?: string
  created_at: string
  updated_at: string
}

export interface CompanyBranding {
  id: string
  name: string
  slug: string
  domain?: string
  theme: ThemeConfig
  features: string[]
}

export class ThemeManager {
  private client = supabase

  async getThemeByCompanyId(companyId: string): Promise<ThemeConfig | null> {
    const { data, error } = await this.client.from("company_themes").select("*").eq("company_id", companyId).single()

    if (error) {
      console.error("Error fetching theme:", error)
      return null
    }

    return data
  }

  async getThemeByDomain(domain: string): Promise<ThemeConfig | null> {
    const { data: company, error: companyError } = await this.client
      .from("companies")
      .select("id")
      .eq("domain", domain)
      .single()

    if (companyError || !company) {
      return null
    }

    return this.getThemeByCompanyId(company.id)
  }

  async updateTheme(companyId: string, theme: Partial<ThemeConfig>): Promise<ThemeConfig | null> {
    const { data, error } = await this.client
      .from("company_themes")
      .update({
        ...theme,
        updated_at: new Date().toISOString(),
      })
      .eq("company_id", companyId)
      .select()
      .single()

    if (error) {
      console.error("Error updating theme:", error)
      return null
    }

    return data
  }

  async createTheme(theme: Omit<ThemeConfig, "id" | "created_at" | "updated_at">): Promise<ThemeConfig | null> {
    const { data, error } = await this.client
      .from("company_themes")
      .insert({
        ...theme,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating theme:", error)
      return null
    }

    return data
  }

  generateCSSVariables(theme: ThemeConfig): string {
    return `
      :root {
        --primary: ${theme.primary_color};
        --secondary: ${theme.secondary_color};
        --accent: ${theme.accent_color};
        --font-family: ${theme.font_family};
      }
      ${theme.custom_css || ""}
    `
  }

  async applyTheme(companyId: string): Promise<void> {
    const theme = await this.getThemeByCompanyId(companyId)
    if (!theme) return

    const css = this.generateCSSVariables(theme)
    const style = document.createElement("style")
    style.textContent = css
    document.head.appendChild(style)

    if (theme.favicon_url) {
      const link = (document.querySelector("link[rel*='icon']") as HTMLLinkElement) || document.createElement("link")
      link.type = "image/x-icon"
      link.rel = "shortcut icon"
      link.href = theme.favicon_url
      document.getElementsByTagName("head")[0].appendChild(link)
    }
  }
}

export const themeManager = new ThemeManager()
