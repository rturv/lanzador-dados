const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.resolve(__dirname, '../src/styles.css'), 'utf8');

function extractVars(blockName) {
  const re = new RegExp(blockName.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\s*\\{([\\s\\S]*?)\\}');
  const m = css.match(re);
  if (!m) return {};
  const body = m[1];
  const vars = {};
  body.split(/;\s*/).forEach(line => {
    const kv = line.split(':');
    if (kv.length >= 2) {
      const key = kv[0].trim();
      if (key.startsWith('--')) {
        const val = kv.slice(1).join(':').trim();
        vars[key] = val.replace(/;$/, '').trim();
      }
    }
  });
  return vars;
}

function parseHex(h) {
  h = h.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.substr(0,2),16);
  const g = parseInt(h.substr(2,2),16);
  const b = parseInt(h.substr(4,2),16);
  return [r,g,b,1];
}

function parseColor(s) {
  if (!s) return null;
  s = s.trim();
  if (s.startsWith('#')) return parseHex(s);
  const rgba = /rgba?\s*\(([^)]+)\)/i.exec(s);
  if (rgba) {
    const parts = rgba[1].split(',').map(p => p.trim());
    const r = Number(parts[0]);
    const g = Number(parts[1]);
    const b = Number(parts[2]);
    const a = parts[3] !== undefined ? Number(parts[3]) : 1;
    return [r,g,b,a];
  }
  // named colors fallback - limited
  const named = {
    white: [255,255,255,1],
    black: [0,0,0,1]
  };
  if (named[s.toLowerCase()]) return named[s.toLowerCase()];
  return null;
}

function composite(fg, bg) {
  // fg and bg are [r,g,b,a]
  const [rf, gf, bf, af] = fg;
  const [rb, gb, bb, ab] = bg;
  const a = af + ab * (1 - af);
  if (a === 0) return [0,0,0,0];
  const r = Math.round((rf * af + rb * ab * (1 - af)) / a);
  const g = Math.round((gf * af + gb * ab * (1 - af)) / a);
  const b = Math.round((bf * af + bb * ab * (1 - af)) / a);
  return [r,g,b,a];
}

function luminance([r,g,b]){
  const srgb = [r,g,b].map(v => v/255).map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4));
  return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
}

function contrast(c1, c2){
  const L1 = luminance(c1);
  const L2 = luminance(c2);
  const lighter = Math.max(L1,L2);
  const darker = Math.min(L1,L2);
  return +( (lighter + 0.05) / (darker + 0.05) ).toFixed(2);
}

const root = extractVars(':root');
const dark = extractVars('.theme-dark');

function col(m) {
  if (!m) return null;
  return parseColor(m) || null;
}

const results = [];

function check(name, fg, bg) {
  if (!fg || !bg) return results.push({name, ok:false, reason:'missing color'});
  const fgCol = col(fg.startsWith('var(')? (fg.match(/var\((--[a-zA-Z0-9-]+)\)/)||[])[1] ? (fg.includes('--') ? (fg.includes('--')? (fg.includes('--')? (fg): fg): fg): fg) : fg : fg);
}

// Helper to resolve var() or direct
function resolve(val, vars) {
  if (!val) return null;
  val = val.trim();
  const m = /var\((--[a-zA-Z0-9-]+)\)/.exec(val);
  if (m) {
    const key = m[1];
    return vars[key] || null;
  }
  return val;
}

function ensureColor(val, varsFallback){
  if (!val) return null;
  const resolved = resolve(val, root) || resolve(val, dark) || val;
  return parseColor(resolved);
}

// Checks to run
const checks = [];

// Light theme basic
checks.push({name:'Light: text vs bg', fg: root['--ink'], bg: root['--bg']});
checks.push({name:'Light: text vs panel', fg: root['--ink'], bg: root['--panel']});
checks.push({name:'Light: muted vs panel', fg: root['--muted'], bg: root['--panel']});

// Dark theme basic
checks.push({name:'Dark: text vs bg', fg: dark['--ink'], bg: dark['--bg']});
checks.push({name:'Dark: text vs panel', fg: dark['--ink'], bg: dark['--panel']});
checks.push({name:'Dark: muted vs panel', fg: dark['--muted'], bg: dark['--panel']});

// Roll button (dark): text #031019 vs var(--accent-strong)
checks.push({name:'Dark: roll-btn text (#031019) vs accent-strong', fg:'#031019', bg: dark['--accent-strong']});

// Macro run card text (#031019) vs its background rgba(255,255,255,0.94)
checks.push({name:'Dark: macro-run text #031019 vs macro-run bg rgba(255,255,255,0.94)', fg:'#031019', bg:'rgba(255,255,255,0.94)'});

// Dice counter button: text var(--ink) vs background rgba(0,0,0,0.55) composited over dark --bg
checks.push({name:'Dark: dice-counter text vs dice-counter bg (composited)', fg: dark['--ink'], bg: 'rgba(0,0,0,0.55)', compositeOver: dark['--bg']});

// Inputs: text var(--ink) vs input bg rgba(255,255,255,0.03) over panel
checks.push({name:'Dark: input text vs input bg (composited over panel)', fg: dark['--ink'], bg: 'rgba(255,255,255,0.03)', compositeOver: dark['--panel']});

// Timeline item time color #6b7280 vs timeline-item bg rgba(255,255,255,0.94)
checks.push({name:'Dark TV timeline-time #6b7280 vs timeline-item bg', fg:'#6b7280', bg:'rgba(255,255,255,0.94)'});

function run(){
  console.log('Running static contrast checks (WCAG AA thresholds: 4.5 normal, 3.0 large)');
  checks.forEach(c => {
    let bgCol = parseColor(c.bg);
    if (!bgCol && c.bg && c.bg.startsWith('var(')) bgCol = parseColor(resolve(c.bg, dark) || resolve(c.bg, root));
    if (!bgCol && c.compositeOver) {
      const fgParsed = parseColor(c.bg);
      const over = parseColor(c.compositeOver) || parseColor(dark['--bg']) || parseColor(root['--bg']);
      bgCol = composite(fgParsed, over);
    }
    const fgCol = parseColor(c.fg) || parseColor(resolve(c.fg, dark)) || parseColor(resolve(c.fg, root));
    if (!fgCol || !bgCol) {
      console.log(`- ${c.name}: missing color data`);
      return;
    }
    const cr = contrast([fgCol[0],fgCol[1],fgCol[2]],[bgCol[0],bgCol[1],bgCol[2]]);
    const passNormal = cr >= 4.5;
    const passLarge = cr >= 3.0;
    console.log(`- ${c.name}: contrast=${cr} — normal: ${passNormal? 'PASS':'FAIL'}; large: ${passLarge? 'PASS':'FAIL'}`);
  });
}

run();
