# CLAUDE.md — market.superless.ai

## 프로젝트 개요

Superless AI 워크샵에서 참가자들과 함께 프롬프팅으로 만든 SPA를 모아서 보여주는 앱 마켓 플랫폼.
각 앱에 Google AdSense를 붙여 광고 수익을 기여자들과 나눈다.

- **URL:** market.superless.ai
- **호스팅:** Cloudflare Workers (Pages는 deprecated, Workers로 통일)
- **Cloudflare 계정:** superless.ai 도메인이 있는 계정에서 모든 프로젝트 관리
- **이 리포:** `superlessai-market/storefront` — 갤러리 + 라우팅 Worker
- **앱 리포:** `superlessai-market/` org 아래 앱마다 별도 리포 + 별도 Worker

## URL 구조

```
market.superless.ai/                → 갤러리 (itch.io 스타일)
market.superless.ai/facebattle      → FaceBattle 앱
market.superless.ai/kyoto-guide     → 교토 여행 가이드 앱
market.superless.ai/diet-manager    → 식단매니저 앱
```

서브도메인 안 씀. 중간 경로(/apps/ 등) 없음. `market.superless.ai/앱이름`으로 직접 접근.

## 아키텍처

```
GitHub Org: superlessai-market
  ├── storefront/              ← 이 리포 (갤러리 + 라우팅 Worker)
  │   ├── src/
  │   │   └── index.js         ← Worker 스크립트 (라우팅 로직)
  │   ├── public/
  │   │   ├── index.html       ← 갤러리 페이지
  │   │   └── thumbnails/      ← 앱 썸네일 이미지
  │   ├── apps.json            ← 앱 목록 + Worker URL 매핑
  │   └── wrangler.toml        ← Cloudflare Worker 설정
  │
  ├── FaceBattle/              ← 앱 리포 (독립, 팀이 관리)
  │   ├── index.html
  │   ├── style.css
  │   ├── script.js
  │   └── wrangler.toml
  │
  ├── kyoto-guide/             ← 앱 리포 (독립)
  └── ...
```

## 라우팅 구조

storefront Worker가 요청을 받아서 라우팅:

```
사용자: market.superless.ai/facebattle
    ↓
storefront Worker (라우팅)
    - / → 갤러리 페이지 서빙
    - /facebattle → facebattle Worker (.workers.dev)로 프록시
    - /kyoto-guide → kyoto-guide Worker (.workers.dev)로 프록시
    ↓
각 앱 Worker가 응답 반환
```

- 각 앱 Worker는 커스텀 도메인 없이 `.workers.dev` URL만 가짐
- storefront Worker가 path를 보고 해당 앱 Worker로 요청을 넘겨줌
- 앱 추가 시 storefront의 라우팅 설정(apps.json)에 한 줄 추가

### apps.json (라우팅 + 갤러리 데이터)

```json
[
  {
    "name": "FaceBattle",
    "slug": "facebattle",
    "worker_url": "https://facebattle.super-1d0.workers.dev",
    "description": "AI 얼굴 대결",
    "thumbnail": "facebattle.png"
  },
  {
    "name": "교토 여행 가이드",
    "slug": "kyoto-guide",
    "worker_url": "https://kyoto-guide.xxxx.workers.dev",
    "description": "70대 부부를 위한 맞춤 교토 여행",
    "thumbnail": "kyoto-guide.png"
  }
]
```

- `slug`: URL 경로 (market.superless.ai/slug)
- `worker_url`: 해당 앱 Worker의 .workers.dev 주소
- 갤러리에서도 이 JSON을 읽어서 카드 생성

### storefront Worker 스크립트 (src/index.js)

```javascript
// 핵심 로직 예시
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.split('/')[1]; // 첫 번째 경로 세그먼트

    if (!path || path === '') {
      // 루트: 갤러리 페이지 서빙
      return env.ASSETS.fetch(request);
    }

    // apps.json에서 매칭되는 앱 찾기
    const apps = await getApps(); // apps.json 로드
    const app = apps.find(a => a.slug === path);

    if (app) {
      // 해당 앱 Worker로 프록시
      const appUrl = new URL(request.url);
      appUrl.hostname = new URL(app.worker_url).hostname;
      appUrl.pathname = url.pathname.replace(`/${path}`, '') || '/';
      return fetch(appUrl.toString(), request);
    }

    // 404
    return new Response('Not Found', { status: 404 });
  }
};
```

## 앱 리포 구조

각 앱은 독립 리포 + 독립 Worker. 팀이 자기 리포에서 자유롭게 관리.

### 파일 구조

```
FaceBattle/
  ├── index.html           ← 앱 본체 (AdSense 코드 포함)
  ├── style.css            ← (선택)
  ├── script.js            ← (선택)
  ├── images/              ← (선택)
  ├── wrangler.toml        ← Cloudflare Worker 설정
  └── LICENSE              ← CC BY-NC-ND 4.0
```

