-- ==============================================================================
-- Alpha Kids Digital Program Platform - 00001 Initial Schema Migration
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & HELPER FUNCTIONS
-- Helper Non-Rekursif untuk memeriksa apakah user saat ini adalah admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 3. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Trigger otomatis saat user baru mendaftar di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
      updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. PROGRAMS
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  thumbnail_url TEXT,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. PROGRAM CONTENTS (Public vs Member Visibility)
CREATE TABLE IF NOT EXISTS public.program_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'rich_text', 'url', 'image', 'date_time', 'link')),
  value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'member' CHECK (visibility IN ('public', 'member')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. VOUCHERS (Strict MVP Scope)
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL CHECK (discount_value > 0),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 8. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  voucher_id UUID REFERENCES public.vouchers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'paid', 'expired', 'failed', 'cancelled')),
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  discount_total INTEGER NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  currency TEXT NOT NULL DEFAULT 'IDR',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT check_discount_not_exceed_subtotal CHECK (discount_total <= subtotal),
  CONSTRAINT check_total_matches_calculation CHECK (total = subtotal - discount_total)
);

-- 9. ORDER ITEMS (Enforce 1 item per order MVP)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE RESTRICT NOT NULL,
  program_name_snapshot TEXT NOT NULL,
  unit_price_snapshot INTEGER NOT NULL CHECK (unit_price_snapshot >= 0),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity = 1),
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  discount INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_item_per_order UNIQUE (order_id)
);

-- 10. PAYMENT GATEWAY CONFIGURATIONS (Provider-Agnostic Settings)
CREATE TABLE IF NOT EXISTS public.payment_gateway_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT UNIQUE NOT NULL CHECK (provider IN ('midtrans', 'mayar')),
  display_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false NOT NULL,
  environment TEXT NOT NULL DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Seed gateway defaults (Midtrans active by default, Mayar ready to toggle)
INSERT INTO public.payment_gateway_configs (provider, display_name, is_active, environment)
VALUES 
  ('midtrans', 'Midtrans Payment Gateway', true, 'sandbox'),
  ('mayar', 'Mayar Payment Gateway', false, 'sandbox')
ON CONFLICT (provider) DO NOTHING;

-- 11. PAYMENTS (Provider-Agnostic Payments)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('midtrans', 'mayar')),
  provider_transaction_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'pending', 'paid', 'failed', 'expired', 'cancelled')),
  amount INTEGER NOT NULL CHECK (amount >= 0),
  provider_status TEXT,
  payment_method TEXT,
  raw_response JSONB,
  paid_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 12. PROGRAM ACCESS (Explicit Enrollment Entity)
CREATE TABLE IF NOT EXISTS public.program_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE RESTRICT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  granted_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_user_program_access UNIQUE (user_id, program_id)
);

-- 13. VOUCHER REDEMPTIONS (Committed HANYA saat status paid)
CREATE TABLE IF NOT EXISTS public.voucher_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID REFERENCES public.vouchers(id) ON DELETE RESTRICT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  discount_amount INTEGER NOT NULL CHECK (discount_amount >= 0),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT unique_order_voucher_redemption UNIQUE (order_id)
);

-- 14. CERTIFICATES (Admin-Controlled & Recipient Snapshot)
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.programs(id) ON DELETE RESTRICT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  recipient_name_snapshot TEXT NOT NULL,
  recipient_email_snapshot TEXT NOT NULL,
  program_name_snapshot TEXT NOT NULL,
  certificate_number TEXT UNIQUE NOT NULL,
  template_url TEXT,
  certificate_url TEXT NOT NULL,
  issued_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  issued_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 15. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true NOT NULL,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 16. CMS SECTIONS
