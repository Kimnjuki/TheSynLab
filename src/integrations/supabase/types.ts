export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ad_compliance_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_type: string
          ad_id: string | null
          created_at: string
          details: Json | null
          id: string
          new_status: string | null
          previous_status: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_type: string
          ad_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          new_status?: string | null
          previous_status?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_type?: string
          ad_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          new_status?: string | null
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_compliance_audit_log_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ad_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_compliance_violations: {
        Row: {
          ad_id: string
          ai_confidence: number | null
          created_at: string
          description: string | null
          id: string
          matched_keywords: string[] | null
          resolution_notes: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          violation_category: string
          violation_level: number
          violation_rule: string
        }
        Insert: {
          ad_id: string
          ai_confidence?: number | null
          created_at?: string
          description?: string | null
          id?: string
          matched_keywords?: string[] | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          violation_category: string
          violation_level: number
          violation_rule: string
        }
        Update: {
          ad_id?: string
          ai_confidence?: number | null
          created_at?: string
          description?: string | null
          id?: string
          matched_keywords?: string[] | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          violation_category?: string
          violation_level?: number
          violation_rule?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_compliance_violations_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ad_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_policy_rules: {
        Row: {
          age_restriction: number | null
          category: string
          created_at: string
          geo_restrictions: string[] | null
          id: string
          instruction: string
          is_active: boolean | null
          keywords: string[] | null
          level_id: number
          level_name: string
          requires_certification: boolean | null
          severity: string
          updated_at: string
        }
        Insert: {
          age_restriction?: number | null
          category: string
          created_at?: string
          geo_restrictions?: string[] | null
          id?: string
          instruction: string
          is_active?: boolean | null
          keywords?: string[] | null
          level_id: number
          level_name: string
          requires_certification?: boolean | null
          severity: string
          updated_at?: string
        }
        Update: {
          age_restriction?: number | null
          category?: string
          created_at?: string
          geo_restrictions?: string[] | null
          id?: string
          instruction?: string
          is_active?: boolean | null
          keywords?: string[] | null
          level_id?: number
          level_name?: string
          requires_certification?: boolean | null
          severity?: string
          updated_at?: string
        }
        Relationships: []
      }
      ad_submissions: {
        Row: {
          category: string | null
          compliance_score: number | null
          content: string
          created_at: string
          description: string | null
          destination_url: string | null
          id: string
          image_urls: string[] | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          target_audience: Json | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          compliance_score?: number | null
          content: string
          created_at?: string
          description?: string | null
          destination_url?: string | null
          id?: string
          image_urls?: string[] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_audience?: Json | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          compliance_score?: number | null
          content?: string
          created_at?: string
          description?: string | null
          destination_url?: string | null
          id?: string
          image_urls?: string[] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_audience?: Json | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      advertiser_certifications: {
        Row: {
          certificate_number: string | null
          certification_type: string
          created_at: string
          document_url: string | null
          id: string
          issuing_authority: string | null
          updated_at: string
          user_id: string
          valid_from: string | null
          valid_until: string | null
          verification_status: string | null
        }
        Insert: {
          certificate_number?: string | null
          certification_type: string
          created_at?: string
          document_url?: string | null
          id?: string
          issuing_authority?: string | null
          updated_at?: string
          user_id: string
          valid_from?: string | null
          valid_until?: string | null
          verification_status?: string | null
        }
        Update: {
          certificate_number?: string | null
          certification_type?: string
          created_at?: string
          document_url?: string | null
          id?: string
          issuing_authority?: string | null
          updated_at?: string
          user_id?: string
          valid_from?: string | null
          valid_until?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      automation_runs: {
        Row: {
          automation_id: string | null
          error_log: string | null
          executed_at: string | null
          id: string
          status: string | null
          trigger_data: Json | null
        }
        Insert: {
          automation_id?: string | null
          error_log?: string | null
          executed_at?: string | null
          id?: string
          status?: string | null
          trigger_data?: Json | null
        }
        Update: {
          automation_id?: string | null
          error_log?: string | null
          executed_at?: string | null
          id?: string
          status?: string | null
          trigger_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_templates: {
        Row: {
          actions: Json | null
          category: string | null
          conditions: Json | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_featured: boolean | null
          name: string
          trigger_config: Json | null
          trigger_type: string
          use_count: number | null
        }
        Insert: {
          actions?: Json | null
          category?: string | null
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          trigger_config?: Json | null
          trigger_type: string
          use_count?: number | null
        }
        Update: {
          actions?: Json | null
          category?: string | null
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          trigger_config?: Json | null
          trigger_type?: string
          use_count?: number | null
        }
        Relationships: []
      }
      automations: {
        Row: {
          actions: Json | null
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_run_at: string | null
          name: string
          run_count: number | null
          trigger_config: Json | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          name: string
          run_count?: number | null
          trigger_config?: Json | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          name?: string
          run_count?: number | null
          trigger_config?: Json | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          is_edited: boolean | null
          parent_id: string | null
          reactions: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          is_edited?: boolean | null
          parent_id?: string | null
          reactions?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          is_edited?: boolean | null
          parent_id?: string | null
          reactions?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_affiliate_clicks: {
        Row: {
          browser: string | null
          click_timestamp: string | null
          country_code: string | null
          device_type: Database["public"]["Enums"]["device_type_enum"] | null
          id: number
          ip_address: string | null
          is_bot: boolean | null
          link_id: number
          operating_system: string | null
          post_id: number | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: number | null
        }
        Insert: {
          browser?: string | null
          click_timestamp?: string | null
          country_code?: string | null
          device_type?: Database["public"]["Enums"]["device_type_enum"] | null
          id?: number
          ip_address?: string | null
          is_bot?: boolean | null
          link_id: number
          operating_system?: string | null
          post_id?: number | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: number | null
        }
        Update: {
          browser?: string | null
          click_timestamp?: string | null
          country_code?: string | null
          device_type?: Database["public"]["Enums"]["device_type_enum"] | null
          id?: number
          ip_address?: string | null
          is_bot?: boolean | null
          link_id?: number
          operating_system?: string | null
          post_id?: number | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_affiliate_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "nova_affiliate_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_affiliate_clicks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "nova_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_affiliate_clicks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_affiliate_links: {
        Row: {
          click_count: number | null
          cloaked_url: string | null
          commission_rate: string | null
          conversion_count: number | null
          created_at: string | null
          created_by: number | null
          geo_target: string | null
          id: number
          is_active: boolean | null
          last_checked_at: string | null
          last_clicked_at: string | null
          link_health_status:
            | Database["public"]["Enums"]["link_health_enum"]
            | null
          link_type: Database["public"]["Enums"]["link_type_enum"] | null
          link_url: string
          product_id: number
          program_id: number
          unique_click_count: number | null
          updated_at: string | null
        }
        Insert: {
          click_count?: number | null
          cloaked_url?: string | null
          commission_rate?: string | null
          conversion_count?: number | null
          created_at?: string | null
          created_by?: number | null
          geo_target?: string | null
          id?: number
          is_active?: boolean | null
          last_checked_at?: string | null
          last_clicked_at?: string | null
          link_health_status?:
            | Database["public"]["Enums"]["link_health_enum"]
            | null
          link_type?: Database["public"]["Enums"]["link_type_enum"] | null
          link_url: string
          product_id: number
          program_id: number
          unique_click_count?: number | null
          updated_at?: string | null
        }
        Update: {
          click_count?: number | null
          cloaked_url?: string | null
          commission_rate?: string | null
          conversion_count?: number | null
          created_at?: string | null
          created_by?: number | null
          geo_target?: string | null
          id?: number
          is_active?: boolean | null
          last_checked_at?: string | null
          last_clicked_at?: string | null
          link_health_status?:
            | Database["public"]["Enums"]["link_health_enum"]
            | null
          link_type?: Database["public"]["Enums"]["link_type_enum"] | null
          link_url?: string
          product_id?: number
          program_id?: number
          unique_click_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_affiliate_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_affiliate_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "nova_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_affiliate_links_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "nova_affiliate_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_affiliate_performance: {
        Row: {
          clicks: number | null
          commission: number | null
          conversions: number | null
          created_at: string | null
          currency: string | null
          data_verified: boolean | null
          id: number
          notes: string | null
          program_id: number
          revenue: number | null
          tracking_date: string
          unique_clicks: number | null
          updated_at: string | null
          verification_date: string | null
        }
        Insert: {
          clicks?: number | null
          commission?: number | null
          conversions?: number | null
          created_at?: string | null
          currency?: string | null
          data_verified?: boolean | null
          id?: number
          notes?: string | null
          program_id: number
          revenue?: number | null
          tracking_date: string
          unique_clicks?: number | null
          updated_at?: string | null
          verification_date?: string | null
        }
        Update: {
          clicks?: number | null
          commission?: number | null
          conversions?: number | null
          created_at?: string | null
          currency?: string | null
          data_verified?: boolean | null
          id?: number
          notes?: string | null
          program_id?: number
          revenue?: number | null
          tracking_date?: string
          unique_clicks?: number | null
          updated_at?: string | null
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_affiliate_performance_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "nova_affiliate_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_affiliate_programs: {
        Row: {
          account_id: string | null
          api_key_last_four: string | null
          application_date: string | null
          application_status:
            | Database["public"]["Enums"]["application_status_enum"]
            | null
          approval_date: string | null
          commission_rate: string | null
          commission_type:
            | Database["public"]["Enums"]["commission_type_enum"]
            | null
          cookie_duration: number | null
          created_at: string | null
          created_by: number | null
          encrypted_api_key: string | null
          id: number
          minimum_payout: number | null
          network: string | null
          notes: string | null
          payment_method: string | null
          payment_terms: string | null
          priority: number | null
          program_name: string
          program_slug: string
          program_type: Database["public"]["Enums"]["program_type_enum"] | null
          terms_accepted: boolean | null
          terms_version: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          api_key_last_four?: string | null
          application_date?: string | null
          application_status?:
            | Database["public"]["Enums"]["application_status_enum"]
            | null
          approval_date?: string | null
          commission_rate?: string | null
          commission_type?:
            | Database["public"]["Enums"]["commission_type_enum"]
            | null
          cookie_duration?: number | null
          created_at?: string | null
          created_by?: number | null
          encrypted_api_key?: string | null
          id?: number
          minimum_payout?: number | null
          network?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_terms?: string | null
          priority?: number | null
          program_name: string
          program_slug: string
          program_type?: Database["public"]["Enums"]["program_type_enum"] | null
          terms_accepted?: boolean | null
          terms_version?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          api_key_last_four?: string | null
          application_date?: string | null
          application_status?:
            | Database["public"]["Enums"]["application_status_enum"]
            | null
          approval_date?: string | null
          commission_rate?: string | null
          commission_type?:
            | Database["public"]["Enums"]["commission_type_enum"]
            | null
          cookie_duration?: number | null
          created_at?: string | null
          created_by?: number | null
          encrypted_api_key?: string | null
          id?: number
          minimum_payout?: number | null
          network?: string | null
          notes?: string | null
          payment_method?: string | null
          payment_terms?: string | null
          priority?: number | null
          program_name?: string
          program_slug?: string
          program_type?: Database["public"]["Enums"]["program_type_enum"] | null
          terms_accepted?: boolean | null
          terms_version?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_affiliate_programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_api_keys: {
        Row: {
          api_key_hash: string
          api_key_prefix: string
          created_at: string | null
          expires_at: string | null
          id: number
          is_active: boolean | null
          key_name: string
          last_used_at: string | null
          last_used_ip: string | null
          permissions: Json | null
          rate_limit: number | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          api_key_hash: string
          api_key_prefix: string
          created_at?: string | null
          expires_at?: string | null
          id?: number
          is_active?: boolean | null
          key_name: string
          last_used_at?: string | null
          last_used_ip?: string | null
          permissions?: Json | null
          rate_limit?: number | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          api_key_hash?: string
          api_key_prefix?: string
          created_at?: string | null
          expires_at?: string | null
          id?: number
          is_active?: boolean | null
          key_name?: string
          last_used_at?: string | null
          last_used_ip?: string | null
          permissions?: Json | null
          rate_limit?: number | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "nova_api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_blocked_ips: {
        Row: {
          attempt_count: number | null
          blocked_at: string | null
          blocked_by: number | null
          expires_at: string | null
          id: number
          ip_address: string
          is_permanent: boolean | null
          reason: string
          severity: Database["public"]["Enums"]["severity_enum"] | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_at?: string | null
          blocked_by?: number | null
          expires_at?: string | null
          id?: number
          ip_address: string
          is_permanent?: boolean | null
          reason: string
          severity?: Database["public"]["Enums"]["severity_enum"] | null
        }
        Update: {
          attempt_count?: number | null
          blocked_at?: string | null
          blocked_by?: number | null
          expires_at?: string | null
          id?: number
          ip_address?: string
          is_permanent?: boolean | null
          reason?: string
          severity?: Database["public"]["Enums"]["severity_enum"] | null
        }
        Relationships: []
      }
      nova_ecosystem_compatibility: {
        Row: {
          community_verified: boolean | null
          compatibility_level:
            | Database["public"]["Enums"]["compatibility_enum"]
            | null
          created_at: string | null
          created_by: number | null
          ecosystem: string
          id: number
          integration_method: string | null
          last_verified_date: string | null
          notes: string | null
          official_support: boolean | null
          product_id: number
          requires_hub: boolean | null
          setup_complexity: number | null
          updated_at: string | null
          verification_source: string | null
          verified_count: number | null
        }
        Insert: {
          community_verified?: boolean | null
          compatibility_level?:
            | Database["public"]["Enums"]["compatibility_enum"]
            | null
          created_at?: string | null
          created_by?: number | null
          ecosystem: string
          id?: number
          integration_method?: string | null
          last_verified_date?: string | null
          notes?: string | null
          official_support?: boolean | null
          product_id: number
          requires_hub?: boolean | null
          setup_complexity?: number | null
          updated_at?: string | null
          verification_source?: string | null
          verified_count?: number | null
        }
        Update: {
          community_verified?: boolean | null
          compatibility_level?:
            | Database["public"]["Enums"]["compatibility_enum"]
            | null
          created_at?: string | null
          created_by?: number | null
          ecosystem?: string
          id?: number
          integration_method?: string | null
          last_verified_date?: string | null
          notes?: string | null
          official_support?: boolean | null
          product_id?: number
          requires_hub?: boolean | null
          setup_complexity?: number | null
          updated_at?: string | null
          verification_source?: string | null
          verified_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_ecosystem_compatibility_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_ecosystem_compatibility_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "nova_products"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_failed_login_attempts: {
        Row: {
          attempt_time: string | null
          email: string | null
          failure_reason: string | null
          id: number
          ip_address: string
          user_agent: string | null
          username: string | null
        }
        Insert: {
          attempt_time?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: number
          ip_address: string
          user_agent?: string | null
          username?: string | null
        }
        Update: {
          attempt_time?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: number
          ip_address?: string
          user_agent?: string | null
          username?: string | null
        }
        Relationships: []
      }
      nova_gdpr_requests: {
        Row: {
          completion_notes: string | null
          id: number
          processed_at: string | null
          processed_by: number | null
          request_details: string | null
          request_type: Database["public"]["Enums"]["gdpr_request_enum"]
          requested_at: string | null
          status: Database["public"]["Enums"]["gdpr_status_enum"] | null
          user_id: number
          verification_token: string | null
          verified: boolean | null
        }
        Insert: {
          completion_notes?: string | null
          id?: number
          processed_at?: string | null
          processed_by?: number | null
          request_details?: string | null
          request_type: Database["public"]["Enums"]["gdpr_request_enum"]
          requested_at?: string | null
          status?: Database["public"]["Enums"]["gdpr_status_enum"] | null
          user_id: number
          verification_token?: string | null
          verified?: boolean | null
        }
        Update: {
          completion_notes?: string | null
          id?: number
          processed_at?: string | null
          processed_by?: number | null
          request_details?: string | null
          request_type?: Database["public"]["Enums"]["gdpr_request_enum"]
          requested_at?: string | null
          status?: Database["public"]["Enums"]["gdpr_status_enum"] | null
          user_id?: number
          verification_token?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_gdpr_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_integration_scores: {
        Row: {
          api_documentation: number | null
          automation_platforms: number | null
          created_at: string | null
          created_by: number
          cross_platform: number | null
          developer_community: number | null
          id: number
          is_current: boolean | null
          is_verified: boolean | null
          methodology_notes: string | null
          methodology_version: string | null
          product_id: number
          review_date: string | null
          reviewed_by: string | null
          smart_home_ecosystems: number | null
          test_results: Json | null
          tested_by: string
          tested_date: string
          testing_notes: string | null
          total_score: number
          updated_at: string | null
          verification_date: string | null
          version: number
        }
        Insert: {
          api_documentation?: number | null
          automation_platforms?: number | null
          created_at?: string | null
          created_by: number
          cross_platform?: number | null
          developer_community?: number | null
          id?: number
          is_current?: boolean | null
          is_verified?: boolean | null
          methodology_notes?: string | null
          methodology_version?: string | null
          product_id: number
          review_date?: string | null
          reviewed_by?: string | null
          smart_home_ecosystems?: number | null
          test_results?: Json | null
          tested_by: string
          tested_date: string
          testing_notes?: string | null
          total_score: number
          updated_at?: string | null
          verification_date?: string | null
          version?: number
        }
        Update: {
          api_documentation?: number | null
          automation_platforms?: number | null
          created_at?: string | null
          created_by?: number
          cross_platform?: number | null
          developer_community?: number | null
          id?: number
          is_current?: boolean | null
          is_verified?: boolean | null
          methodology_notes?: string | null
          methodology_version?: string | null
          product_id?: number
          review_date?: string | null
          reviewed_by?: string | null
          smart_home_ecosystems?: number | null
          test_results?: Json | null
          tested_by?: string
          tested_date?: string
          testing_notes?: string | null
          total_score?: number
          updated_at?: string | null
          verification_date?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "nova_integration_scores_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_integration_scores_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "nova_products"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_system: boolean | null
          permission_category: string | null
          permission_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_system?: boolean | null
          permission_category?: string | null
          permission_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_system?: boolean | null
          permission_category?: string | null
          permission_name?: string
        }
        Relationships: []
      }
      nova_post_meta: {
        Row: {
          created_at: string | null
          id: number
          meta_key: string
          meta_value: string | null
          post_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          meta_key: string
          meta_value?: string | null
          post_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          meta_key?: string
          meta_value?: string | null
          post_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_post_meta_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "nova_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_post_products: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: number
          post_id: number
          product_id: number
          product_role: Database["public"]["Enums"]["product_role_enum"] | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: number
          post_id: number
          product_id: number
          product_role?: Database["public"]["Enums"]["product_role_enum"] | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: number
          post_id?: number
          product_id?: number
          product_role?: Database["public"]["Enums"]["product_role_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_post_products_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "nova_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_post_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "nova_products"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_post_taxonomies: {
        Row: {
          created_at: string | null
          id: number
          post_id: number
          taxonomy_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          post_id: number
          taxonomy_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          post_id?: number
          taxonomy_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "nova_post_taxonomies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "nova_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_post_taxonomies_taxonomy_id_fkey"
            columns: ["taxonomy_id"]
            isOneToOne: false
            referencedRelation: "nova_taxonomies"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_posts: {
        Row: {
          author_id: number
          canonical_url: string | null
          created_at: string | null
          featured_image_url: string | null
          gallery_images: Json | null
          hub: Database["public"]["Enums"]["hub_enum"] | null
          id: number
          last_modified_by: number | null
          last_viewed_at: string | null
          meta_description: string | null
          meta_keywords: string | null
          post_content: string
          post_excerpt: string | null
          post_slug: string
          post_status: Database["public"]["Enums"]["post_status_enum"] | null
          post_title: string
          post_type: Database["public"]["Enums"]["post_type_enum"]
          published_at: string | null
          reading_time_minutes: number | null
          scheduled_for: string | null
          schema_markup: Json | null
          seo_title: string | null
          unique_view_count: number | null
          updated_at: string | null
          video_url: string | null
          view_count: number | null
          word_count: number | null
        }
        Insert: {
          author_id: number
          canonical_url?: string | null
          created_at?: string | null
          featured_image_url?: string | null
          gallery_images?: Json | null
          hub?: Database["public"]["Enums"]["hub_enum"] | null
          id?: number
          last_modified_by?: number | null
          last_viewed_at?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          post_content: string
          post_excerpt?: string | null
          post_slug: string
          post_status?: Database["public"]["Enums"]["post_status_enum"] | null
          post_title: string
          post_type: Database["public"]["Enums"]["post_type_enum"]
          published_at?: string | null
          reading_time_minutes?: number | null
          scheduled_for?: string | null
          schema_markup?: Json | null
          seo_title?: string | null
          unique_view_count?: number | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
          word_count?: number | null
        }
        Update: {
          author_id?: number
          canonical_url?: string | null
          created_at?: string | null
          featured_image_url?: string | null
          gallery_images?: Json | null
          hub?: Database["public"]["Enums"]["hub_enum"] | null
          id?: number
          last_modified_by?: number | null
          last_viewed_at?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          post_content?: string
          post_excerpt?: string | null
          post_slug?: string
          post_status?: Database["public"]["Enums"]["post_status_enum"] | null
          post_title?: string
          post_type?: Database["public"]["Enums"]["post_type_enum"]
          published_at?: string | null
          reading_time_minutes?: number | null
          scheduled_for?: string | null
          schema_markup?: Json | null
          seo_title?: string | null
          unique_view_count?: number | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_posts_last_modified_by_fkey"
            columns: ["last_modified_by"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_products: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: number | null
          data_hash: string | null
          description: string | null
          documentation_url: string | null
          featured_image_url: string | null
          features: Json | null
          gallery_images: Json | null
          hub: Database["public"]["Enums"]["hub_enum"]
          id: number
          is_sponsored: boolean | null
          manufacturer: string | null
          official_website: string | null
          price: number | null
          price_currency: string | null
          price_model: Database["public"]["Enums"]["price_model_enum"] | null
          product_name: string
          product_slug: string
          product_type: Database["public"]["Enums"]["product_type_enum"] | null
          release_date: string | null
          specifications: Json | null
          sponsor_disclosed: boolean | null
          status: Database["public"]["Enums"]["product_status_enum"] | null
          subcategory: string | null
          support_url: string | null
          updated_at: string | null
          updated_by: number | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: number | null
          data_hash?: string | null
          description?: string | null
          documentation_url?: string | null
          featured_image_url?: string | null
          features?: Json | null
          gallery_images?: Json | null
          hub: Database["public"]["Enums"]["hub_enum"]
          id?: number
          is_sponsored?: boolean | null
          manufacturer?: string | null
          official_website?: string | null
          price?: number | null
          price_currency?: string | null
          price_model?: Database["public"]["Enums"]["price_model_enum"] | null
          product_name: string
          product_slug: string
          product_type?: Database["public"]["Enums"]["product_type_enum"] | null
          release_date?: string | null
          specifications?: Json | null
          sponsor_disclosed?: boolean | null
          status?: Database["public"]["Enums"]["product_status_enum"] | null
          subcategory?: string | null
          support_url?: string | null
          updated_at?: string | null
          updated_by?: number | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: number | null
          data_hash?: string | null
          description?: string | null
          documentation_url?: string | null
          featured_image_url?: string | null
          features?: Json | null
          gallery_images?: Json | null
          hub?: Database["public"]["Enums"]["hub_enum"]
          id?: number
          is_sponsored?: boolean | null
          manufacturer?: string | null
          official_website?: string | null
          price?: number | null
          price_currency?: string | null
          price_model?: Database["public"]["Enums"]["price_model_enum"] | null
          product_name?: string
          product_slug?: string
          product_type?: Database["public"]["Enums"]["product_type_enum"] | null
          release_date?: string | null
          specifications?: Json | null
          sponsor_disclosed?: boolean | null
          status?: Database["public"]["Enums"]["product_status_enum"] | null
          subcategory?: string | null
          support_url?: string | null
          updated_at?: string | null
          updated_by?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_rate_limits: {
        Row: {
          blocked_until: string | null
          endpoint: string | null
          first_request_at: string | null
          id: number
          identifier: string
          identifier_type: Database["public"]["Enums"]["identifier_type_enum"]
          is_blocked: boolean | null
          last_request_at: string | null
          request_count: number | null
        }
        Insert: {
          blocked_until?: string | null
          endpoint?: string | null
          first_request_at?: string | null
          id?: number
          identifier: string
          identifier_type: Database["public"]["Enums"]["identifier_type_enum"]
          is_blocked?: boolean | null
          last_request_at?: string | null
          request_count?: number | null
        }
        Update: {
          blocked_until?: string | null
          endpoint?: string | null
          first_request_at?: string | null
          id?: number
          identifier?: string
          identifier_type?: Database["public"]["Enums"]["identifier_type_enum"]
          is_blocked?: boolean | null
          last_request_at?: string | null
          request_count?: number | null
        }
        Relationships: []
      }
      nova_role_permissions: {
        Row: {
          created_at: string | null
          id: number
          permission_id: number
          role_name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          permission_id: number
          role_name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          permission_id?: number
          role_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "nova_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "nova_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_security_audit_log: {
        Row: {
          action: string | null
          created_at: string | null
          description: string | null
          event_type: Database["public"]["Enums"]["event_type_enum"]
          id: number
          ip_address: string | null
          new_value: string | null
          old_value: string | null
          record_id: number | null
          session_id: string | null
          severity: Database["public"]["Enums"]["severity_enum"] | null
          status: Database["public"]["Enums"]["status_enum"] | null
          table_name: string | null
          user_agent: string | null
          user_id: number | null
          username: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          description?: string | null
          event_type: Database["public"]["Enums"]["event_type_enum"]
          id?: number
          ip_address?: string | null
          new_value?: string | null
          old_value?: string | null
          record_id?: number | null
          session_id?: string | null
          severity?: Database["public"]["Enums"]["severity_enum"] | null
          status?: Database["public"]["Enums"]["status_enum"] | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: number | null
          username?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type_enum"]
          id?: number
          ip_address?: string | null
          new_value?: string | null
          old_value?: string | null
          record_id?: number | null
          session_id?: string | null
          severity?: Database["public"]["Enums"]["severity_enum"] | null
          status?: Database["public"]["Enums"]["status_enum"] | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: number | null
          username?: string | null
        }
        Relationships: []
      }
      nova_taxonomies: {
        Row: {
          count: number | null
          created_at: string | null
          description: string | null
          id: number
          parent_id: number | null
          taxonomy_name: string
          taxonomy_slug: string
          taxonomy_type: Database["public"]["Enums"]["taxonomy_type_enum"]
          updated_at: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          parent_id?: number | null
          taxonomy_name: string
          taxonomy_slug: string
          taxonomy_type: Database["public"]["Enums"]["taxonomy_type_enum"]
          updated_at?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          parent_id?: number | null
          taxonomy_name?: string
          taxonomy_slug?: string
          taxonomy_type?: Database["public"]["Enums"]["taxonomy_type_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nova_taxonomies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "nova_taxonomies"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_trust_scores: {
        Row: {
          created_at: string | null
          created_by: number
          data_privacy_practices: number | null
          encryption_standards: number | null
          ethical_ai_transparency: number | null
          evidence_urls: Json | null
          id: number
          is_current: boolean | null
          is_verified: boolean | null
          methodology_notes: string | null
          methodology_version: string | null
          product_id: number
          review_date: string | null
          reviewed_by: string | null
          terms_transparency: number | null
          tested_by: string
          tested_date: string
          testing_notes: string | null
          third_party_audits: number | null
          total_score: number
          updated_at: string | null
          verification_date: string | null
          version: number
        }
        Insert: {
          created_at?: string | null
          created_by: number
          data_privacy_practices?: number | null
          encryption_standards?: number | null
          ethical_ai_transparency?: number | null
          evidence_urls?: Json | null
          id?: number
          is_current?: boolean | null
          is_verified?: boolean | null
          methodology_notes?: string | null
          methodology_version?: string | null
          product_id: number
          review_date?: string | null
          reviewed_by?: string | null
          terms_transparency?: number | null
          tested_by: string
          tested_date: string
          testing_notes?: string | null
          third_party_audits?: number | null
          total_score: number
          updated_at?: string | null
          verification_date?: string | null
          version?: number
        }
        Update: {
          created_at?: string | null
          created_by?: number
          data_privacy_practices?: number | null
          encryption_standards?: number | null
          ethical_ai_transparency?: number | null
          evidence_urls?: Json | null
          id?: number
          is_current?: boolean | null
          is_verified?: boolean | null
          methodology_notes?: string | null
          methodology_version?: string | null
          product_id?: number
          review_date?: string | null
          reviewed_by?: string | null
          terms_transparency?: number | null
          tested_by?: string
          tested_date?: string
          testing_notes?: string | null
          third_party_audits?: number | null
          total_score?: number
          updated_at?: string | null
          verification_date?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "nova_trust_scores_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nova_trust_scores_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "nova_products"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_user_pii: {
        Row: {
          access_count: number | null
          consent_analytics: boolean | null
          consent_given_at: string | null
          consent_ip: string | null
          consent_marketing: boolean | null
          created_at: string | null
          data_retention_date: string | null
          encrypted_address: string | null
          encrypted_email: string | null
          encrypted_payment_info: string | null
          encrypted_phone: string | null
          id: number
          last_accessed: string | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          access_count?: number | null
          consent_analytics?: boolean | null
          consent_given_at?: string | null
          consent_ip?: string | null
          consent_marketing?: boolean | null
          created_at?: string | null
          data_retention_date?: string | null
          encrypted_address?: string | null
          encrypted_email?: string | null
          encrypted_payment_info?: string | null
          encrypted_phone?: string | null
          id?: number
          last_accessed?: string | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          access_count?: number | null
          consent_analytics?: boolean | null
          consent_given_at?: string | null
          consent_ip?: string | null
          consent_marketing?: boolean | null
          created_at?: string | null
          data_retention_date?: string | null
          encrypted_address?: string | null
          encrypted_email?: string | null
          encrypted_payment_info?: string | null
          encrypted_phone?: string | null
          id?: number
          last_accessed?: string | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "nova_user_pii_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: number | null
          id: number
          is_active: boolean | null
          role_name: Database["public"]["Enums"]["role_name_enum"]
          user_id: number
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: number | null
          id?: number
          is_active?: boolean | null
          role_name: Database["public"]["Enums"]["role_name_enum"]
          user_id: number
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: number | null
          id?: number
          is_active?: boolean | null
          role_name?: Database["public"]["Enums"]["role_name_enum"]
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "nova_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "nova_users"
            referencedColumns: ["id"]
          },
        ]
      }
      nova_users: {
        Row: {
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string
          email_verification_sent_at: string | null
          email_verification_token: string | null
          email_verified: boolean | null
          first_name: string | null
          id: number
          last_login_at: string | null
          last_login_ip: string | null
          last_name: string | null
          location: string | null
          login_count: number | null
          password_hash: string
          password_reset_expires_at: string | null
          password_reset_token: string | null
          profile_photo_url: string | null
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string | null
          user_status: Database["public"]["Enums"]["user_status_enum"] | null
          username: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          email_verification_sent_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: number
          last_login_at?: string | null
          last_login_ip?: string | null
          last_name?: string | null
          location?: string | null
          login_count?: number | null
          password_hash: string
          password_reset_expires_at?: string | null
          password_reset_token?: string | null
          profile_photo_url?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          user_status?: Database["public"]["Enums"]["user_status_enum"] | null
          username: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          email_verification_sent_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: number
          last_login_at?: string | null
          last_login_ip?: string | null
          last_name?: string | null
          location?: string | null
          login_count?: number | null
          password_hash?: string
          password_reset_expires_at?: string | null
          password_reset_token?: string | null
          profile_photo_url?: string | null
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          user_status?: Database["public"]["Enums"]["user_status_enum"] | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          cons: string[] | null
          created_at: string | null
          helpful_count: number | null
          id: string
          product_id: number
          pros: string[] | null
          rating: number
          review_content: string
          review_title: string
          updated_at: string | null
          user_id: string
          verified_purchase: boolean | null
        }
        Insert: {
          cons?: string[] | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          product_id: number
          pros?: string[] | null
          rating: number
          review_content: string
          review_title: string
          updated_at?: string | null
          user_id: string
          verified_purchase?: boolean | null
        }
        Update: {
          cons?: string[] | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          product_id?: number
          pros?: string[] | null
          rating?: number
          review_content?: string
          review_title?: string
          updated_at?: string | null
          user_id?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "nova_products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          location: string | null
          notification_preferences: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          location?: string | null
          notification_preferences?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          location?: string | null
          notification_preferences?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      review_helpful_votes: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_likes: {
        Row: {
          created_at: string | null
          id: string
          setup_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          setup_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          setup_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setup_likes_setup_id_fkey"
            columns: ["setup_id"]
            isOneToOne: false
            referencedRelation: "nova_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          created_at: string
          created_by: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          parent_task_id: string | null
          priority: string
          project_id: string | null
          sort_order: number | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          parent_task_id?: string | null
          priority?: string
          project_id?: string | null
          sort_order?: number | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          parent_task_id?: string | null
          priority?: string
          project_id?: string | null
          sort_order?: number | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_workload: number | null
          display_name: string | null
          id: string
          skills: string[] | null
          user_id: string
          workload_capacity: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_workload?: number | null
          display_name?: string | null
          id?: string
          skills?: string[] | null
          user_id: string
          workload_capacity?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_workload?: number | null
          display_name?: string | null
          id?: string
          skills?: string[] | null
          user_id?: string
          workload_capacity?: number | null
        }
        Relationships: []
      }
      user_budget_configs: {
        Row: {
          categories: Json
          config_name: string
          created_at: string | null
          id: string
          saved_products: Json | null
          total_budget: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          categories: Json
          config_name: string
          created_at?: string | null
          id?: string
          saved_products?: Json | null
          total_budget: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          categories?: Json
          config_name?: string
          created_at?: string | null
          id?: string
          saved_products?: Json | null
          total_budget?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_ergonomic_assessments: {
        Row: {
          answers: Json
          assessment_date: string
          budget: number | null
          created_at: string
          id: string
          improvement_tips: string[] | null
          role: string | null
          score: number
          selected_bundle: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          assessment_date?: string
          budget?: number | null
          created_at?: string
          id?: string
          improvement_tips?: string[] | null
          role?: string | null
          score?: number
          selected_bundle?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          assessment_date?: string
          budget?: number | null
          created_at?: string
          id?: string
          improvement_tips?: string[] | null
          role?: string | null
          score?: number
          selected_bundle?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorite_products: {
        Row: {
          created_at: string | null
          id: string
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "nova_products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_saved_prompts: {
        Row: {
          category: string | null
          created_at: string
          custom_prompt: string
          id: string
          template_id: number | null
          title: string
          updated_at: string
          use_count: number | null
          user_id: string
          variables: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          custom_prompt: string
          id?: string
          template_id?: number | null
          title: string
          updated_at?: string
          use_count?: number | null
          user_id: string
          variables?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string
          custom_prompt?: string
          id?: string
          template_id?: number | null
          title?: string
          updated_at?: string
          use_count?: number | null
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      user_smart_home_configs: {
        Row: {
          created_at: string
          devices: Json
          ecosystem: string | null
          electricity_rate: number | null
          energy_budget: number | null
          id: string
          name: string
          scenes: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          devices?: Json
          ecosystem?: string | null
          electricity_rate?: number | null
          energy_budget?: number | null
          id?: string
          name: string
          scenes?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          devices?: Json
          ecosystem?: string | null
          electricity_rate?: number | null
          energy_budget?: number | null
          id?: string
          name?: string
          scenes?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_workflow_configs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          last_run_at: string | null
          name: string
          run_count: number | null
          updated_at: string
          user_id: string
          workflow_connections: Json
          workflow_nodes: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          name: string
          run_count?: number | null
          updated_at?: string
          user_id: string
          workflow_connections?: Json
          workflow_nodes?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          name?: string
          run_count?: number | null
          updated_at?: string
          user_id?: string
          workflow_connections?: Json
          workflow_nodes?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      added_by_enum: "user" | "auto" | "admin"
      app_role: "admin" | "moderator" | "user"
      application_status_enum:
        | "pending"
        | "approved"
        | "rejected"
        | "inactive"
        | "suspended"
      billing_cycle_enum: "monthly" | "annual" | "lifetime"
      campaign_status_enum:
        | "draft"
        | "scheduled"
        | "sending"
        | "sent"
        | "paused"
        | "cancelled"
      campaign_type_enum:
        | "newsletter"
        | "product"
        | "automation"
        | "announcement"
      commission_type_enum: "one_time" | "recurring" | "hybrid"
      compatibility_enum: "full" | "partial" | "none" | "unknown"
      compatibility_status_enum:
        | "compatible"
        | "partial"
        | "incompatible"
        | "unknown"
      content_type_enum: "setup" | "guide" | "comment" | "photo" | "post"
      deliverable_status_enum:
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled"
      deliverable_type_enum:
        | "review"
        | "comparison"
        | "newsletter"
        | "social"
        | "banner"
        | "custom"
      device_type_enum: "desktop" | "mobile" | "tablet" | "unknown"
      difficulty_enum: "beginner" | "intermediate" | "advanced" | "expert"
      event_type_enum:
        | "login"
        | "logout"
        | "failed_login"
        | "data_access"
        | "data_modification"
        | "data_deletion"
        | "permission_change"
        | "suspicious_activity"
        | "api_access"
      gdpr_request_enum:
        | "export"
        | "delete"
        | "rectify"
        | "restrict"
        | "object"
        | "portability"
      gdpr_status_enum: "pending" | "processing" | "completed" | "rejected"
      hub_enum: "ai_workflow" | "intelligent_home" | "hybrid_office"
      identifier_type_enum: "ip" | "user" | "api_key"
      link_health_enum: "healthy" | "warning" | "broken" | "unchecked"
      link_type_enum: "primary" | "secondary" | "alternative"
      membership_status_enum:
        | "active"
        | "cancelled"
        | "expired"
        | "past_due"
        | "trialing"
        | "suspended"
      moderation_status_enum:
        | "pending"
        | "approved"
        | "rejected"
        | "flagged"
        | "spam"
      payment_method_enum:
        | "paypal"
        | "stripe"
        | "bank_transfer"
        | "crypto"
        | "other"
      payment_status_enum:
        | "pending"
        | "processing"
        | "paid"
        | "cancelled"
        | "disputed"
      post_status_enum:
        | "draft"
        | "pending"
        | "published"
        | "scheduled"
        | "archived"
      post_type_enum:
        | "product_review"
        | "blueprint"
        | "comparison"
        | "integration_guide"
        | "buying_guide"
        | "news"
        | "tutorial"
      price_model_enum: "one_time" | "subscription" | "freemium" | "free"
      priority_enum: "low" | "medium" | "high" | "urgent"
      product_role_enum: "primary" | "comparison" | "alternative" | "mentioned"
      product_status_enum:
        | "active"
        | "discontinued"
        | "upcoming"
        | "under_review"
      product_type_enum: "saas" | "hardware" | "service" | "education"
      program_type_enum: "saas" | "hardware" | "services" | "education"
      report_reason_enum:
        | "spam"
        | "inappropriate"
        | "misleading"
        | "copyright"
        | "harassment"
        | "other"
      report_status_enum: "pending" | "reviewing" | "resolved" | "dismissed"
      role_name_enum:
        | "super_admin"
        | "admin"
        | "editor"
        | "author"
        | "contributor"
        | "moderator"
        | "premium_member"
        | "member"
        | "subscriber"
      scan_status_enum: "pending" | "clean" | "infected" | "failed"
      severity_enum: "low" | "medium" | "high" | "critical"
      sponsorship_status_enum:
        | "active"
        | "pending"
        | "completed"
        | "cancelled"
        | "suspended"
      sponsorship_tier_enum:
        | "bronze"
        | "silver"
        | "gold"
        | "platinum"
        | "custom"
      status_enum: "success" | "failure" | "blocked"
      subscription_status_enum:
        | "active"
        | "unsubscribed"
        | "bounced"
        | "complained"
        | "pending"
      taxonomy_type_enum:
        | "category"
        | "tag"
        | "hub"
        | "ecosystem"
        | "skill_level"
        | "price_range"
        | "custom"
      tool_role_enum: "primary" | "secondary" | "optional"
      user_status_enum:
        | "active"
        | "inactive"
        | "suspended"
        | "pending_verification"
      verification_status_enum:
        | "unverified"
        | "team_verified"
        | "community_tested"
      visibility_enum: "public" | "unlisted" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      added_by_enum: ["user", "auto", "admin"],
      app_role: ["admin", "moderator", "user"],
      application_status_enum: [
        "pending",
        "approved",
        "rejected",
        "inactive",
        "suspended",
      ],
      billing_cycle_enum: ["monthly", "annual", "lifetime"],
      campaign_status_enum: [
        "draft",
        "scheduled",
        "sending",
        "sent",
        "paused",
        "cancelled",
      ],
      campaign_type_enum: [
        "newsletter",
        "product",
        "automation",
        "announcement",
      ],
      commission_type_enum: ["one_time", "recurring", "hybrid"],
      compatibility_enum: ["full", "partial", "none", "unknown"],
      compatibility_status_enum: [
        "compatible",
        "partial",
        "incompatible",
        "unknown",
      ],
      content_type_enum: ["setup", "guide", "comment", "photo", "post"],
      deliverable_status_enum: [
        "pending",
        "in_progress",
        "completed",
        "cancelled",
      ],
      deliverable_type_enum: [
        "review",
        "comparison",
        "newsletter",
        "social",
        "banner",
        "custom",
      ],
      device_type_enum: ["desktop", "mobile", "tablet", "unknown"],
      difficulty_enum: ["beginner", "intermediate", "advanced", "expert"],
      event_type_enum: [
        "login",
        "logout",
        "failed_login",
        "data_access",
        "data_modification",
        "data_deletion",
        "permission_change",
        "suspicious_activity",
        "api_access",
      ],
      gdpr_request_enum: [
        "export",
        "delete",
        "rectify",
        "restrict",
        "object",
        "portability",
      ],
      gdpr_status_enum: ["pending", "processing", "completed", "rejected"],
      hub_enum: ["ai_workflow", "intelligent_home", "hybrid_office"],
      identifier_type_enum: ["ip", "user", "api_key"],
      link_health_enum: ["healthy", "warning", "broken", "unchecked"],
      link_type_enum: ["primary", "secondary", "alternative"],
      membership_status_enum: [
        "active",
        "cancelled",
        "expired",
        "past_due",
        "trialing",
        "suspended",
      ],
      moderation_status_enum: [
        "pending",
        "approved",
        "rejected",
        "flagged",
        "spam",
      ],
      payment_method_enum: [
        "paypal",
        "stripe",
        "bank_transfer",
        "crypto",
        "other",
      ],
      payment_status_enum: [
        "pending",
        "processing",
        "paid",
        "cancelled",
        "disputed",
      ],
      post_status_enum: [
        "draft",
        "pending",
        "published",
        "scheduled",
        "archived",
      ],
      post_type_enum: [
        "product_review",
        "blueprint",
        "comparison",
        "integration_guide",
        "buying_guide",
        "news",
        "tutorial",
      ],
      price_model_enum: ["one_time", "subscription", "freemium", "free"],
      priority_enum: ["low", "medium", "high", "urgent"],
      product_role_enum: ["primary", "comparison", "alternative", "mentioned"],
      product_status_enum: [
        "active",
        "discontinued",
        "upcoming",
        "under_review",
      ],
      product_type_enum: ["saas", "hardware", "service", "education"],
      program_type_enum: ["saas", "hardware", "services", "education"],
      report_reason_enum: [
        "spam",
        "inappropriate",
        "misleading",
        "copyright",
        "harassment",
        "other",
      ],
      report_status_enum: ["pending", "reviewing", "resolved", "dismissed"],
      role_name_enum: [
        "super_admin",
        "admin",
        "editor",
        "author",
        "contributor",
        "moderator",
        "premium_member",
        "member",
        "subscriber",
      ],
      scan_status_enum: ["pending", "clean", "infected", "failed"],
      severity_enum: ["low", "medium", "high", "critical"],
      sponsorship_status_enum: [
        "active",
        "pending",
        "completed",
        "cancelled",
        "suspended",
      ],
      sponsorship_tier_enum: ["bronze", "silver", "gold", "platinum", "custom"],
      status_enum: ["success", "failure", "blocked"],
      subscription_status_enum: [
        "active",
        "unsubscribed",
        "bounced",
        "complained",
        "pending",
      ],
      taxonomy_type_enum: [
        "category",
        "tag",
        "hub",
        "ecosystem",
        "skill_level",
        "price_range",
        "custom",
      ],
      tool_role_enum: ["primary", "secondary", "optional"],
      user_status_enum: [
        "active",
        "inactive",
        "suspended",
        "pending_verification",
      ],
      verification_status_enum: [
        "unverified",
        "team_verified",
        "community_tested",
      ],
      visibility_enum: ["public", "unlisted", "private"],
    },
  },
} as const
