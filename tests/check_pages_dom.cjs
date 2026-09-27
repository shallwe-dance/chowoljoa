const {JSDOM, VirtualConsole} = require('jsdom');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../docs');
const prefix = '/chowoljoa/';

function localPath(url) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, 'https://example.test');
  assert(parsed.pathname.startsWith(prefix));
  return path.join(root, decodeURIComponent(parsed.pathname.slice(prefix.length)));
}
async function open(relative) {
  const errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root, relative), 'utf8'), {
    url: 'https://example.test' + prefix + relative,
    runScripts: 'outside-only', virtualConsole: console,
    beforeParse(window) {
      window.alert = message => { window.lastAlert = message; };
      window.fetch = async url => ({ok:true, text:async () =>
        fs.readFileSync(localPath(new URL(url, window.location.href)), 'utf8')});
    }
  });
  for (const script of dom.window.document.querySelectorAll('script')) {
    if (script.src.startsWith('https://cdn.tailwindcss.com')) continue;
    const source = script.src ? fs.readFileSync(localPath(script.src), 'utf8') : script.textContent;
    new vm.Script(source).runInContext(dom.getInternalVMContext());
  }
  // outside-only intentionally disables HTML event attributes; wire those as a browser does.
  for (const element of dom.window.document.querySelectorAll('[onclick]')) {
    element.onclick = dom.window.Function('event', element.getAttribute('onclick'));
  }
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  assert.deepEqual(errors, [], relative);
  return {dom, errors};
}
(async () => {
  for (const locale of ['ko','en']) {
    const {dom, errors} = await open(`${locale}/index.html`);
    const {document} = dom.window;
    document.getElementById('helpBtn').click();
    assert(!document.getElementById('helpPanel').classList.contains('hidden'));
    document.getElementById('helpCloseBtn').click();
    assert(document.getElementById('helpPanel').classList.contains('hidden'));
    const category = document.querySelectorAll('.category-btn')[1];
    category.click();
    assert(!document.getElementById('grid-others').classList.contains('hidden'));
    assert.equal(document.querySelectorAll('a[href*="calculate/"]').length,21);
    assert.equal(document.getElementById('contactForm'),null);
    assert.deepEqual(errors, []);
    dom.window.close();
    for (const part of ['upper','others','weapon']) {
      for (let stage=1; stage<=7; stage++) {
        const {dom,errors} = await open(`${locale}/calculate/${part}/${stage}/index.html`);
        const {window:w} = dom;
        w.confirmTabletState();
        assert(w.lastAlert, 'Missing start/goal should be rejected');
        w.lastAlert = null;
        w.eval(`
          const cells=[];
          tabletMap.forEach((row,r)=>row.forEach((tile,c)=>{if(tile==='path')cells.push([r,c]);}));
          const start=cells[0], goal=cells[cells.length-1];
          tabletMap[start[0]][start[1]]='start';
          tabletMap[goal[0]][goal[1]]='goal';
          spiritPos=start; renderTablet();
        `);
        w.confirmTabletState();
        for(let i=0;i<20 && w.document.getElementById('probabilityResults').classList.contains('hidden');i++)
          await new Promise(resolve=>setTimeout(resolve,5));
        assert.equal(w.lastAlert,null);
        assert(!w.document.getElementById('probabilityResults').classList.contains('hidden'));
        assert(w.document.querySelector('#probWithinN .prob-text').innerText.includes('%'));
        w.document.querySelector('#spiritButtons button').click();
        await new Promise(resolve=>setTimeout(resolve,5));
        assert.equal(w.document.getElementById('totalCountValue').textContent,'1');
        assert.equal(w.lastAlert,null);
        assert.deepEqual(errors,[],`${locale}/${part}/${stage}`);
        w.close();
      }
    }
  }
  console.log('Both home pages and all 42 calculators passed DOM interactions under /chowoljoa/.');
})().catch(error=>{console.error(error);process.exit(1);});