### wrangler.toml (앱 리포 템플릿)

```toml
name = "facebattle"
compatibility_date = "2026-03-14"

[assets]
directory = "./"
not_found_handling = "single-page-application"
```

앱마다 `name`만 바꾸면 됨. 커스텀 도메인 설정 불필요.

### AdSense 코드 (각 앱 HTML에 직접 삽입)

워크샵에서 앱 만들 때 이 템플릿으로 시작:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>앱 제목</title>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2865941930849930"
    crossorigin="anonymous"></script>
</head>
<body>
  <!-- 앱 내용 -->
</body>
</html>
```

### LICENSE (각 앱 리포에 포함)

```
This work is licensed under CC BY-NC-ND 4.0
https://creativecommons.org/licenses/by-nc-nd/4.0/

Commercial use is exclusively permitted on market.superless.ai
© Superless (superless.ai)
```

## 앱 추가 워크플로우

워크샵 끝나고 호호님이 하는 일:

```
1. superlessai-market org에 앱 리포 생성
2. 워크샵에서 만든 파일들 업로드
3. wrangler.toml 추가 (name만 변경)
4. LICENSE 파일 추가
5. AdSense 코드가 HTML <head>에 있는지 확인
6. npx wrangler deploy 로 앱 Worker 배포 → .workers.dev URL 확인
7. storefront의 apps.json에 앱 정보 한 줄 추가 (slug, worker_url, description 등)
8. storefront 재배포 (npx wrangler deploy)
```

앱당 약 5분. 커스텀 도메인 추가 작업 없음.

## AdSense 설정

- **Publisher ID:** `ca-pub-2865941930849930`
- `superless.ai`로 등록 → `market.superless.ai` 하위 모든 경로 커버
- 각 앱 HTML에 AdSense 스크립트 직접 포함
- 수익은 URL 경로별로 트래킹 가능 (`/facebattle`, `/kyoto-guide` 등)
- storefront 갤러리 페이지(루트)에는 광고 없음

## 수익 분배 구조

- 플랫폼(Superless): 20%
- 기여자: 80%
- **월 수익 $500 이하:** 기여자 간 균등 분배 (1/N). 기여도 상관없이.
- **월 수익 $500 초과:** 기여자 간 별도 협의를 통해 기여도 기반 배분으로 전환.
- 수익 리포트: 분기별(3개월마다) 이메일로 공유
- 정산 관리: 구글 시트 (앱명 / 기여자 이름)

## 모바일 앱 전환 (나중에)

월 수익 $500 초과 앱 중 선택적으로:

- Capacitor로 HTML을 WebView 래핑 → 네이티브 앱
- AdSense → AdMob 교체 (Capacitor AdMob 플러그인)
- 앱 리포가 독립되어 있어서 Capacitor 설정만 추가하면 됨

## 디자인 가이드

- 브랜드: SUPERLESS
- 갤러리 컨셉: 슈퍼마켓 진열대. 앱들이 빽빽하게 진열된 느낌.
- 앱이 적을 때도 성립하되, 50개 100개 쌓이면 압도적으로 보이는 레이아웃
- Superless 기존 비주얼: 빨간 배경, 노이즈 텍스처, 미니멀 타이포그래피

## 작업 순서

1. storefront Worker 스크립트 구현 (라우팅 로직)
2. 갤러리 페이지(index.html) 구현 — apps.json 기반
3. apps.json 작성 (기존 앱 목록 + worker_url)
4. wrangler.toml 세팅
5. `npx wrangler deploy`로 storefront 배포
6. Cloudflare에서 market.superless.ai 커스텀 도메인 연결
7. 기존 앱(FaceBattle 등) wrangler.toml 추가 + 배포
8. apps.json에 배포된 앱들의 .workers.dev URL 추가
9. storefront 재배포
10. AdSense 승인 완료

## 주의사항

- 참가자는 코드를 모르고 GitHub도 안 씀. 모든 배포는 호호님이 처리.
- 앱은 순수 HTML (단일 또는 복수 파일). 프레임워크 없음.
- 각 앱은 완전히 독립된 Worker. 한 앱이 깨져도 다른 앱에 영향 없음.
- Cloudflare 프로젝트는 반드시 superless.ai가 있는 계정에서 생성.
- 커스텀 도메인은 storefront(market.superless.ai)에만 설정. 각 앱은 .workers.dev URL 사용.
- GitHub Action 사용 안 함. 리포 간 의존성 없음.
- Cloudflare Pages가 아닌 Workers 사용 (Pages는 deprecated).
- storefront Worker의 프록시가 앱 내부의 상대 경로(CSS, JS, 이미지)를 올바르게 처리해야 함. 경로 rewrite 주의.
