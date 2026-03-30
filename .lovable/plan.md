

# CBT Exam App — JLPT, JFT, SSW

## Overview
A fully interactive Computer Based Test prototype for Japanese language exams (JLPT, JFT, SSW) with admin and user roles. All data is stored in-memory/localStorage using dummy data — no backend needed.

## Pages & Features

### Shared
- **Login Page** — Role selector (Admin/User) with dummy accounts. Clean, professional login form.

### 👤 User Flow (7 pages)
1. **Dashboard** — Grid of exam categories (JLPT, JFT, SSW) with icons and descriptions
2. **Category Page** — Shows selected category info; for SSW, shows sub-categories (Perawatan Lansia, Pengolahan Makanan, Pertanian)
3. **Period Page** — Lists available periods with active/inactive badges; "Mulai Ujian" button only on active periods
4. **Exam Page** *(core feature)* — Full CBT experience:
   - Question display with multiple choice options
   - Question navigation sidebar (numbered buttons showing answered/unanswered)
   - Timer display
   - Previous/Next navigation
   - Submit confirmation dialog
5. **Result Page** — Score display, correct/wrong count, percentage, pass/fail indicator
6. **History Page** — Table of past exams with category, period, score, and date

### 🛠️ Admin Flow (5 pages)
1. **Admin Dashboard** — Summary cards (total users, questions, exams taken) with simple charts
2. **Category Management** — CRUD table for categories with parent/child support (SSW sub-categories)
3. **Period Management** — CRUD table for periods with active/inactive toggle per category
4. **Question Management** — CRUD for questions with category & period filters; each question has text + 4 options + correct answer
5. **Result Monitoring** — Table of all user results filterable by user, category, period

## Design & UX
- Clean, modern UI using shadcn/ui components
- Sidebar navigation with role-based menu items (admin vs user)
- Responsive layout
- Japanese exam aesthetic — professional, focused, minimal distractions
- Color scheme: Blue primary for trust/focus

## Data Architecture (In-Memory + localStorage)
- Dummy data store with: categories, periods, questions, users, exam results
- Pre-populated with realistic sample questions for each category
- State persists across page refreshes via localStorage
- Context provider for auth state and data management

## Key Behaviors
- Only active periods allow exam access
- Questions are tied to both category and period
- Auto-scoring on submit with instant results
- Exam history saved to localStorage

