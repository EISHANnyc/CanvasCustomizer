# CanvasVibe

A clean, non-bloated Chrome extension that brings dark mode, balanced light themes, modern cards, and live productivity widgets to Canvas LMS.

Built with vanilla JavaScript and pure CSS. Zero telemetry, zero external trackers, zero third-party dependencies.

---

## Highlights

- **Disciplined Themes**: 4 dark modes (including OLED pitch black and warm plum dark) and 4 balanced light themes (warm cream, linen, and soft neutrals). No jarring contrasts.
- **Custom GPA Calculator**: Live dashboard card computing semester and cumulative GPA directly from active Canvas course grades (supporting SFU 4.33 and Standard 4.0 scales). Excludes ungraded or 0% courses automatically.
- **Dual Sidebar Widget**: A clean Tasks & Completed organizer embedded directly into Canvas. Lets you check off tasks, view completed grades, dismiss items, and restore them with one click.
- **Course Card Personalization**: Set custom course nicknames and hero cover photos with built-in crop and zoom controls.
- **Wallpaper & Blur Engine**: Custom background wallpaper support with contextual opacity and blur controls (automatically adjusts between dashboard and reading pages).
- **Surgical Canvas Overrides**: Compact gradebook table formatting, modern rounded cards, themed native dropdowns, and clean segmented filters.

---

## Installation

1. **Download the code**:
   - Clone this repository:
     ```bash
     git clone https://github.com/EISHANnyc/CanvasCustomizer.git
     ```
   - Or download and extract the ZIP from the latest release.

2. **Open Extensions in Chrome**:
   - Go to `chrome://extensions` in your address bar.
   - Enable **Developer mode** using the toggle switch in the top-right corner.

3. **Load the Extension**:
   - Click **Load unpacked**.
   - Select the `CanvasVibe` (or `CanvasCustomizer`) directory.
   - Open [Canvas](https://canvas.sfu.ca) and click the extension icon to customize your layout.

---

## Security & Privacy

CanvasVibe is built strictly for student privacy and performance:

- **Same-Origin Requests Only**: All internal requests use `{ credentials: 'same-origin' }` to communicate only with your authenticated Canvas instance.
- **No Third-Party Traffic**: No analytics, CDNs, or external servers. Your tokens, passwords, and assignments never leave your browser.
- **Sanitized Output**: All dynamic user and course data from the Canvas API is sanitized before rendering to eliminate stored XSS risks.
- **Restricted Scoping**: Permissions are strictly scoped to Canvas domains (`*.instructure.com`, `canvas.sfu.ca`, `*.canvaslms.com`).

---

## License

[MIT](LICENSE) © 2026 Eishan Mohammed
