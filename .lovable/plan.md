# Integrasi Penuh Supabase — CBT Exam App

## Summary

Migrasi seluruh data dari `localStorage` ke Supabase database, implementasi auth dengan Supabase Auth, tambah register untuk user, dan tambah modul kelola user di admin.

🚨 **Perubahan utama:**

- Semua operasi CRUD **tidak lagi langsung ke Supabase DB dari frontend**
- Seluruh logic backend dipusatkan di **Supabase Edge Functions**
- Edge Functions bertindak sebagai **API layer (BFF / Backend-for-Frontend)**

👉 Ini membuat:

- Security lebih kuat (tidak expose schema langsung)
- Logic lebih scalable & maintainable
- Mudah tambah validasi, logging, dan business rules

## 1. Database Schema (Migration)

```sql
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Profiles table (auto-created on signup)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '📝',
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL
);

-- Question packages
CREATE TABLE public.question_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  duration INTEGER DEFAULT 30,
  target_questions INTEGER,
  period_label TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Questions (in packages)
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.question_packages(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INTEGER NOT NULL DEFAULT 0,
  explanation TEXT
);

-- Bank questions (global)
CREATE TABLE public.bank_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INTEGER NOT NULL DEFAULT 0,
  explanation TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  tags TEXT[] DEFAULT '{}'
);

-- Exam results
CREATE TABLE public.exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  package_id UUID REFERENCES public.question_packages(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  answers JSONB DEFAULT '{}',
  date DATE DEFAULT CURRENT_DATE
);

-- Security definer function for role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Trigger: auto-create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), NEW.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**RLS Policies:**

- `profiles`: users read own, admins read all
- `user_roles`: users read own, admins CRUD all
- `categories`: everyone reads, admins CRUD
- `question_packages`: everyone reads published, admins CRUD all
- `questions`: everyone reads (via published package), admins CRUD
- `bank_questions`: admins only
- `exam_results`: users read/insert own, admins read all

## 2. Edge Function: `seed-admin`

Creates the initial admin account. Called once to set up the admin user.

- Creates user via Supabase Admin API (service role key)
- Email: `admin@cbt.com`, Password: `admin123456`
- Inserts admin role into `user_roles`
- Seeds dummy categories and sample data

## 3. Edge Function: `admin-api`

Handles admin-only operations that require service role:

- `POST /admin-api` with action parameter
- Actions: `list-users`, `update-user-role`, `delete-user`
- Validates caller is admin via JWT + `has_role()` check

## 4. Frontend Changes

### Auth System

- **Remove** dummy login from `AppContext`
- **New** `src/contexts/AuthContext.tsx` — Supabase Auth state management with `onAuthStateChange`, profile + role fetching
- **Update** `LoginPage.tsx` — use `supabase.auth.signInWithPassword()`
- **New** `RegisterPage.tsx` — user registration with name, email, password via `supabase.auth.signUp()` with metadata

### Data Layer

- **New** `src/hooks/useCategories.ts` — React Query hooks for categories CRUD
- **New** `src/hooks/usePackages.ts` — React Query hooks for packages CRUD
- **New** `src/hooks/useQuestions.ts` — React Query hooks for questions CRUD
- **New** `src/hooks/useBankQuestions.ts` — React Query hooks for bank questions CRUD
- **New** `src/hooks/useExamResults.ts` — React Query hooks for results
- **New** `src/hooks/useUsers.ts` — React Query hook for admin user management (calls edge function)

### Updated Pages (all pages switch from AppContext to Supabase hooks)

- All admin CRUD pages: use React Query mutations instead of localStorage
- All user pages: fetch from Supabase instead of context
- `ExamPage`: submit results to Supabase
- `HistoryPage`: query results from Supabase

### New Admin Page

- **New** `src/pages/admin/UserManagement.tsx` — list all users, change roles, delete users
- Add route `/admin/users` and sidebar menu item "Kelola User" (Users icon)

### Routing

- Add `/register` route
- Add `/admin/users` route

## 5. Admin Account (Ready to Use)

After seeding:

- **Email:** `admin@cbt.com`
- **Password:** `admin123456`
- **Role:** admin

## Technical Notes

- All localStorage persistence removed
- `AppContext` becomes `AuthContext` (auth state only)
- Data operations move to individual React Query hooks per entity
- Edge functions handle admin-privileged operations
- RLS ensures data security at database level
- Dummy data seeded via edge function on first setup