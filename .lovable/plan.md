

# Refactor: Period → Package-based CBT System

## Summary

Major architectural shift: replace **Period as access gate** with **Question Package** as the core entity. Period becomes an optional label/tag. Add step-based package creation, rich question management with bulk actions, and 3 input methods (manual, JSON paste, CSV import).

## Data Model Changes

**New entity: `QuestionPackage`**
```text
QuestionPackage {
  id, name, description, categoryId,
  duration (minutes), targetQuestions (optional),
  periodLabel (optional string), // e.g. "JFT April 2026"
  isPublished (boolean), // draft mode support
  createdAt
}
```

**Question** — change `periodId` → `packageId`. Add optional `explanation` field for pembahasan.

**ExamResult** — change `periodId` → `packageId`.

**Period entity** — removed entirely. Replaced by `periodLabel` string on package.

## Files to Change

### 1. `src/lib/types.ts`
- Remove `Period` interface
- Add `QuestionPackage` interface
- Update `Question`: replace `periodId`/`categoryId` with `packageId`, add `explanation`
- Update `ExamResult`: replace `periodId` with `packageId`

### 2. `src/lib/dummy-data.ts`
- Remove `dummyPeriods`
- Add `dummyPackages` with realistic data (mapped from old periods)
- Update `dummyQuestions` to reference `packageId`
- Update `dummyResults`

### 3. `src/contexts/AppContext.tsx`
- Remove period CRUD, add package CRUD (`addPackage`, `updatePackage`, `deletePackage`)
- Update helpers: `getPackagesByCategory`, `getQuestionsByPackage`
- Remove `getPeriodsByCategory`

### 4. Admin Pages

**Remove:** `src/pages/admin/PeriodManagement.tsx`

**New:** `src/pages/admin/PackageCreate.tsx` — 3-step wizard:
- Step 1: Name, category, description
- Step 2: Duration, target questions, optional period label, draft/publish toggle
- Step 3: Summary → redirect to Manage Questions

**New:** `src/pages/admin/PackageQuestions.tsx` — Question management within a package:
- Package info header with question counter (e.g. "10 / 50 soal")
- Question list with checkboxes for bulk select
- Sticky bottom action bar on selection (delete selected, duplicate)
- 3 input methods via tabs/modal:
  - **Manual form**: question + options A–E + correct answer + explanation
  - **Paste JSON**: textarea with validation + preview
  - **Import CSV**: file upload with table preview before confirm
- Duplicate question button per row

**Update:** `src/pages/admin/QuestionManagement.tsx` → becomes package list view (grid of packages with edit/manage links)

**Update:** `src/pages/admin/AdminDashboard.tsx` — replace period references with package counts

**Update:** `src/pages/admin/CategoryManagement.tsx` — no period references

**Update:** `src/pages/admin/ResultMonitoring.tsx` — show package name instead of period

### 5. User Pages

**Update:** `src/pages/user/UserDashboard.tsx` — show "Trending" section for packages with period labels, then "Semua Paket" section

**Update:** `src/pages/user/CategoryPage.tsx`
- Remove period listing with active/inactive gate
- Show all published packages for the category
- All packages are accessible (no active/inactive restriction)
- Packages with `periodLabel` get a highlight badge

**Update:** `src/pages/user/ExamPage.tsx` — load questions by `packageId` instead of `categoryId + periodId`

**Update:** `src/pages/user/ResultPage.tsx` — show package name

**Update:** `src/pages/user/HistoryPage.tsx` — show package name instead of period

### 6. Routing & Sidebar

**`src/App.tsx`:**
- Remove `/admin/periods` route
- Add `/admin/packages/new` → PackageCreate
- Add `/admin/packages/:packageId/questions` → PackageQuestions
- Change exam route to `/exam/:packageId`

**`src/components/AppSidebar.tsx`:**
- Replace "Periode" menu item with "Paket Soal" linking to `/admin/questions`

## UX Highlights

- **Draft mode**: packages can be saved without questions, only published ones visible to users
- **Question counter**: shows progress toward target (e.g. "10 / 50 soal")
- **Bulk actions**: Gmail-style checkbox select with sticky bottom bar
- **3 input methods**: manual, JSON paste, CSV import — all within the package context
- **Duplicate question**: one-click clone per question row
- **Period as label**: optional tag that boosts visibility ("Trending" section) but never blocks access

