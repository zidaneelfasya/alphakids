export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'user' | 'admin';
export type ProgramStatus = 'draft' | 'published' | 'archived';
export type ContentType = 'text' | 'rich_text' | 'url' | 'image' | 'date_time' | 'link';
export type ContentVisibility = 'public' | 'member';
export type DiscountType = 'percentage' | 'fixed';
export type OrderStatus = 'draft' | 'pending' | 'paid' | 'expired' | 'failed' | 'cancelled';
export type PaymentProvider = 'midtrans' | 'mayar';
export type InternalPaymentStatus = 'initiated' | 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';
export type ProgramAccessStatus = 'active' | 'revoked' | 'expired';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      programs: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          thumbnail_url: string | null;
          start_at: string | null;
          end_at: string | null;
          status: ProgramStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          thumbnail_url?: string | null;
          start_at?: string | null;
          end_at?: string | null;
          status?: ProgramStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string;
          price?: number;
          thumbnail_url?: string | null;
          start_at?: string | null;
          end_at?: string | null;
          status?: ProgramStatus;
          updated_at?: string;
        };
      };
      program_contents: {
        Row: {
          id: string;
          program_id: string;
          name: string;
          type: ContentType;
          value: string;
          sort_order: number;
          visibility: ContentVisibility;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          name: string;
          type: ContentType;
          value: string;
          sort_order?: number;
          visibility?: ContentVisibility;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          type?: ContentType;
          value?: string;
          sort_order?: number;
          visibility?: ContentVisibility;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      vouchers: {
        Row: {
          id: string;
          code: string;
          name: string;
          discount_type: DiscountType;
          discount_value: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          discount_type: DiscountType;
          discount_value: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          name?: string;
          discount_type?: DiscountType;
          discount_value?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          voucher_id: string | null;
          status: OrderStatus;
          subtotal: number;
          discount_total: number;
          total: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id: string;
          voucher_id?: string | null;
          status?: OrderStatus;
          subtotal: number;
          discount_total?: number;
          total: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: OrderStatus;
          voucher_id?: string | null;
          discount_total?: number;
          total?: number;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          program_id: string;
          program_name_snapshot: string;
          unit_price_snapshot: number;
          quantity: number;
          subtotal: number;
          discount: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          program_id: string;
          program_name_snapshot: string;
          unit_price_snapshot: number;
          quantity?: number;
          subtotal: number;
          discount?: number;
          total: number;
          created_at?: string;
        };
        Update: {
          program_name_snapshot?: string;
          unit_price_snapshot?: number;
          subtotal?: number;
          discount?: number;
          total?: number;
        };
      };
      payment_gateway_configs: {
        Row: {
          id: string;
          provider: PaymentProvider;
          display_name: string;
          is_active: boolean;
          environment: 'sandbox' | 'production';
          metadata: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider: PaymentProvider;
          display_name: string;
          is_active?: boolean;
          environment?: 'sandbox' | 'production';
          metadata?: Json;
          updated_at?: string;
        };
        Update: {
          display_name?: string;
          is_active?: boolean;
          environment?: 'sandbox' | 'production';
          metadata?: Json;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          provider: PaymentProvider;
          provider_transaction_id: string | null;
          status: InternalPaymentStatus;
          amount: number;
          provider_status: string | null;
          payment_method: string | null;
          raw_response: Json | null;
          paid_at: string | null;
          expired_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          provider: PaymentProvider;
          provider_transaction_id?: string | null;
          status?: InternalPaymentStatus;
          amount: number;
          provider_status?: string | null;
          payment_method?: string | null;
          raw_response?: Json | null;
          paid_at?: string | null;
          expired_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          provider_transaction_id?: string | null;
          status?: InternalPaymentStatus;
          provider_status?: string | null;
          payment_method?: string | null;
          raw_response?: Json | null;
          paid_at?: string | null;
          expired_at?: string | null;
          updated_at?: string;
        };
      };
      program_access: {
        Row: {
          id: string;
          user_id: string;
          program_id: string;
          order_id: string;
          status: ProgramAccessStatus;
          granted_at: string;
          revoked_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          program_id: string;
          order_id: string;
          status?: ProgramAccessStatus;
          granted_at?: string;
          revoked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: ProgramAccessStatus;
          revoked_at?: string | null;
          updated_at?: string;
        };
      };
      voucher_redemptions: {
        Row: {
          id: string;
          voucher_id: string;
          user_id: string;
          order_id: string;
          discount_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          voucher_id: string;
          user_id: string;
          order_id: string;
          discount_amount: number;
          created_at?: string;
        };
        Update: {
          discount_amount?: number;
        };
      };
      certificates: {
        Row: {
          id: string;
          program_id: string;
          user_id: string;
          recipient_name_snapshot: string;
          recipient_email_snapshot: string;
          program_name_snapshot: string;
          certificate_number: string;
          template_url: string | null;
          certificate_url: string;
          issued_by: string | null;
          issued_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          user_id: string;
          recipient_name_snapshot: string;
          recipient_email_snapshot: string;
          program_name_snapshot: string;
          certificate_number: string;
          template_url?: string | null;
          certificate_url: string;
          issued_by?: string | null;
          issued_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          recipient_name_snapshot?: string;
          recipient_email_snapshot?: string;
          program_name_snapshot?: string;
          certificate_url?: string;
          updated_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          program_id: string | null;
          title: string;
          content: string;
          is_published: boolean;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id?: string | null;
          title: string;
          content: string;
          is_published?: boolean;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          is_published?: boolean;
          published_at?: string;
          updated_at?: string;
        };
      };
      cms_sections: {
        Row: {
          id: string;
          section_key: string;
          content: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          content?: Json;
          updated_at?: string;
        };
        Update: {
          content?: Json;
          updated_at?: string;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      handle_payment_settlement: {
        Args: {
          p_order_number: string;
          p_provider: string;
          p_provider_transaction_id: string;
          p_amount: number;
          p_provider_status: string;
          p_payment_method?: string;
          p_raw_response?: Json;
          p_paid_at?: string;
        };
        Returns: Json;
      };
    };
  };
}
