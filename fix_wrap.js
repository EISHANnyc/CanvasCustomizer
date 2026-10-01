const fs = require('fs');
let css = fs.readFileSync('content/theme.css', 'utf8');

// Ensure #main cannot exceed 100% of the viewport, forcing flex-wrap to occur
if (!css.includes('body.ic-dashboard-app #main {\n  max-width: 100vw !important;')) {
    css += '\n/* Force wrapping when screen is too small */\nbody.ic-dashboard-app #main,\nbody.vibe-has-sidebar-duo #main {\n  max-width: 100% !important;\n  width: 100% !important;\n  overflow-x: hidden !important;\n}\n';
    fs.writeFileSync('content/theme.css', css);
    console.log('Fixed wrap bounds');
}
