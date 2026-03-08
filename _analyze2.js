const fs = require('fs');
const path = require('path');
const BASE = 'C:/Users/Predator/Desktop/shellfish ubg/games/sz/games';

const files = ['agario.html','air.html','airship.html','backrooms.html','blox.html','bloxx.html',
  'breaking-the-bank.html','chrome-dino.html','chrome.html','diamond.html','dungeon.html',
  'game.html','moter.html','papab.html','papas-B.html','paperio.html','pc-breakdown.html',
  'ridd.html','ridd2.html','ridd3.html','ridd4.html','ridd5.html','ridd6.html','ridd7.html',
  'riddle-school.html','riddle-school2.html','riddle-school3.html','riddle-school4.html',
  'riddle-school5.html','riddle-school6.html','riddle-school7.html',
  'stackk.html','sub.html','tet.html','tetris.html','unity.html',
  'Emulator.html','Flash.html','LTFpk.html'];

files.forEach(f => {
  try {
    const content = fs.readFileSync(path.join(BASE, f), 'utf8');
    const iframeMatch = content.match(/iframe[^>]*src=['"]([^'"]+)['"]/i);
    const embedMatch = content.match(/embed[^>]*src=['"]([^'"]+)['"]/i);
    const objectMatch = content.match(/object[^>]*data=['"]([^'"]+)['"]/i);
    const swfMatch = content.match(/['"]([^'"]*\.swf)['"]/i);

    let gameRef = '';
    if (iframeMatch) gameRef = 'iframe: ' + iframeMatch[1];
    else if (embedMatch) gameRef = 'embed: ' + embedMatch[1];
    else if (objectMatch) gameRef = 'object: ' + objectMatch[1];
    else if (swfMatch) gameRef = 'swf: ' + swfMatch[1];
    else gameRef = 'NO GAME REF FOUND';

    console.log(f + ' => ' + gameRef);
  } catch(e) {
    console.log(f + ' => ERROR: ' + e.message);
  }
});
