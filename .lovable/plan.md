

# Modul Bank Soal untuk Admin

## Overview
Menambahkan **Bank Soal** sebagai entitas global tempat admin menyimpan soal-soal yang bisa dipakai ulang di berbagai paket. Saat menambahkan soal ke paket, admin bisa memilih dari bank soal **atau** input biasa (manual/JSON/CSV).

## Data Model

**New type: `BankQuestion`** — soal global tanpa `packageId`, tapi punya `categoryId` dan tags.

```text
BankQuestion {
  id, text, options[], correctAnswer, explanation?,
  categoryId, tags[]  // e.g. ["N5", "文法", "kaigo"]
}
```

## Changes

### 1. `src/lib/types.ts`
- Add `BankQuestion` interface

### 2. `src/lib/dummy-data.ts`
- Add `dummyBankQuestions` (~15 sample questions across categories with tags)

### 3. `src/contexts/AppContext.tsx`
- Add `bankQuestions` state with localStorage persistence
- Add CRUD: `addBankQuestion`, `updateBankQuestion`, `deleteBankQuestion`
- Add helper: `getBankQuestionsByCategory`

### 4. New: `src/pages/admin/QuestionBank.tsx`
Admin page for managing the bank soal:
- Table of all bank questions with category filter + tag filter
- Add/edit question modal (same manual form)
- Import via JSON/CSV (same as PackageQuestions but saves to bank)
- Bulk delete with checkbox selection
- Search/filter by text

### 5. Update: `src/pages/admin/PackageQuestions.tsx`
Add a 4th tab **"Bank Soal"** in the add-question dialog:
- Shows searchable list of bank questions (filtered by package's category)
- Checkbox multi-select
- "Tambah X Soal dari Bank" button
- Selected bank questions get copied into the package as regular `Question` entries

### 6. `src/components/AppSidebar.tsx`
- Add "Bank Soal" menu item for admin (icon: `Database`), linking to `/admin/bank`

### 7. `src/App.tsx`
- Add route `/admin/bank` → `QuestionBank`

## UX Flow
1. Admin goes to **Bank Soal** → adds/imports questions globally with tags
2. Admin creates a package → goes to **Manage Questions**
3. In the "Tambah Soal" dialog, picks the **Bank Soal** tab
4. Searches/filters questions → selects with checkboxes → adds to package
5. Questions are copied (not linked) — editing in package doesn't affect bank

