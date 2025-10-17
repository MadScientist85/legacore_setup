import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentChat } from "@/components/chat/agent-chat"
import { AGENT_REGISTRY } from "@/lib/agents/registry"

export default async function AgentsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Group agents by category
  const categories = Array.from(new Set(AGENT_REGISTRY.map((agent) => agent.category)))
  const agentsByCategory = categories.reduce(
    (acc, category) => {
      acc[category] = AGENT_REGISTRY.filter((agent) => agent.category === category && agent.isActive)
      return acc
    },
    {} as Record<string, typeof AGENT_REGISTRY>,
  )

  return (
    <div className="min-h-screen bg-aurelian-dark">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Agents</h1>
          <p className="text-gray-400">Select an agent to start automating your legal workflows</p>
        </div>

        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6 bg-gray-900">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-aurelian-purple data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agentsByCategory[category].map((agent) => (
                  <AgentChat
                    key={agent.id}
                    agentId={agent.id}
                    agentName={agent.name}
                    agentDescription={agent.description}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
