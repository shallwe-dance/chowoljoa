# Chowoljoa - GitHub Pages Configuration

## 폴더 구조 (New GitHub Pages Layout)

```
chowoljoa-main/
├── docs/                          # GitHub Pages 호스팅 폴더 (main branch에서)
│   ├── index.html                # 메인 페이지
│   ├── pages/                    # 각 페이지 HTML
│   │   ├── ko_index.html
│   │   ├── en_index.html
│   │   └── calculate.html
│   ├── assets/                   # 정적 자산
│   │   ├── css/                  # 스타일시트
│   │   ├── js/                   # JavaScript 파일
│   │   └── images/               # 이미지 (weapons, tiles, etc.)
│   └── _config.yml               # Jekyll 설정 (선택사항)
│
├── myproject/                     # Django 프로젝트 (빌드 도구로만 사용)
│   ├── myapp/
│   │   ├── templates/            # 소스 템플릿
│   │   └── static/               # 소스 정적 파일
│   └── ...
│
├── build-docs.ps1                # PowerShell 빌드 스크립트
├── build-docs.sh                 # Bash 빌드 스크립트
└── .github/workflows/
    └── deploy.yml                # GitHub Actions 자동 배포 (선택사항)
```

## 사용 방법

### 1. 정적 사이트 빌드

**Windows (PowerShell):**
```powershell
.\build-docs.ps1
```

**Mac/Linux (Bash):**
```bash
chmod +x build-docs.sh
./build-docs.sh
```

### 2. GitHub Pages 설정

Repository Settings에서:
1. **Settings** → **Pages**
2. **Source:** `Deploy from a branch` 선택
3. **Branch:** `main` / **Folder:** `/docs` 선택
4. **Save** 클릭

### 3. 배포 확인

- 사이트가 자동으로 `https://yourusername.github.io/chowoljoa-main/` 에서 호스팅됩니다.

## 파일 관리

- **템플릿 수정:** `myproject/myapp/templates/` 에서 수정 후 `build-docs.ps1` 실행
- **이미지 추가:** `myproject/static/images/` 에 추가 후 빌드
- **CSS/JS 수정:** `myproject/static/` 에서 수정 후 빌드

## 주의사항

- `docs/` 폴더는 자동 생성되므로, `build-docs.ps1` 또는 `build-docs.sh` 스크립트를 실행하여 최신 내용으로 유지하세요.
- Django 서버 없이 정적 HTML만 호스팅됩니다.
- 동적 기능이 필요한 경우 JavaScript를 사용하거나, Netlify/Vercel 같은 서버리스 플랫폼 사용을 고려하세요.

## GitHub Actions 자동 배포 (선택사항)

`.github/workflows/deploy.yml` 파일을 생성하면, 커밋할 때마다 자동으로 정적 사이트를 빌드하고 배포할 수 있습니다.
