# Chowoljoa - 엘조윈 공략 및 정보 사이트

[![GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-blue)](https://github.com)

엘조윈 게임에 대한 공략, 정보, 그리고 유용한 계산 도구를 제공하는 정적 웹사이트입니다.

## 📁 프로젝트 구조

```
chowoljoa-main/
├── docs/                          # GitHub Pages 호스팅 폴더 ⭐
│   ├── index.html                # 메인 페이지
│   ├── pages/                    # 각 페이지
│   │   ├── ko_index.html        # 한국어 공략
│   │   ├── en_index.html        # 영문 공략
│   │   └── calculate.html       # 계산기
│   ├── assets/                   # 정적 자산
│   │   ├── css/                 # 스타일시트
│   │   ├── js/                  # JavaScript
│   │   └── images/              # 이미지
│   └── _config.yml              # Jekyll 설정
│
├── myproject/                     # Django 프로젝트 (빌드 도구)
│   ├── myapp/
│   │   ├── templates/           # 소스 템플릿
│   │   ├── static/              # 소스 정적 파일
│   │   └── ...
│   └── manage.py
│
├── build-docs.ps1                # PowerShell 빌드 스크립트
├── build-docs.sh                 # Bash 빌드 스크립트
├── GITHUB_PAGES_SETUP.md         # 상세 설정 가이드
└── README.md                      # 이 파일
```

## 🚀 빠른 시작

### 1. 로컬 환경에서 빌드

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

1. GitHub에서 repository settings 이동
2. **Settings** → **Pages** → **Source**
3. **Branch:** `main` / **Folder:** `/docs` 선택
4. **Save** 클릭

### 3. 배포 확인

사이트가 자동으로 배포됩니다:
```
https://yourusername.github.io/chowoljoa-main/
```

## 🌐 페이지 구성

| 페이지 | 설명 |
|--------|------|
| **Home** (`index.html`) | 메인 랜딩 페이지 |
| **한국어** (`ko_index.html`) | 한국어 공략 가이드 |
| **English** (`en_index.html`) | 영문 공략 가이드 |
| **Calculator** (`calculate.html`) | 다양한 계산 도구 |

## 🛠️ 파일 관리

### 템플릿 수정
1. `myproject/myapp/templates/` 에서 HTML 파일 수정
2. 빌드 스크립트 실행: `.\build-docs.ps1`

### 이미지 추가
1. `myproject/static/images/` 에 이미지 추가
2. 빌드 스크립트 실행: `.\build-docs.ps1`

### CSS/JS 수정
1. `myproject/static/` 에서 파일 수정
2. 빌드 스크립트 실행: `.\build-docs.ps1`

## 📋 기능

✅ **정적 사이트 호스팅** - Django 없이 순수 HTML/CSS/JS
✅ **다국어 지원** - 한국어 & 영문
✅ **계산기 도구** - 데미지, 비용, 경험치, 리소스 계산
✅ **반응형 디자인** - 모바일 친화적
✅ **자동 배포** - GitHub Actions 지원 (선택)
✅ **검색 엔진 최적화** - SEO 메타태그 포함

## 🔧 고급 설정

### GitHub Actions 자동 배포

`.github/workflows/deploy.yml` 파일이 이미 설정되어 있습니다.
main branch에 푸시할 때마다 자동으로 배포됩니다.

### Jekyll 테마 커스터마이징

`docs/_config.yml` 파일에서 설정 변경 가능:

```yaml
title: Chowoljoa
description: 엘조윈 공략 및 정보 제공 사이트
theme: jekyll-theme-minimal
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🤝 기여

버그 리포트, 기능 제안, 또는 개선 사항이 있으신가요?
Issue를 열거나 Pull Request를 제출해주세요!

## 📞 지원

문제가 발생하면:
1. [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md) 참고
2. GitHub Issues 확인
3. 빌드 스크립트가 올바르게 실행되었는지 확인

---

**마지막 업데이트:** 2026년 1월
**상태:** ✅ GitHub Pages 호스팅 준비 완료
