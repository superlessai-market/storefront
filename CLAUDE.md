# CLAUDE.md — market.superless.ai

## 프로젝트 개요

Superless AI 워크샵에서 참가자들과 함께 프롬프팅으로 만든 SPA(HTML 파일)를 모아서 보여주는 앱 마켓 플랫폼.
각 앱에 Google AdSense를 붙여 광고 수익을 기여자들과 나눈다.

- **URL:** market.superless.ai
- **호스팅:** Cloudflare Pages (무료, AdSense 허용)
- **이 리포:** `superlessai-market/storefront` — 갤러리 페이지 + wrapper.js + 배포용
- **앱 리포:** `superlessai-market/` org 아래 앱마다 별도 리포 (예: `superlessai-market/kyoto-guide`)

## 아키텍처

```
GitHub Org: superlessai-market
  ├── storefront/              ← 이 리포 (Cloudflare Pages 연결)
  │   ├── index.html           ← 갤러리 페이지 (앱 목록)
  │   ├── apps/                ← 각 앱 HTML이 자동 복사되는 폴더
  │   │   ├── kyoto-guide.html
  │   │   ├── diet-manager.html
  │   │   └── ...
  │   └── template/
  │       └── wrapper.js       ← AdSense + 공통 헤더/푸터 자동 삽입
  │
  ├── kyoto-guide/             ← 앱 리포 (독립)
  ├── diet-manager/            ← 앱 리포 (독립)
  └── ...
```

## 자동 배포 흐름

```
앱 리포에 push (예: kyoto-guide)
    ↓ GitHub Action (앱 리포에 있는 deploy.yml)
storefront/apps/ 폴더에 HTML 자동 복사
    ↓ GitHub Action (storefront에 있는 build.yml)
apps/ 폴더 스캔 → 메타 태그 읽어서 갤러리 자동 생성
wrapper.js 자동 삽입
    ↓ Cloudflare Pages 자동 배포
market.superless.ai 반영
```

## 이 리포(storefront)에서 해야 할 일

### 1. 갤러리 페이지 (index.html)

apps/ 폴더에 있는 HTML 파일들을 스캔해서 카드 형태로 보여주는 메인 페이지.

- 각 앱 HTML의 메타 태그에서 정보를 읽음
- 디자인 컨셉: 슈퍼마켓 진열대. 앱 카드가 빽빽하게 깔려있는 느낌. 깔끔한 그리드가 아니라 풍성하고 압도적인 레이아웃.
- 브랜드: SUPERLESS / market.superless.ai
- 반응형 (모바일 대응)

### 2. wrapper.js (template/wrapper.js)

모든 앱 HTML 페이지에 자동 삽입되는 스크립트. 역할:

- **상단 바:** market.superless.ai 로고 + 갤러리로 돌아가기 링크
- **AdSense 코드 삽입:** `<head>`에 AdSense 스크립트 추가 (data-ad-client는 나중에 설정)
- **광고 영역:** 앱 콘텐츠 위/아래에 광고 슬롯
- **푸터:** 기여자 목록, 워크샵 날짜 (메타 태그에서 읽음), "Powered by SUPERLESS" 표시

### 3. GitHub Action — 갤러리 자동 빌드 (build.yml)

storefront 리포에 push가 올 때마다 (앱 리포에서 HTML이 복사되어 올 때 포함):

1. apps/ 폴더의 모든 HTML 파일 스캔
2. 각 HTML에서 메타 태그 추출 (app-title, creators, workshop-date, description, thumbnail)
3. 갤러리 페이지(index.html) 자동 재생성 또는 앱 목록 JSON 업데이트
4. 각 앱 HTML에 wrapper.js `<script>` 태그가 없으면 자동 삽입

### 4. 앱 리포용 GitHub Action 템플릿 (deploy-template.yml)

새 앱 리포를 만들 때 복사해서 쓸 수 있는 GitHub Action 템플릿.
앱 리포에서 push하면 storefront/apps/ 폴더에 HTML을 자동 복사.

