---
name: lint-fix
description: Run ESLint (Airbnb config) across the repo, automatically fix auto-fixable issues, and resolve or report anything that's left.
---

Run this skill when the user asks to lint the project, fix lint errors, or clean up code style.

1. Run `npm run lint:fix` from the repo root. This applies ESLint's automatic
   fixes (formatting, import order, etc.) across `backend/`, `frontend/`, and
   `shared/`.
2. Run `npm run lint` again to see what ESLint could not fix automatically.
3. For each remaining error or warning, open the referenced file and apply a
   manual fix consistent with the Airbnb style guide and the surrounding
   code's conventions. Do not disable rules to silence a finding unless the
   rule genuinely doesn't apply (e.g. a false positive) — explain why in a
   comment if you do.
4. Repeat steps 2-3 until `npm run lint` exits clean, or until the remaining
   issues require a product/design decision the user should make (e.g. a
   line that can't be shortened without changing behavior).
5. Summarize what was fixed automatically vs. manually vs. left for the user,
   with file:line references.
