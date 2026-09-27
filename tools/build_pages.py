"""Build the GitHub Pages site into docs/ without loading Django app settings."""
from pathlib import Path
import hashlib
import re
import shutil
import django

from django.conf import settings
from django.template import Context, Engine

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs'
APP = ROOT / 'myproject/myapp'
if not settings.configured:
    settings.configure(STATIC_URL='/static/', USE_I18N=False)
django.setup()
ENGINE = Engine(libraries={'static': 'django.templatetags.static'})
HELP = """
document.getElementById('helpBtn').addEventListener('click', () => {
  document.getElementById('helpPanel').classList.toggle('hidden');
});
document.getElementById('helpCloseBtn').addEventListener('click', () => {
  document.getElementById('helpPanel').classList.add('hidden');
});
"""


def prepare_template(name, locale):
    html = (APP / 'templates' / name).read_text()
    # Replace the entire contact widget, including its enclosing div.
    contact = html.index('<button id="contactBtn"')
    start = html.rfind('<div class="relative inline-block">', 0, contact)
    end = html.index('</nav>', contact)
    label = '문의 / GitHub Issues' if locale == 'ko' else 'Contact / GitHub Issues'
    html = html[:start] + (
        '<a href="https://github.com/shallwe-dance/chowoljoa/issues" '
        f'class="text-white hover:underline">{label}</a></div>\n  '
    ) + html[end:]

    def script(match):
        body = match[1]
        if 'const helpBtn' in body:
            return '<script>' + HELP + '</script>'
        if 'contactImage' in body or 'contactForm' in body:
            return ''
        if 'function sendTabletState' in body:
            body = re.sub(r'// CSRF[^\n]*\nfunction getCookie\(name\) \{.*?\n\}', '', body, flags=re.S)
            body = body.replace('const itemType = "{{ item_type }}";', 'const itemType = document.body.dataset.item;')
            body = body.replace('const stage = "{{ stage }}";', 'const stage = document.body.dataset.stage;')
            body = body.replace("`url('/static/images/tiles/${type}_1.jpg')`",
                                "`url('${document.body.dataset.static}images/tiles/${type}_1.jpg')`")
            body = re.sub(r'fetch\("/api/update-tablet/", \{.*?body: JSON.stringify\(\{',
                          'Chowol.calculate({', body, flags=re.S)
            body = body.replace('    })\n  })\n  .then(res => res.json())',
                                '    }, document.body.dataset.static + "expectations.csv")')
            body = body.replace('function sendTabletState(action, extra) {',
                                'let latestCalculation = 0;\nfunction sendTabletState(action, extra) {\n  const requestId = ++latestCalculation;')
            body = body.replace('.then(data => {', '.then(data => {\n    if (requestId !== latestCalculation) return;')
            error = '계산 실패. 시작/도착 타일과 인터넷 연결을 확인해주세요.' if locale == 'ko' else 'Calculation failed. Check start/goal tiles and your connection.'
            body = re.sub(r'\.catch\(err => console.error\([^\n]+\)\);',
                          f'.catch(err => {{ if (requestId === latestCalculation) alert("{error}"); console.error(err); }});', body)
            invalid = '시작/도착 타일과 가호(0~8)를 확인해주세요.' if locale == 'ko' else 'Select start and goal tiles, and a blessing level from 0 to 8.'
            body = body.replace('function confirmTabletState() {', '''function confirmTabletState() {
  const blessing = Number(document.getElementById('elzowinBlessing').value);
  if (!spiritPos || !tabletMap.some(row => row.includes('goal')) ||
      !Number.isInteger(blessing) || blessing < 0 || blessing > 8) {
    alert("''' + invalid + '''"); return;
  }''')
        return '<script>' + body + '</script>'

    html = re.sub(r'<script>(.*?)</script>', script, html, flags=re.S)
    # A second legacy help panel reused the same ID; retain only the nav panel.
    html = re.sub(r'<div id="helpPanel" class="hidden max-w-4xl.*?</div>', '', html, flags=re.S)
    html = html.replace('href="javascript:history.back()"', f'href="/{locale}/"')
    html = re.sub(r"href=(['\"])(calculate/[^'\"]+?)\1",
                  lambda m: f'href="/{locale}/{m[2].rstrip(chr(47))}/"', html)
    html = html.replace("href='/'", f'href="/{locale}/"')
    return html


