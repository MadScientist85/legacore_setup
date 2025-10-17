import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getAgents() {
  const { data, error } = await supabase.from("agents").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching agents:", error)
    return []
  }

  return data || []
}

export async function getAgent(id) {
  const { data, error } = await supabase.from("agents").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching agent:", error)
    return null
  }

  return data
}

export async function createTask(agentId, input, metadata = {}) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      agent_id: agentId,
      input,
      metadata,
      status: "pending",
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating task:", error)
    throw error
  }

  return data
}

export async function updateTask(id, updates) {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating task:", error)
    throw error
  }

  return data
}

export async function getTasks(agentId = null, limit = 50) {
  let query = supabase.from("tasks").select("*").order("created_at", { ascending: false }).limit(limit)

  if (agentId) {
    query = query.eq("agent_id", agentId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching tasks:", error)
    return []
  }

  return data || []
}
