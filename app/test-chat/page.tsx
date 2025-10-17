import type { Metadata } from "next"
import { AgentChat } from "@/components/chat/agent-chat"
import { ChatInterface } from "@/components/chat/chat-interface"

export const metadata: Metadata = {
  title: "Test Chat - LEGACORE",
  description: "Test chat functionality",
}

export default function TestChatPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Test Chat Components</h1>
        <p className="text-muted-foreground mb-8">
          Test both chat interfaces to ensure streaming and responses work correctly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Simple Agent Chat */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Agent Chat (Simple)</h2>
          <AgentChat
            agentId="test-agent"
            agentName="Legal Assistant"
            agentDescription="I can help with legal questions and document analysis"
          />
        </div>

        {/* Full Chat Interface */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Chat Interface (Full Featured)</h2>
          <ChatInterface
            agentId="test-agent"
            agentName="Legal Assistant"
            agentDescription="I can help with legal questions and document analysis"
            companyId="default"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Testing Instructions</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Type a message and press Enter to send</li>
          <li>Watch for streaming response (text should appear character by character)</li>
          <li>Test with multiple messages to verify conversation history</li>
          <li>Try uploading files in the full interface</li>
          <li>Check browser console for any errors</li>
          <li>Verify loading states appear correctly</li>
          <li>Test error handling by disconnecting from internet</li>
        </ul>
      </div>
    </div>
  )
}
