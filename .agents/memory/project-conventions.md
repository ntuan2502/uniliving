---
type: project
created: 2026-05-25
updated: 2026-05-25
---

# Project Conventions

## Git Workflow
- Always create a new dedicated branch for major code changes.
- Branch name format should follow: `feature/[task-slug]` or `fix/[bug-slug]`.

## Command Usage
- Always use `pnpm` or `pnpx` (or `pnpm dlx`).
- **Forbidden:** Never use `npm` or `npx` commands.

## Import Paths & Aliases
- Always use import aliases (e.g., `@/*` mapping to `src/*`) instead of relative paths (e.g., `../../`) to avoid clutter and path-resolution bugs.

## Code Quality & Verification
- Always run `pnpm lint` after every code change to check for linting or formatting errors before completion.

## TypeScript Types
- Strictly forbid the use of the `any` type in TypeScript files. Always use specific types, generics, or `unknown` where applicable.



