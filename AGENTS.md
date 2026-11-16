# CanvasCustomizer Workspace Directives (Chrome MV3)

## 1. Stack & Architecture
- **Target**: Chrome MV3 Extension in root (`manifest.json`, `content/`, `popup/`).
- **Version Discipline**: Automatically bump `manifest.json` patch version on code edits (`v1.x.x`).
- **No Background Packaging**: Never run zip archive scripts or copy to `CanvasCustomizer1` unless explicitly ordered.

## 2. Guardrails & Canvas Traps
- **Multi-Screen Safety**: Never break desktop/wide view when tuning laptop/mobile layouts.
- **Badge Collision**: Never let % completion, GPA, and letter grade pill badges overlap or clip.
- **Persistent User Settings**: Never wipe or override custom course covers, background image URLs, or user-selected color palettes.
- **Privacy Hygiene**: Never commit real SFU student names, IDs, or raw Canvas auth tokens.
- **File Integrity**: `content/theme-engine.js` is massive; use surgical targeted edits, never blind file rewrites.
