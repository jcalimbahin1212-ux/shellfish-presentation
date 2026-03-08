const fs = require('fs');
const path = require('path');

const BASE = 'C:/Users/Predator/Desktop/shellfish ubg';

// Read games.js and extract all URLs
const content = fs.readFileSync(path.join(BASE, 'js/games.js'), 'utf8');
const urls = new Set();
const regex = /url:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(content)) !== null) {
  urls.add(match[1]);
}

// ======= 3kh0 =======
console.log('========================================');
console.log('MISSING FROM 3kh0/ DIRECTORY');
console.log('========================================');
const dir3kh0 = fs.readdirSync(path.join(BASE, 'games/3kh0/'));
const folders3kh0 = dir3kh0.filter(f => {
  const fullPath = path.join(BASE, 'games/3kh0/', f);
  return fs.statSync(fullPath).isDirectory();
});

const cataloged3kh0 = new Set();
urls.forEach(u => {
  const m = u.match(/^games\/3kh0\/([^\/]+)\//);
  if (m) cataloged3kh0.add(m[1]);
});

const missing3kh0 = folders3kh0.filter(f => !cataloged3kh0.has(f));
missing3kh0.forEach(f => {
  const readable = f.replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  console.log('  folder: ' + f + '  =>  suggested name: "' + readable + '"');
});
console.log('Total missing from 3kh0: ' + missing3kh0.length + ' / ' + folders3kh0.length + ' folders');

// ======= UGS =======
console.log('');
console.log('========================================');
console.log('MISSING FROM ugs/ DIRECTORY');
console.log('========================================');
const dirUgs = fs.readdirSync(path.join(BASE, 'games/ugs/'));
const htmlUgs = dirUgs.filter(f => f.endsWith('.html'));

const catalogedUgs = new Set();
urls.forEach(u => {
  const m = u.match(/^games\/ugs\/(.+)$/);
  if (m) catalogedUgs.add(m[1]);
});

const missingUgs = htmlUgs.filter(f => !catalogedUgs.has(f));
missingUgs.forEach(f => {
  let name = f.replace(/^cl/, '').replace(/\.html$/, '');
  let readable = name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/(\d+)/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  console.log('  file: ' + f + '  =>  suggested name: "' + readable + '"');
});
console.log('Total missing from ugs: ' + missingUgs.length + ' / ' + htmlUgs.length + ' files');

// ======= sz/games =======
console.log('');
console.log('========================================');
console.log('MISSING FROM sz/games/ DIRECTORY');
console.log('========================================');
const dirSz = fs.readdirSync(path.join(BASE, 'games/sz/games/'));

const missingSz = [];
dirSz.forEach(f => {
  if (f === 'index.html' || f === 'Bin' || f === 'swf') return;

  const fullPath = path.join(BASE, 'games/sz/games/', f);
  let isDir;
  try { isDir = fs.statSync(fullPath).isDirectory(); } catch(e) { return; }

  let found = false;
  urls.forEach(u => {
    if (u.includes('sz/games/' + f)) found = true;
  });
  if (!found) {
    const readable = f.replace(/\.html$/, '').replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
    missingSz.push({name: f, type: isDir ? 'folder' : 'file', readable});
  }
});
missingSz.forEach(item => {
  console.log('  ' + item.type + ': ' + item.name + '  =>  suggested name: "' + item.readable + '"');
});
console.log('Total missing from sz/games: ' + missingSz.length);

// ======= doodle =======
console.log('');
console.log('========================================');
console.log('MISSING FROM doodle/ DIRECTORY');
console.log('========================================');
const dirDoodle = fs.readdirSync(path.join(BASE, 'games/doodle/'));

const missingDoodle = [];
dirDoodle.forEach(f => {
  const fullPath = path.join(BASE, 'games/doodle/', f);
  let isDir;
  try { isDir = fs.statSync(fullPath).isDirectory(); } catch(e) { return; }

  let found = false;
  urls.forEach(u => {
    if (u.includes('games/doodle/' + f)) found = true;
  });
  if (!found) {
    const readable = f.replace(/\.html$/, '').replace(/-/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
    missingDoodle.push({name: f, type: isDir ? 'folder' : 'file', readable});
  }
});
missingDoodle.forEach(item => {
  console.log('  ' + item.type + ': ' + item.name + '  =>  suggested name: "' + item.readable + '"');
});
console.log('Total missing from doodle: ' + missingDoodle.length);

console.log('');
console.log('========================================');
console.log('GRAND TOTAL MISSING');
console.log('========================================');
console.log('3kh0:     ' + missing3kh0.length);
console.log('ugs:      ' + missingUgs.length);
console.log('sz/games: ' + missingSz.length);
console.log('doodle:   ' + missingDoodle.length);
console.log('TOTAL:    ' + (missing3kh0.length + missingUgs.length + missingSz.length + missingDoodle.length));
