# -*- coding: utf-8 -*-
import re

css_path = r'C:\Users\eisha\Downloads\CanvasCustomizer\content\theme.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Add strong media query for smaller screens so right-side-wrapper expands
strong_mq = '''
@media (max-width: 1650px) {
  /* Let the duo container span the full width of the screen (up to 1160px) when dropped to the bottom */
  body #right-side-wrapper:has(.vibe-sidebar-duo),
  body.responsive_student_grades_page #right-side-wrapper:has(.vibe-sidebar-duo) {
    width: 100% !important;
    max-width: 1160px !important;
    min-width: 0 !important;
    flex: 1 1 100% !important;
    margin: 20px auto 40px auto !important;
  }

  /* Make the buttons span 50% each instead of 100% if they are side-by-side, OR span 100%?
     Wait, if max-width is 1160px, spanning 100% makes them 1160px wide. 
     Let's make them span 50% so they sit neatly side-by-side under the two columns! */
  html.vibe-theme-dark .vibe-dashboard-page #right-side .button-sidebar-wide, 
  html.vibe-theme-dark #not_right_side:has(.vibe-sidebar-duo) #right-side .button-sidebar-wide,
  body #right-side-wrapper:has(.vibe-sidebar-duo) #right-side .button-sidebar-wide {
    width: calc(50% - 8px) !important;
    display: inline-flex !important;
    margin: 4px !important;
  }
}

/* Stack everything cleanly on actual mobile */
@media (max-width: 768px) {
  html.vibe-theme-dark .vibe-dashboard-page #right-side .button-sidebar-wide, 
  html.vibe-theme-dark #not_right_side:has(.vibe-sidebar-duo) #right-side .button-sidebar-wide,
  body #right-side-wrapper:has(.vibe-sidebar-duo) #right-side .button-sidebar-wide {
    width: 100% !important;
    display: flex !important;
    margin: 4px 0 !important;
  }
}
'''

css = css + '\n' + strong_mq

# But wait, in the existing CSS I have @media (max-width: 1650px) that sets button to 100%.
# Let's just remove that old rule to avoid conflicts.
css = css.replace('''    width: 100% !important;
    display: flex !important;
    margin: 4px 0 !important;''', '''    /* OVERRIDDEN AT END OF FILE */''')

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("Injected dynamic CSS")
