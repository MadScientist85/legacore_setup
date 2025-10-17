import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanyManager } from "@/components/white-label/company-manager"
import { ThemeCustomizer } from "@/components/white-label/theme-customizer"

export const metadata: Metadata = {
  title: "White Label | LegaCore",
  description: "Manage white-label companies and themes",
}

export default function WhiteLabelPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">White Label Management</h1>
        <p className="text-muted-foreground">Manage companies, customize themes, and configure white-label instances</p>
      </div>

      <Tabs defaultValue="companies" className="w-full">
        <TabsList>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="theme">Theme Customizer</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-4">
          <CompanyManager />
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Select a company from the list above to customize its theme</p>
          </div>
          <ThemeCustomizer companyId="default" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
