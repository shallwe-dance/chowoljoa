#!/bin/bash
# GitHub Pages 호스팅을 위한 파일 구성 스크립트

echo "Building static site for GitHub Pages..."

# 템플릿 파일 복사
mkdir -p docs/pages
cp myproject/myapp/templates/*.html docs/pages/

# 정적 파일 복사
cp -r myproject/static/js/* docs/assets/js/ 2>/dev/null || true
cp -r myproject/static/admin/css/* docs/assets/css/ 2>/dev/null || true
cp -r myproject/static/images/* docs/assets/images/ 2>/dev/null || true

# 인덱스 페이지 생성
cat > docs/index.html << 'EOF'
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chowoljoa - 엘조윈 공략</title>
    <link rel="stylesheet" href="assets/css/base.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <h1>Chowoljoa</h1>
            <ul class="nav-menu">
                <li><a href="index.html">Home</a></li>
                <li><a href="pages/en_index.html">English</a></li>
                <li><a href="pages/calculate.html">Calculator</a></li>
            </ul>
        </div>
    </nav>

    <main class="container">
        <section class="hero">
            <h2>엘조윈 공략 정보</h2>
            <p>Welcome to Chowoljoa - Your guide to Elzowin</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2026 Chowoljoa. All rights reserved.</p>
    </footer>

    <script src="assets/js/tabletMaps.js"></script>
    <script src="assets/js/elzowin.js"></script>
</body>
</html>
EOF

echo "✓ Static site built successfully in docs/ folder"
