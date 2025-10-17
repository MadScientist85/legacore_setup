export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: string
          company_id: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string | null
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: string
          company_id?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string | null
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: string
          company_id?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string | null
          last_login?: string | null
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          domain: string | null
          features: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          domain?: string | null
          features?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          domain?: string | null
          features?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          name: string
          type: string
          description: string | null
          instructions: string
          model: string
          is_active: boolean
          company_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          description?: string | null
          instructions: string
          model: string
          is_active?: boolean
          company_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          description?: string | null
          instructions?: string
          model?: string
          is_active?: boolean
          company_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_runs: {
        Row: {
          id: string
          agent_id: string
          user_id: string
          input: string
          output: string | null
          status: string
          tokens_used: number | null
          cost: number | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          agent_id: string
          user_id: string
          input: string
          output?: string | null
          status?: string
          tokens_used?: number | null
          cost?: number | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          agent_id?: string
          user_id?: string
          input?: string
          output?: string | null
          status?: string
          tokens_used?: number | null
          cost?: number | null
          created_at?: string
          completed_at?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          agent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: string
          content: string
          attachments: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          content: string
          attachments?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: string
          content?: string
          attachments?: Json | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          file_url: string
          file_type: string
          file_size: number
          category: string | null
          extracted_text: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_url: string
          file_type: string
          file_size: number
          category?: string | null
          extracted_text?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          file_url?: string
          file_type?: string
          file_size?: number
          category?: string | null
          extracted_text?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_history: {
        Row: {
          id: string
          user_id: string
          stripe_payment_id: string
          amount: number
          currency: string
          status: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_id: string
          amount: number
          currency?: string
          status: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_id?: string
          amount?: number
          currency?: string
          status?: string
          description?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          plan: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          plan: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          plan?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
      notification_logs: {
        Row: {
          id: string
          user_id: string
          type: string
          channel: string
          recipient: string
          subject: string | null
          content: string
          status: string
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          channel: string
          recipient: string
          subject?: string | null
          content: string
          status?: string
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          channel?: string
          recipient?: string
          subject?: string | null
          content?: string
          status?: string
          error_message?: string | null
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          format: string
          data: Json
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          format: string
          data: Json
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          format?: string
          data?: Json
          status?: string
          created_at?: string
        }
      }
      insights: {
        Row: {
          id: string
          user_id: string
          category: string
          title: string
          description: string
          data: Json
          confidence: number | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          title: string
          description: string
          data: Json
          confidence?: number | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          title?: string
          description?: string
          data?: Json
          confidence?: number | null
          expires_at?: string | null
          created_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          provider: string
          credentials: Json
          metadata: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          credentials: Json
          metadata?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          credentials?: Json
          metadata?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      company_themes: {
        Row: {
          id: string
          company_id: string
          primary_color: string
          secondary_color: string
          accent_color: string
          logo_url: string | null
          favicon_url: string | null
          font_family: string | null
          custom_css: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          logo_url?: string | null
          favicon_url?: string | null
          font_family?: string | null
          custom_css?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          primary_color?: string
          secondary_color?: string
          accent_color?: string
          logo_url?: string | null
          favicon_url?: string | null
          font_family?: string | null
          custom_css?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource: string | null
          resource_id: string | null
          severity: string
          ip_address: string | null
          user_agent: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource?: string | null
          resource_id?: string | null
          severity?: string
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource?: string | null
          resource_id?: string | null
          severity?: string
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
