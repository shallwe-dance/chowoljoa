"""Static-site links and JavaScript/Python calculator parity. Requires Node.js."""
from pathlib import Path
from html.parser import HTMLParser
import importlib.util
import json
import random
import subprocess
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
spec = importlib.util.spec_from_file_location('logic', ROOT / 'myproject/myapp/logic.py')
logic = importlib.util.module_from_spec(spec)
spec.loader.exec_module(logic)


class Links(HTMLParser):
    def __init__(self, page):
        super().__init__()
        self.page = page
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, (self.page, 'duplicate ID', attrs['id'])
            self.ids.add(attrs['id'])
        for key in ('src', 'href'):
            url = attrs.get(key, '')
            parsed = urlsplit(url)
            if not url or parsed.scheme or parsed.netloc or url.startswith('#'):
                continue
            assert not url.startswith('/'), (self.page, 'root-relative link', url)
            target = (self.page.parent / unquote(parsed.path)).resolve()
            assert target.is_relative_to(DOCS), (self.page, url)
            if target.is_dir():
                target /= 'index.html'
            assert target.is_file(), (self.page, 'missing target', url)


pages = list(DOCS.rglob('*.html'))
assert len(pages) == 45, len(pages)
for page in pages:
    text = page.read_text()
    assert all(marker not in text for marker in ('{%','{{','/api/','contactForm'))
    Links(page).feed(text)

rng = random.Random(2026)
cases = []
for i in range(1500):
    path = ['start'] + [rng.choice(['path', *logic.SPECIAL]) for _ in range(rng.randrange(30))] + ['goal']
    args = [path, rng.randrange(-2, 11), rng.randrange(9), rng.randrange(5)]
    cases.append({'args': args, 'expected': logic.compute_prob_dp(*args)})
# Cover every blessing level and each immediate/special tile explicitly.
for level in range(9):
    for tile in ['path', *logic.SPECIAL]:
        args = [['start', tile, 'path', 'path', 'goal'], 2, level, 0]
        cases.append({'args': args, 'expected': logic.compute_prob_dp(*args)})
maps = json.loads(subprocess.check_output(['node', '-e', "const fs=require('fs'),vm=require('vm');const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('myproject/myapp/static/js/tabletMaps.js','utf8')+';globalThis.maps=tabletMaps',context);console.log(JSON.stringify(context.maps));"], cwd=ROOT))
flatten_cases = []
for key, tablet in maps.items():
    part, stage = key.split('-')
    cells = [(r, c) for r, row in enumerate(tablet) for c, value in enumerate(row) if value == 'path']
    for start in cells[:3]:
        board = [row[:] for row in tablet]
        board[start[0]][start[1]] = 'start'
        end = cells[-1]
        board[end[0]][end[1]] = 'goal'
        args = [board, part, int(stage)]
        flatten_cases.append({'args': args, 'expected': logic.flatten_tablet(*args)})
script = r'''
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const calculator = require('./pages/calculator.js');
const {cases, flattenCases} = JSON.parse(fs.readFileSync(0, 'utf8'));
for (const c of flattenCases) assert.deepStrictEqual(calculator.flattenTablet(...c.args),c.expected);
for (const c of cases) {
  const actual = calculator.computeProbability(...c.args);
  for (const key of Object.keys(c.expected))
    assert(Math.abs(actual[key] - c.expected[key]) < 1e-12, JSON.stringify(c));
}
const table = calculator.parseExpectations(fs.readFileSync('docs/static/expectations.csv','utf8'));
assert(table.size > 10000);
assert(Math.abs(table.get('1,0,1,0') - 1) < 1e-12);
const payload = {tabletMap:[['start','enhancement','path','goal']],spiritPos:[0,0],
  visitedList:[],item_type:'upper',stage:1,n:4,totalCount:0,elzowinLevel:0,
  enhancementCount:0,unreached_special_tiles:0};
const snapshot = JSON.stringify(payload);
assert.equal(calculator.analyze(payload,table).status,'ok');
assert.equal(JSON.stringify(payload),snapshot);
for(const file of fs.readdirSync('docs/static/js')) {
  const text = fs.readFileSync('docs/static/js/'+file,'utf8');
  new vm.Script(text,{filename:file});
  assert(!text.includes('/api/') && !text.includes('contactForm'));
}
console.log(`${cases.length} probability cases and ${flattenCases.length} path comparisons passed, plus CSV parsing, state immutability, and JS syntax.`);
'''
subprocess.run(['node', '-e', script], input=json.dumps({'cases': cases, 'flattenCases': flatten_cases}), text=True, cwd=ROOT, check=True)
print('All 45 pages passed local-link, unique-ID, and server-dependency checks.')
