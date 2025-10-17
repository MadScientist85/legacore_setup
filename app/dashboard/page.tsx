import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AgentGrid } from "@/components/dashboard/agent-grid"
import { AgentHistoryPanel } from "@/components/dashboard/agent-history-panel"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-aurelian-dark">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {session.user?.name || session.user?.email}!
          </h1>
          <p className="text-gray-400">Your LegaCore AI agents are ready to assist you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AgentGrid />
          </div>

          <div className="lg:col-span-1">
            <AgentHistoryPanel />
          </div>
        </div>
      </main>
    </div>
  )
}
