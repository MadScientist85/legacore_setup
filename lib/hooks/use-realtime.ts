"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "../supabase/client"
import { Logger } from "../utils/logger"

export interface RealtimeOptions {
  table: string
  filter?: string
  event?: "INSERT" | "UPDATE" | "DELETE" | "*"
}

export function useRealtime<T = any>(options: RealtimeOptions, callback: (payload: any) => void) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const logger = useRef(new Logger("useRealtime"))
  const channelRef = useRef<string>()
  const { table, filter, event = "*" } = options

  useEffect(() => {
    const channelName = `${table}-${filter || "all"}-${Date.now()}`
    channelRef.current = channelName

    logger.current.info("Setting up realtime subscription", {
      table,
      filter,
      event,
      channel: channelName,
    })

    try {
      const subscription = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event,
            schema: "public",
            table,
            filter,
          },
          (payload) => {
            logger.current.info("Realtime event received", {
              eventType: payload.eventType,
              table: payload.table,
              new: payload.new,
              old: payload.old,
            })
            callback(payload)
          },
        )
        .subscribe((status) => {
          logger.current.info("Subscription status changed", { status, channel: channelName })

          if (status === "SUBSCRIBED") {
            setIsConnected(true)
            setError(null)
          } else if (status === "CHANNEL_ERROR") {
            setIsConnected(false)
            setError("Failed to connect to realtime channel")
          } else if (status === "TIMED_OUT") {
            setIsConnected(false)
            setError("Realtime connection timed out")
          }
        })

      return () => {
        logger.current.info("Cleaning up realtime subscription", { channel: channelName })
        subscription.unsubscribe()
        setIsConnected(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      logger.current.error("Failed to set up realtime subscription", { error: errorMessage })
      setError(errorMessage)
    }
  }, [table, filter])

  return { isConnected, error }
}

export function usePresence(roomId: string, userInfo: any) {
  const [presenceState, setPresenceState] = useState<Record<string, any>>({})
  const [isConnected, setIsConnected] = useState(false)
  const logger = useRef(new Logger("usePresence"))

  useEffect(() => {
    const channelName = `presence-${roomId}`

    logger.current.info("Setting up presence channel", { roomId, userInfo })

    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: userInfo.id,
        },
      },
    })

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()
        logger.current.info("Presence sync", { state })
        setPresenceState(state)
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        logger.current.info("User joined", { key, newPresences })
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        logger.current.info("User left", { key, leftPresences })
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true)
          await channel.track(userInfo)
        }
      })

    return () => {
      logger.current.info("Cleaning up presence channel", { roomId })
      channel.unsubscribe()
      setIsConnected(false)
    }
  }, [roomId, userInfo])

  return { presenceState, isConnected }
}
