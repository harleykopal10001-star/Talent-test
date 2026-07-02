# TalentDesk Platform Tech Test

## Setup

```
cp .env.example .env
npm i
npm run start-backend
npm run start-frontend
```

## Assignment

We have provided a basic application, where a form submits and the back-end returns what has been submitted.

Make the following changes:

1. Add styling to the form
2. Add selecting a file to the form, this should be stored in a directory in the back-end and the path to the file returned to the front-end on submission. Selecting the file should support drag and drop
3. Add validation to the form
4. Add linting to the application, following AirBnb's linting rules
5. Add front-end and back-end tests to the application

You may add any relevant 3rd party libraries. Please explain why you have chosen them.

## Bonus

Add an AI agent method (e.g. a Claude Code skill) to run linting and automatically fix any issues found

## Implementation notes

### Libraries used & why

- **multer** — the standard `multipart/form-data` middleware for Express; used to store uploaded files on disk under `backend/uploads/` and expose them at `/uploads/<filename>`.
- **react-dropzone** — well-maintained, accessible drag-and-drop file input; handles drag events, click-to-browse, and file type/size rejection out of the box instead of hand-rolling a drag/drop state machine.
- **zod** — schema validation. The same schema (`shared/submissionSchema.js`) is imported by both the frontend and backend so validation rules (min/max length, accepted file types, max file size) live in exactly one place.
- **react-hook-form** + **@hookform/resolvers** — connects the zod schema to the form with minimal re-renders and boilerplate, and gives per-field error state for free.
- **ESLint 8** + **eslint-config-airbnb** (`airbnb`/`airbnb/hooks` for the frontend, `airbnb-base` for the backend) — enforces the Airbnb style guide. ESLint is pinned to v8 because `eslint-config-airbnb` doesn't yet support ESLint 9's flat config format.
- **Vitest** + **@testing-library/react** + **@testing-library/user-event** — frontend tests. Vitest reuses the existing Vite config and is fast/ESM-native.
- **Jest** + **supertest** + **babel-jest** — backend tests. `supertest` drives the exported Express `app` in-process (no port binding needed); `babel-jest` lets Jest load the project's native ESM source without Node flags.

### Commands

```
npm run lint         # lint the whole repo
npm run lint:fix      # lint and auto-fix
npm run test          # run frontend (Vitest) + backend (Jest) test suites
npm run test:frontend
npm run test:backend
```

### File uploads

Uploaded files are validated server-side (type: PNG/JPEG/PDF, size: up to 5MB) and written to `backend/uploads/` with a randomised filename to avoid collisions and path traversal. The directory is git-ignored aside from a `.gitkeep` placeholder.

### Bonus: lint-fix skill

`.claude/skills/lint-fix/SKILL.md` defines a Claude Code skill that runs `npm run lint:fix`, re-lints, and resolves (or reports) anything that couldn't be auto-fixed.
