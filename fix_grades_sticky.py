import re

with open('content/theme.css', 'r', encoding='utf-8') as f:
    css = f.read()

sticky_css = '''
/* Sticky Grades Summary Sidebar */
body.grades #right-side-wrapper,
.ic-app-main-content__secondary {
    position: sticky !important;
    top: 80px !important;
    align-self: flex-start !important;
    max-height: calc(100vh - 100px) !important;
    overflow-y: auto !important;
}

body.grades #right-side,
.grades-page #right-side {
    position: sticky !important;
    top: 80px !important;
}
'''

if 'Sticky Grades Summary Sidebar' not in css:
    css += sticky_css
    with open('content/theme.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Added sticky grades CSS.")
else:
    print("Already added.")
