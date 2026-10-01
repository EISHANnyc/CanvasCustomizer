# -*- coding: utf-8 -*-
import re

js_path = r'C:\Users\eisha\Downloads\CanvasCustomizer\content\theme-engine.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Fix 1: groupGradedItemsByDay should use gradedDateObj
js = js.replace(
    'var d = item.dateObj;',
    'var d = item.gradedDateObj || item.dueDateObj || item.dateObj;'
)

# Fix 2: populateGradedCards should use getUrgencyDetails for timeStr
old_meta = '''<span class="vibe-minimal-date">\' + (item.timeStr || \'Today\') + \'</span>\''''
new_meta = '''<span class="vibe-minimal-date">\' + ((window.getUrgencyDetails ? window.getUrgencyDetails(item.gradedDateObj || item.dueDateObj || item.dateObj, item).label : item.timeStr) || \'Today\') + \'</span>\''''

js = js.replace(old_meta, new_meta)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print('Fixed graded date bugs')