```yaml
name: Deploy to Market
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Copy to storefront
        uses: dmnemec/copy_file_to_another_repo_action@main
        env:
          API_TOKEN_GITHUB: ${{ secrets.MARKET_TOKEN }}
        with:
          source_file: 'index.html'
          destination_repo: 'superlessai-market/storefront'
          destination_folder: 'apps'
          destination_branch_name: 'main'
          rename: 'APP_NAME_HERE.html'
```

`MARKET_TOKEN`은 GitHub Personal Access Token. org의 secret으로 등록 필요.

## 앱 HTML 메타 태그 규격

각 앱 HTML 파일의 `<head>` 안에 반드시 포함:

```html
<meta name="app-title" content="앱 제목">
<meta name="creators" content="기여자1, 기여자2, 기여자3">
<meta name="workshop-date" content="2026-03-02">
<meta name="description" content="앱 설명 한 줄">
```

선택:
```html
<meta name="thumbnail" content="thumbnail.png">
```

## AdSense 설정

- **Publisher ID:** `ca-pub-2865941930849930` (설정 완료)
- AdSense는 사이트 전체에 1회 등록 (market.superless.ai)
- 수익은 URL(페이지) 단위로 트래킹 → 앱별 정산 가능
- `wrapper.js`가 모든 앱 페이지에 AdSense 스크립트 + 광고 슬롯 자동 삽입
- 광고 위치: 상단 바 아래 (슬롯 1) + 페이지 하단 (슬롯 2) — 수동 배치 방식
- `data-ad-slot`은 현재 `"auto"` → AdSense 대시보드에서 광고 단위 생성 후 실제 슬롯 ID로 교체 필요
- 앱 HTML에는 `<script src="/template/wrapper.js"></script>` 한 줄만 추가하면 됨

## 수익 분배 구조

- 플랫폼(Superless): 20%
- 기여자: 80% (앱별 기여자 수로 균등 분배, 1/N)
- 앱별 수익은 AdSense URL별 트래킹으로 분리
- 정산: 분기별, 구글 시트로 관리
- 월 수익 50만원 초과 앱: 개별 계약 전환 + 모바일 앱 전환 검토 (선택적)

## 모바일 앱 전환 (나중에)

월 수익 50만원 초과 앱 중 선택적으로:

- Capacitor로 HTML을 WebView 래핑 → 네이티브 앱
- AdSense → AdMob 교체 (Capacitor AdMob 플러그인)
- 앱 리포가 독립되어 있어서 Capacitor 설정만 추가하면 됨

## 디자인 가이드

- 브랜드: SUPERLESS
- 갤러리 컨셉: 슈퍼마켓 진열대. 앱들이 빽빽하게 진열된 느낌.
- 앱이 적을 때도 성립하되, 50개 100개 쌓이면 압도적으로 보이는 레이아웃
- Superless 기존 비주얼: 빨간 배경, 노이즈 텍스처, 미니멀 타이포그래피

## 작업 순서

1. storefront 리포 구조 세팅 (index.html, template/wrapper.js, apps/ 폴더)
2. wrapper.js 구현
3. 갤러리 페이지(index.html) 구현 — apps/ 폴더 기반 자동 생성
4. GitHub Action (build.yml) — push 시 갤러리 자동 업데이트 + wrapper 삽입
5. 앱 리포용 deploy-template.yml 작성
6. 테스트: 더미 앱 HTML 3개 넣어서 갤러리 동작 확인
7. Cloudflare Pages 연결 (수동 — 호호님이 Cloudflare 대시보드에서)
8. market.superless.ai 도메인 연결 (수동 — Cloudflare DNS)
9. AdSense 신청 (수동 — 콘텐츠가 있어야 승인)

## 주의사항

- 참가자는 코드를 모르고 GitHub도 안 씀. 모든 배포는 호호님이 처리.
- 앱 HTML은 순수 HTML 단일 파일. 프레임워크 없음.
- wrapper.js는 앱의 기존 동작을 방해하면 안 됨. 비침습적으로 삽입.
- 앱이 500개가 되어도 정적 파일이라 문제 없음.
