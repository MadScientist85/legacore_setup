import { ChatInterface } from "@/components/chat/chat-interface"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ChatPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Agent Chat</h1>
        <p className="text-muted-foreground">Have a conversation with your AI assistant</p>
      </div>

      <ChatInterface
        agentId="contract-review-v1"
        agentName="Contract Review Assistant"
        agentDescription="I help analyze and review legal contracts"
        companyId="hbu-asset-recovery"
      />
    </div>
  )
}
