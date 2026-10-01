const fs = require('fs');
let css = fs.readFileSync('content/theme.css', 'utf8');

css = css.replace('@media (max-width: 1450px) {', '@media (max-width: 1650px) {');

fs.writeFileSync('content/theme.css', css);
console.log('Fixed breakpoint');
