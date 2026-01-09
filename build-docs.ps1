# GitHub Pages 호스팅을 위한 파일 구성 스크립트 (PowerShell)

Write-Host "Building static site for GitHub Pages..." -ForegroundColor Green

# docs 폴더 생성
if (-not (Test-Path -Path "docs/pages")) {
    New-Item -Path "docs/pages" -ItemType Directory -Force | Out-Null
}

# 템플릿 파일 복사
$templates = Get-ChildItem -Path "myproject/myapp/templates/*.html" -ErrorAction SilentlyContinue
if ($templates) {
    foreach ($template in $templates) {
        Copy-Item -Path $template.FullName -Destination "docs/pages/" -Force
    }
}

# 정적 파일 복사
$jsSource = "myproject/static/js"
$cssSource = "myproject/static/admin/css"
$imagesSource = "myproject/static/images"

if (Test-Path $jsSource) {
    Get-ChildItem -Path "$jsSource/*" -Recurse | ForEach-Object {
        if ($_.PSIsContainer) {
            New-Item -Path "docs/assets/js/$($_.Name)" -ItemType Directory -Force | Out-Null
        } else {
            Copy-Item -Path $_.FullName -Destination "docs/assets/js/$($_.Name)" -Force
        }
    }
}

if (Test-Path $imagesSource) {
    Get-ChildItem -Path "$imagesSource/*" -Recurse | Copy-Item -Destination "docs/assets/images/" -Force -Recurse
}

Write-Host "✓ Static site built successfully in docs/ folder" -ForegroundColor Green
Write-Host ""
Write-Host "Folder structure created:" -ForegroundColor Cyan
Write-Host "  docs/"
Write-Host "  ├── index.html          (Main page)"
Write-Host "  ├── pages/              (HTML templates)"
Write-Host "  └── assets/"
Write-Host "      ├── css/            (Stylesheets)"
Write-Host "      ├── js/             (JavaScript files)"
Write-Host "      └── images/         (Images)"
