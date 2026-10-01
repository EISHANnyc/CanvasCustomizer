# -*- coding: utf-8 -*-
css_path = r'C:\Users\eisha\Downloads\CanvasCustomizer\content\theme.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Let's see if .vibe-sidebar-duo > .vibe-feed-card has flex: 1 1 50%
if '.vibe-sidebar-duo > .vibe-feed-card' not in css:
    css += '''
.vibe-sidebar-duo > .vibe-feed-card {
    flex: 1 1 calc(50% - 7px) !important;
    width: calc(50% - 7px) !important;
    max-width: calc(50% - 7px) !important;
    min-width: 0 !important;
}
'''
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("Added flex sizing to duo cards.")
else:
    print("Already has duo card sizing?")
