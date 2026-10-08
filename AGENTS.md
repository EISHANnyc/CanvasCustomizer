# CanvasCustomizer Workspace Directives

## Hard Anti-Looping Execution Gate
- **Single-Pass Edits**: NEVER crawl files in tiny 20-30 line slices (`L3170-3220`, `L4350-4400`, etc.).
- **Search Once, Edit Once**: Use `grep` or search for the exact selector/function name once, view that block, apply `replace_file_content`, and STOP.
- **Max 2 Reads per File**: Never inspect the same file more than 2 times in one turn.
- **Post-Edit Freeze**: After calling `replace_file_content`, STOP immediately. Do NOT re-read or verify lines afterwards. Deliver the deliverable.
- **Extension Version Bumping**: When editing extension code, bump the semver version in `manifest.json` in that same pass. Never run zip scripts or background packaging.
- **No Background Command Stalls**: Apply edits directly with native editing tools. Never run throwaway patch scripts or wait on background timeouts.

## User Pet Peeves & Annoyances (Do NOT Repeat)

### 1. AI Slop & Marketing Jargon
- Never write corporate marketing copy, fluffy bullet points, or pretentious descriptions in READMEs or UI.
- No cheesy emojis, badges, or fake hype ("vibe out", "seamlessly crafted", "curated palettes").
- Keep README text blunt, short, and plain English. If it sounds like ChatGPT wrote it, delete it.

### 2. Big Screen vs. Small Screen Breakages
- When tweaking mobile/laptop views, do NOT break or rearrange the desktop/wide view.
- Don't center course cards when they're supposed to stay left-aligned with natural spacing.
- Don't inject ugly tab/switcher bars on desktop just to solve a narrow screen problem.

### 3. Layout & Text Overlap Fails
- Fix alignment right the first time instead of guessing. Check row heights, flex margins, and text widths.
- Never let `%`, `GPA`, and letter grades smash or overlap into each other. If space is tight, show `%` and `GPA` only.
- Document and PDF previews must fit natural reading proportions (portrait-friendly height, capped max-width) — never stretched across the entire screen like an ultra-wide pancake.

### 4. Touching or Overriding User Settings
- Never reset, overwrite, or blow away the user's active background image, custom course covers, or palette without explicit instruction.
- Never re-introduce dead features (like analytics, data tracking, or palette sharing) once removed.

### 5. Clutter & Duplicate Folders
- Never let build scripts spray copies (`CanvasCustomizer1`, `CanvasCustomizer2`, etc.) across the Downloads folder.
- Only keep the primary project folder and a single clean `.zip`. No temp junk left behind.

### 6. Public Repo & Privacy Hygiene
- Never commit user-specific student data, real names, or SFU identifiers to the public GitHub repo.
- For public screenshots and docs, stick to clean, aesthetic, neutral previews (like NYU styling or user-supplied clean assets).

