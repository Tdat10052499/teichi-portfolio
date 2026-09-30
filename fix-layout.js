const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf8');

const pad = 'max(clamp(20px, 4vw, 96px), calc((100% - 1760px) / 2))';

// Add p max-width
if (!css.includes('p {\\n  max-width: 70ch;\\n}')) {
  css = css.replace(/body\s*\{/, 'p { max-width: 70ch; }\nbody {');
}

// Remove the 1600px max-width media query
css = css.replace(/@media\s*\(min-width:\s*1600px\)\s*\{\s*main,\s*header,\s*footer\s*\{\s*max-width:\s*1600px;\s*margin-left:\s*auto;\s*margin-right:\s*auto;\s*\}\s*\}/g, '');

// Update padding/margin to fluid layout with center alignment
css = css.replace(/margin:\s*0\s*5%;/g, 'margin: 0; padding-inline: ' + pad + ';');
css = css.replace(/padding:\s*43px\s*5%\s*0;/g, 'padding: 43px ' + pad + ' 0;');
css = css.replace(/padding:\s*110px\s*5%;/g, 'padding: 110px ' + pad + ';');

// Overrides fixes
css = css.replace(/padding:\s*35px\s*0;/g, 'padding: 35px ' + pad + ';');
css = css.replace(/padding:\s*12px\s*0;/g, 'padding: 12px ' + pad + ';');
css = css.replace(/padding:\s*17px\s*0;/g, 'padding: 17px ' + pad + ';');

// Clamping mascot stage
css = css.replace(/(\.mascot-stage\s*\{[^}]*width:\s*)47%;/g, '$1clamp(350px, 47%, 700px);');
css = css.replace(/(\.mascot-stage\s*\{[^}]*right:\s*)1%;/g, '$1max(1%, calc((100% - 1760px) / 2));');
// tablet replace for mascot stage
css = css.replace(/(\.mascot-stage\s*\{[^}]*right:\s*)-7%;([^}]*width:\s*)52%;/g, '$1-7%;$2clamp(350px, 52%, 700px);');

// Max width for hero copy
css = css.replace(/(\.hero-copy\s*\{[^}]*width:\s*75%;)/g, '$1 max-width: 900px;');
css = css.replace(/(\.hero-copy\s*\{[^}]*width:\s*78%;)/g, '$1 max-width: 900px;');

// Align decorative elements
css = css.replace(/(\.contact-star\s*\{[^}]*right:\s*)12%;/g, '$1max(12%, calc((100% - 1760px) / 2));');
css = css.replace(/(\.network\s*\{[^}]*right:\s*)7%;/g, '$1max(7%, calc((100% - 1760px) / 2));');

fs.writeFileSync('src/app/globals.css', css);

let nedCss = fs.readFileSync('src/app/projects/ned-wallet/ned.css', 'utf8');
if (!nedCss.includes('p {\\n  max-width: 70ch;')) {
  nedCss = nedCss.replace(/p\s*\{\s*line-height:\s*1\.7;/, 'p { max-width: 70ch; line-height: 1.7;');
}
nedCss = nedCss.replace(/padding:\s*0\s*6vw;/g, 'padding: 0 ' + pad + ';');
nedCss = nedCss.replace(/padding:\s*100px\s*7vw;/g, 'padding: 100px ' + pad + ';');
nedCss = nedCss.replace(/padding:\s*65px\s*6vw;/g, 'padding: 65px ' + pad + ';');
fs.writeFileSync('src/app/projects/ned-wallet/ned.css', nedCss);
