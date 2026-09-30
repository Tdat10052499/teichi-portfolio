const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf8');

css = css.replace(/font-size:\s*40px;/g, 'font-size: clamp(28px, 6vw, 40px);');

// h1
css = css.replace(/font-size:\s*clamp\(64px,\s*7\.8vw,\s*124px\);/g, 'font-size: clamp(40px, 11vw, 124px);');
css = css.replace(/h1\s*\{\s*font-size:\s*8\.5vw;?\s*\}/g, '');
css = css.replace(/h1\s*\{\s*font-size:\s*14vw;\s*letter-spacing:\s*-0\.07em;\s*\}/g, 'h1 { letter-spacing: -0.07em; }');
css = css.replace(/h1\s*\{\s*font-size:\s*13\.4vw;\s*\}/g, '');

// dialog
css = css.replace(/width:\s*min\(690px,\s*90vw\);/g, 'width: min(690px, 92vw);\n  overflow-y: auto;');

// mascot
css = css.replace(/bottom:\s*9px;/g, 'bottom: max(9px, env(safe-area-inset-bottom));');
css = css.replace(/bottom:\s*16px;/g, 'bottom: max(16px, env(safe-area-inset-bottom));');

// typo clamp
css = css.replace(/font-size:\s*58px;/g, 'font-size: clamp(32px, 8vw, 58px);');
css = css.replace(/\.paper\s*h3\s*\{\s*font-size:\s*50px;\s*\}/g, '');
css = css.replace(/\.paper\s*h3\s*\{\s*font-size:\s*51px;\s*\}/g, '');

css = css.replace(/font-size:\s*110px;/g, 'font-size: clamp(60px, 15vw, 110px);');
css = css.replace(/\.pass-year\s*\{\s*font-size:\s*95px;\s*\}/g, '');
css = css.replace(/\.pass-year\s*\{\s*font-size:\s*90px;\s*\}/g, '');

css = css.replace(/font-size:\s*44px;/g, 'font-size: clamp(28px, 8vw, 44px);');
css = css.replace(/\.research-copy\s*h3\s*\{\s*font-size:\s*36px;\s*\}/g, '');

css = css.replace(/font-size:\s*39px;/g, 'font-size: clamp(28px, 8vw, 39px);');
css = css.replace(/\.hack-pass\s*h3\s*\{\s*font-size:\s*32px;\s*\}/g, '');
css = css.replace(/\.hack-pass\s*h3\s*\{\s*font-size:\s*33px;\s*margin-top:\s*150px;\s*\}/g, '.hack-pass h3 { margin-top: 150px; }');

css = css.replace(/font-size:\s*clamp\(70px,\s*10vw,\s*150px\);/g, 'font-size: clamp(40px, 12vw, 150px);');

fs.writeFileSync('src/app/globals.css', css);

let nedCss = fs.readFileSync('src/app/projects/ned-wallet/ned.css', 'utf8');

nedCss = nedCss.replace(/font-size:\s*clamp\(52px,\s*5\.8vw,\s*88px\);/g, 'font-size: clamp(36px, 9vw, 88px);');
nedCss = nedCss.replace(/font-size:\s*clamp\(36px,\s*4\.5vw,\s*64px\);/g, 'font-size: clamp(28px, 7vw, 64px);');

nedCss = nedCss.replace(/font-size:\s*140px;/g, 'font-size: clamp(60px, 15vw, 140px);');
nedCss = nedCss.replace(/font-size:\s*30px;/g, 'font-size: clamp(20px, 6vw, 30px);');

nedCss = nedCss.replace(/padding:\s*18px;/g, 'padding: clamp(10px, 3vw, 18px);');
nedCss = nedCss.replace(/grid-template-columns:\s*120px\s*1fr;/g, 'grid-template-columns: 100px 1fr;');
nedCss = nedCss.replace(/width:\s*120px\s*!important;/g, 'width: 100px !important;');

fs.writeFileSync('src/app/projects/ned-wallet/ned.css', nedCss);
console.log('Done');
