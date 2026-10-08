# CanvasCustomizer Workspace Directives

## CRITICAL EXECUTION GATE (ZERO-TOLERANCE OVERRIDE)

### 1. Subagent Lockdown & File Analysis Ban
- **No Blind Subagents**: Subagents must NEVER be spawned with generic exploration prompts. Every subagent prompt MUST contain: (1) EXACT file path, (2) EXACT symbol or line range, (3) explicit time limit given by the main agent (e.g. "Budget: 25s"), (4) instruction: "Do not explore. Edit target directly."
- **Hard 2-Tool Budget**: Subagents have a hard cap of 2 tool calls total (1 view/grep, 1 edit). Exploration loops and crawling are strictly banned.
- **Never Spawn for Single-File**: For UI, CSS, or single-file bug fixes, NEVER spawn subagents. The main model must do it directly in one pass.

### 2. Hard Anti-Looping & Speedrun Game
- **Target Time**: State target time first (e.g. 30s for quick bug, 90s for multi-file). If user gave a time (e.g. "do this in 20s"), user's time strictly overrides.
- **Search Once, Edit Once**: Use grep/search once, view target block once, edit, done. NEVER crawl files in 20-30 line slices or inspect the same file >2x.
- **Post-Edit Freeze**: After calling `replace_file_content` or `write_to_file`, STOP immediately. NEVER re-read or verify lines afterwards. Deliver immediately.
- **Scorecard**:
  - If beat target: Conclude with `[Time: <actual_time> | Target: <target_time>]`.
  - If missed target: Conclude with `[Time: <actual_time> | Missed (<target_time>)]` + 1-sentence Post-Mortem on the bottleneck, and log to memory.

## User Pet Peeves & Annoyances
1. **AI Slop & Marketing Jargon**: Never write corporate marketing copy, fluffy bullet points, or pretentious descriptions.
2. **Big Screen vs. Small Screen**: Do NOT break desktop/wide view when tweaking mobile/laptop views.
3. **Layout & Text Overlap**: Never let %, GPA, and letter grades smash into each other.
4. **Never Override User Settings**: Never reset custom course covers, background images, or palettes.
5. **No Clutter Folders**: Never let build scripts spray copies across Downloads.
6. **Privacy Hygiene**: Never commit real student data, names, or SFU identifiers.
