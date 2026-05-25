export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          country?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          country?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          relation: string | null;
          priority_order: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          relation?: string | null;
          priority_order?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string;
          relation?: string | null;
          priority_order?: number;
        };
        Relationships: [];
      };
      sos_events: {
        Row: {
          id: string;
          user_id: string;
          triggered_at: string;
          latitude: number | null;
          longitude: number | null;
          audio_url: string | null;
          status: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          triggered_at?: string;
          latitude?: number | null;
          longitude?: number | null;
          audio_url?: string | null;
          status?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          triggered_at?: string;
          latitude?: number | null;
          longitude?: number | null;
          audio_url?: string | null;
          status?: string;
          resolved_at?: string | null;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          user_id: string;
          panic_phrase: string | null;
          voice_trigger: boolean;
          auto_call_police: boolean;
          language: string;
        };
        Insert: {
          user_id: string;
          panic_phrase?: string | null;
          voice_trigger?: boolean;
          auto_call_police?: boolean;
          language?: string;
        };
        Update: {
          user_id?: string;
          panic_phrase?: string | null;
          voice_trigger?: boolean;
          auto_call_police?: boolean;
          language?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
