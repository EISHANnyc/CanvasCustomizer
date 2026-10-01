# -*- coding: utf-8 -*-
import re

js_path = r'C:\Users\eisha\Downloads\CanvasCustomizer\content\theme-engine.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

old_meta = '''((window.getUrgencyDetails ? window.getUrgencyDetails(item.gradedDateObj || item.dueDateObj || item.dateObj, item).label : item.timeStr) || \'Today\')'''
new_meta = '''(getUrgencyDetails(item.gradedDateObj || item.dueDateObj || item.dateObj, item).label || \'Today\')'''

js = js.replace(old_meta, new_meta)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print('Fixed window.getUrgencyDetails')
