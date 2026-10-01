# -*- coding: utf-8 -*-
css_path = r'C:\Users\eisha\Downloads\CanvasCustomizer\content\theme.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Add an absolute override at the very bottom
css += '''
/* =========================================================
   Final Button Layout Fix
   Force the buttons to always stretch correctly and look clean.
   ========================================================= */
#right-side .button-sidebar-wide,
#right-side .btn.button-sidebar-wide,
#right-side a.button-sidebar-wide,
body #right-side-wrapper:has(.vibe-sidebar-duo) #right-side .button-sidebar-wide,
html.vibe-theme-dark #not_right_side:has(.vibe-sidebar-duo) #right-side .button-sidebar-wide {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 8px 0 !important;
    flex: 1 1 100% !important;
}

@media (min-width: 1200px) {
    /* If there is a dual column, make the buttons span across the whole dual column nicely */
    body #right-side-wrapper:has(.vibe-sidebar-duo) #right-side .button-sidebar-wide {
        width: 100% !important;
        max-width: 1160px !important;
        margin: 8px auto !important;
    }
}
'''

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("Applied fix!")
