# -*- coding: utf-8 -*-
import re

js_path = r'C:\Users\eisha\Downloads\CanvasCustomizer\content\theme-engine.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace('group.header.text', 'group.header.label')
js = js.replace('?Week', ' Week')
js = js.replace('?Homework', ' Homework')
js = js.replace('?Syllabus', ' Syllabus')
js = js.replace('?Quiz', ' Quiz')

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print('Fixed header text and question marks')