def write_page(template, locale, relative, part='', stage=''):
    path = OUT / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    prefix = '../' * (len(Path(relative).parts) - 1)
    html = ENGINE.from_string(template).render(Context({'item_type': part, 'stage': stage}, use_l10n=False))
    html = re.sub(r'<body\b', f'<body data-item="{part}" data-stage="{stage}" data-static="{prefix}static/"', html, count=1)
    if part:
        html = html.replace('</head>', f'<script src="{prefix}static/js/calculator.js"></script>\n</head>')
    html = re.sub(r'(href|src)=([\x27\x22])/(?!/)([^\x27\x22]*)\2',
                  lambda m: f'{m[1]}="{prefix}{m[3] + chr(47) if m[3] in ("ko", "en") else m[3]}"', html)

    def external_script(match):
        content = '\n'.join(line.rstrip() for line in match[1].strip().splitlines()) + '\n'
        filename = 'page-' + hashlib.sha256(content.encode()).hexdigest()[:16] + '.js'
        (OUT / 'static/js' / filename).write_text(content)
        return f'<script src="{prefix}static/js/{filename}"></script>'

    html = re.sub(r'<script>(.*?)</script>', external_script, html, flags=re.S)
    if '{%' in html or '{{' in html or '/api/' in html or 'contactForm' in html:
        raise ValueError(f'Unconverted server dependency in {relative}')
    if '<html lang=' not in html:
        html = html.replace('<html>', f'<html lang="{locale}">')
    if '<meta charset=' not in html:
        html = html.replace('<head>', '<head><meta charset="UTF-8">')
    if '<!DOCTYPE' not in html.upper():
        html = '<!DOCTYPE html>\n' + html
    path.write_text('\n'.join(line.rstrip() for line in html.splitlines()).rstrip() + '\n')


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / 'static/js').mkdir(parents=True)
    shutil.copytree(APP / 'static/images', OUT / 'static/images', ignore=shutil.ignore_patterns('*.txt'))
    for icon in ('apple-touch-icon.png',):
        shutil.copy2(ROOT / 'myproject' / icon, OUT / 'static' / icon)
    shutil.copy2(APP / 'static/js/tabletMaps.js', OUT / 'static/js/tabletMaps.js')
    shutil.copy2(ROOT / 'pages/calculator.js', OUT / 'static/js/calculator.js')
    shutil.copy2(APP / 'expectations.csv', OUT / 'static/expectations.csv')
    for text_path in (OUT / 'static/js/tabletMaps.js', OUT / 'static/expectations.csv'):
        text_path.write_text('\n'.join(line.rstrip() for line in text_path.read_text().splitlines()) + '\n')
    for locale in ('ko', 'en'):
        index = prepare_template(f'{locale}_index.html', locale)
        calculator = prepare_template('calculate.html' if locale == 'ko' else 'en_calculate.html', locale)
        write_page(index, locale, f'{locale}/index.html')
        for part in ('upper', 'others', 'weapon'):
            for stage in range(1, 8):
                write_page(calculator, locale, f'{locale}/calculate/{part}/{stage}/index.html', part, stage)
    (OUT / '.nojekyll').write_text('')
    (OUT / 'index.html').write_text('''<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8"><title>초월조아</title>
<meta http-equiv="refresh" content="0;url=ko/"></head>
<body><a href="ko/">한국어</a> · <a href="en/">English</a></body></html>
''')
    print('Built 45 static pages in docs/.')


if __name__ == '__main__':
    main()
