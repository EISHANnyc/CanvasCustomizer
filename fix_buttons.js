const fs = require('fs');
let css = fs.readFileSync('content/theme.css', 'utf8');

if (!css.includes('body.ic-dashboard-app #right-side .Button--block')) {
    css += '\n/* Lock native right-sidebar buttons on dashboard from stretching to 560px */\nhtml.vibe-theme-dark body.ic-dashboard-app #right-side .Button--block {\n  max-width: 290px !important;\n  margin-left: auto !important;\n  margin-right: auto !important;\n}\n';
    fs.writeFileSync('content/theme.css', css);
    console.log('Fixed button width');
}
