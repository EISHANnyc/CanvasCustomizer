const fs = require('fs');
let css = fs.readFileSync('content/theme.css', 'utf8');

css = css.replace('html.vibe-theme-dark body.ic-dashboard-app #right-side .Button--block {\n  max-width: 290px !important;\n  margin-left: auto !important;\n  margin-right: auto !important;\n}', 
'/* Dynamically scale buttons or put them side-by-side on big monitors */\n@media (min-width: 1650px) {\n  html.vibe-theme-dark body.ic-dashboard-app #right-side .Button--block {\n    width: calc(50% - 6px) !important;\n    display: inline-flex !important;\n    margin: 4px 3px !important;\n  }\n}\n@media (max-width: 1649px) {\n  html.vibe-theme-dark body.ic-dashboard-app #right-side .Button--block {\n    width: 100% !important;\n    max-width: 100% !important;\n    margin-bottom: 8px !important;\n  }\n}');

fs.writeFileSync('content/theme.css', css);
console.log('Fixed buttons to be side-by-side on big screens and 100% on small screens');
