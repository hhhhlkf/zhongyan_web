# AGENTS.md

## Project Summary

- Repo name: `zhongyan_web`
- Package name: `spacelab`
- Stack: `Vue 3`, `Vite 4`, `Vue Router 4`, `Pinia`, `Element Plus`
- Package manager: `pnpm`
- Main app shape: admin frontend with dashboard, map, and big-screen modules

## Common Commands

- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Build for prod: `pnpm build:prod`
- Build for staging: `pnpm build:stage`
- Preview build: `pnpm preview`

## Directory Guide

- `src/main.js`: app bootstrap
- `src/App.vue`: root component
- `src/router`: route config
- `src/store`: Pinia stores
- `src/views`: page-level views
- `src/components`: shared components
- `src/api`: request wrappers by business area
- `src/utils`: utility helpers
- `src/layout`: shell and layout components
- `src/assets`: static assets imported by source code
- `public`: public runtime assets and config
- `vite/plugins`: Vite plugin setup

## Working Rules

- Follow the existing folder structure and naming style.
- Prefer small, local changes over broad refactors.
- Reuse existing components, utils, and API wrappers before adding new ones.
- Put new request logic under the matching `src/api` module instead of inside views.
- When adding pages, keep them aligned with the current `src/views` structure and wire routes deliberately.
- Treat `src/permission.js`, `src/settings.js`, `src/router`, and `src/layout` as global-impact areas.
- For map, big-screen, and 3D features, extend the current modules before introducing new parallel structures.

## Coding Notes

- The codebase is mostly `JavaScript + Vue SFC`, with a small amount of `TypeScript`.
- Match the style of the directory you are editing.
- Prefer the existing alias import style such as `@/`.
- Keep styling changes consistent with the current `scss` organization.
- Avoid moving or renaming heavy static assets such as images, fonts, models, and big-screen resources unless required.
- Some legacy files appear to have encoding issues; avoid unrelated rewrites that may change file encoding.

## Validation

- Validate the affected flow with at least a local run or build when practical.
- Call out any changes that affect routing, permissions, global settings, or build behavior.
- If validation is skipped, state that clearly in the handoff.

## Tips For Future Agents

- Read `package.json`, the target module entry, and nearby files before editing.
- For big-screen or map tasks, search these paths first:
- `src/views/bigScreen`
- `src/components/map`
- `src/utils/map`
- `src/components/MarsWork`
- For documentation-only tasks, keep the change minimal and avoid unrelated formatting churn.
- 在关键修改上加上注释，关键修改包括影响代码核心逻辑的部分。