CREATE TABLE IF NOT EXISTS public.cms_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL CHECK (section_key IN ('hero', 'about', 'testimonials', 'faq')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 17. ATOMIC SETTLEMENT FUNCTION (Shared across all Payment Providers)
CREATE OR REPLACE FUNCTION public.handle_payment_settlement(
  p_order_number TEXT,
  p_provider TEXT,
  p_provider_transaction_id TEXT,
  p_amount INTEGER,
  p_provider_status TEXT,
  p_payment_method TEXT DEFAULT NULL,
  p_raw_response JSONB DEFAULT NULL,
  p_paid_at TIMESTAMPTZ DEFAULT now()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_item RECORD;
  v_payment_id UUID;
  v_access_id UUID;
BEGIN
  -- 1. Cari pesanan berdasarkan order_number
  SELECT * INTO v_order FROM public.orders WHERE order_number = p_order_number FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  -- 2. State machine protection: jika order sudah 'paid', keluar tanpa mutasi berulang (idempotent)
  IF v_order.status = 'paid' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Order already paid', 'order_id', v_order.id);
  END IF;

  -- 3. Verifikasi nominal persis (prevent amount tampering)
  IF v_order.total != p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Amount mismatch');
  END IF;

  -- 4. Update atau Insert record pembayaran
  SELECT id INTO v_payment_id FROM public.payments WHERE order_id = v_order.id AND provider = p_provider LIMIT 1;
  IF FOUND THEN
    UPDATE public.payments
    SET status = 'paid',
        provider_transaction_id = COALESCE(p_provider_transaction_id, provider_transaction_id),
        provider_status = p_provider_status,
        payment_method = COALESCE(p_payment_method, payment_method),
        raw_response = COALESCE(p_raw_response, raw_response),
        paid_at = p_paid_at,
        updated_at = now()
    WHERE id = v_payment_id;
  ELSE
    INSERT INTO public.payments (
      order_id, provider, provider_transaction_id, status, amount, provider_status, payment_method, raw_response, paid_at
    ) VALUES (
      v_order.id, p_provider, p_provider_transaction_id, 'paid', p_amount, p_provider_status, p_payment_method, p_raw_response, p_paid_at
    ) RETURNING id INTO v_payment_id;
  END IF;

  -- 5. Update status order menjadi paid
  UPDATE public.orders
  SET status = 'paid',
      updated_at = now()
  WHERE id = v_order.id;

  -- 6. Berikan Program Access untuk setiap order item (enrolled)
  FOR v_item IN SELECT * FROM public.order_items WHERE order_id = v_order.id LOOP
    INSERT INTO public.program_access (user_id, program_id, order_id, status, granted_at)
    VALUES (v_order.user_id, v_item.program_id, v_order.id, 'active', p_paid_at)
    ON CONFLICT (user_id, program_id)
    DO UPDATE SET status = 'active', revoked_at = NULL, updated_at = now()
    RETURNING id INTO v_access_id;
  END LOOP;

  -- 7. Catat Voucher Redemption HANYA saat transaksi paid (jika memakai voucher)
  IF v_order.voucher_id IS NOT NULL AND v_order.discount_total > 0 THEN
    INSERT INTO public.voucher_redemptions (voucher_id, user_id, order_id, discount_amount)
    VALUES (v_order.voucher_id, v_order.user_id, v_order.id, v_order.discount_total)
    ON CONFLICT (order_id) DO NOTHING;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order.id,
    'payment_id', v_payment_id,
    'program_access_id', v_access_id
  );
END;
$$;

-- 18. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateway_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;

-- Profiles: User can view own profile or admin can view all
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories: Public can view active categories; Admin can manage all
CREATE POLICY "categories_select_public" ON public.categories
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "categories_admin_all" ON public.categories
  FOR ALL USING (public.is_admin());

-- Programs: Public can view published programs; Admin can manage all
CREATE POLICY "programs_select_public" ON public.programs
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "programs_admin_all" ON public.programs
  FOR ALL USING (public.is_admin());

-- Program Contents: Public content visible to all; Member content visible only to enrolled participants
CREATE POLICY "program_contents_select_rules" ON public.program_contents
  FOR SELECT USING (
    (is_active = true AND visibility = 'public')
    OR public.is_admin()
    OR (
      is_active = true 
      AND visibility = 'member' 
      AND EXISTS (
        SELECT 1 FROM public.program_access 
        WHERE user_id = auth.uid() 
          AND program_id = program_contents.program_id 
          AND status = 'active'
      )
    )
  );

CREATE POLICY "program_contents_admin_all" ON public.program_contents
  FOR ALL USING (public.is_admin());

-- Vouchers: Authenticated users can view active vouchers for checkout; Admin can manage
CREATE POLICY "vouchers_select_auth" ON public.vouchers
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "vouchers_admin_all" ON public.vouchers
  FOR ALL USING (public.is_admin());

-- Orders & Order Items: User can view own orders; Admin can view all
CREATE POLICY "orders_select_own_or_admin" ON public.orders
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders_admin_all" ON public.orders
  FOR ALL USING (public.is_admin());

CREATE POLICY "order_items_select_own_or_admin" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "order_items_insert_own" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
  );

-- Payment Gateway Configs: Authenticated users can view active configs (for display name/provider); Admin can manage
CREATE POLICY "payment_configs_select_auth" ON public.payment_gateway_configs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "payment_configs_admin_all" ON public.payment_gateway_configs
  FOR ALL USING (public.is_admin());

-- Payments: User can view payments for own orders; Admin can view all
CREATE POLICY "payments_select_own_or_admin" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = payments.order_id 
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

-- Program Access: User can view own active program access; Admin can view all
CREATE POLICY "program_access_select_own_or_admin" ON public.program_access
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "program_access_admin_all" ON public.program_access
  FOR ALL USING (public.is_admin());

-- Voucher Redemptions: User can view own redemptions; Admin can view all
CREATE POLICY "voucher_redemptions_select_own_or_admin" ON public.voucher_redemptions
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- Certificates: User can view own certificates; Admin can manage all
CREATE POLICY "certificates_select_own_or_admin" ON public.certificates
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "certificates_admin_all" ON public.certificates
  FOR ALL USING (public.is_admin());

-- Announcements & CMS Sections: Public read, Admin manage
CREATE POLICY "announcements_select_public" ON public.announcements
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "announcements_admin_all" ON public.announcements
  FOR ALL USING (public.is_admin());

CREATE POLICY "cms_sections_select_public" ON public.cms_sections
  FOR SELECT USING (true);

CREATE POLICY "cms_sections_admin_all" ON public.cms_sections
  FOR ALL USING (public.is_admin());

-- 19. INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON public.programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_category_id ON public.programs(category_id);
CREATE INDEX IF NOT EXISTS idx_programs_status ON public.programs(status);
CREATE INDEX IF NOT EXISTS idx_program_contents_program_id ON public.program_contents(program_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON public.vouchers(code);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_transaction_id ON public.payments(provider_transaction_id);
CREATE INDEX IF NOT EXISTS idx_program_access_user_id ON public.program_access(user_id);
CREATE INDEX IF NOT EXISTS idx_program_access_program_id ON public.program_access(program_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_program_id ON public.certificates(program_id);
