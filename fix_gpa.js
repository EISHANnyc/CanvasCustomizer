const fs = require('fs');
let t = fs.readFileSync('content/theme-engine.js', 'utf8');

t = t.replace(/var isNew = !existing;\s*var card = existing \|\| document\.createElement\('div'\);/g, 
  "var card = document.getElementById('vibe-gpa-school-card') || document.createElement('div');\n        var isNew = !card.parentNode;");

fs.writeFileSync('content/theme-engine.js', t);
console.log('Fixed GPA dupes');
