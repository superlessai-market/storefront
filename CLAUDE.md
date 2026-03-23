# CLAUDE.md — superless.app

## 프로젝트 개요

Superless AI 워크샵에서 참가자들과 함께 프롬프팅으로 만든 SPA를 모아서 보여주는 앱 마켓 플랫폼.
각 앱에 Google AdSense를 붙여 광고 수익을 기여자들과 나눈다.

- **URL:** superless.app
- **호스팅:** Cloudflare Workers (Pages는 deprecated, Workers로 통일)
- **Cloudflare 계정:** superless.app 도메인이 있는 계정에서 모든 프로젝트 관리
- **이 리포:** `superlessai-market/storefront` — 갤러리 + 라우팅 Worker
- **앱 리포:** `superlessai-market/` org 아래 앱마다 별도 리포 + 별도 Worker

## URL 구조

```
superless.app/                → 갤러리
superless.app/facebattle      → FaceBattle 앱
superless.app/kyoto-guide     → 교토 여행 가이드 앱
```

서브도메인 안 씀. 중간 경로(/apps/ 등) 없음. `superless.app/앱이름`으로 직접 접근.

## 리포 구조

```
storefront/                      ← 이 리포
  ├── src/
  │   └── index.js               ← Worker 스크립트 (라우팅 + 프록시 + HTMLRewriter)
  ├── public/
  │   ├── index.html             ← 갤러리 페이지 (apps.json fetch해서 카드 렌더링)
  │   └── apps.json              ← 앱 목록 (라우팅 + 갤러리 데이터 소스)
  ├── template/
  │   └── wrapper.js             ← AdSense + 공통 헤더/푸터 삽입 스크립트
  └── wrangler.toml              ← Cloudflare Worker 설정
```

## 라우팅 동작

storefront Worker(src/index.js)가 모든 요청을 받아서 처리:

```
요청 → storefront Worker
  ├── /                        → public/ 정적 파일 서빙 (갤러리)
  ├── /{slug}                  → 301 → /{slug}/ (trailing slash 리다이렉트)
  ├── /{slug}/*                → 해당 앱 Worker(.workers.dev)로 프록시
  │                               └── HTML 응답은 HTMLRewriter로 절대경로 rewrite
  └── /* (slug 매칭 안됨)      → Referer 헤더로 앱 판단 → 프록시
                                  └── Referer도 없으면 정적 파일 시도
```

### 프록시 처리 상세

1. **경로 프록시:** `/facebattle/style.css` → `facebattle.workers.dev/style.css`
2. **HTML 절대경로 rewrite:** 앱 HTML의 `<script src="/assets/app.js">` → `<script src="/facebattle/assets/app.js">`
   - 대상 속성: src, href, action, poster, data, srcset
   - 프로토콜 상대경로(`//cdn.example.com`)는 건드리지 않음
3. **Referer 기반 프록시:** JS에서 `fetch('/models/xxx')` 같은 런타임 절대경로 요청 → Referer 헤더로 어느 앱인지 판단 → 해당 앱 Worker로 프록시

## apps.json

`public/apps.json` — 라우팅과 갤러리 양쪽에서 사용.

```json
[
  {
    "name": "FaceBattle",
    "slug": "facebattle",
    "worker_url": "https://facebattle.iron-8c6.workers.dev",
    "description": "AI 얼굴 대결"
  }
]
```

| 필드 | 설명 |
|------|------|
| `name` | 갤러리에 표시되는 앱 이름 |
| `slug` | URL 경로 (superless.app/{slug}) |
| `worker_url` | 앱 Worker의 .workers.dev 주소 |
| `description` | 앱 설명 (현재 갤러리 미사용, 추후 확장용) |

## 앱 리포 필수 구조

각 앱은 독립 리포 + 독립 Worker.

```
앱이름/
  ├── index.html             ← 앱 본체
  ├── thumbnail.png          ← 갤러리 썸네일 (필수)
  ├── wrangler.toml          ← Cloudflare Worker 설정
  ├── LICENSE                ← CC BY-NC-ND 4.0
  └── (기타 파일들)          ← style.css, script.js, images/, models/ 등
```

### thumbnail.png

- 갤러리에서 `/{slug}/thumbnail.png` 경로로 프록시해서 표시
- 9:16 비율로 크롭, 위쪽부터 보여줌 (object-position: top)
- 아무 사이즈나 OK. CSS에서 자동 크롭

### wrangler.toml (앱 리포)

```toml
name = "앱이름"
compatibility_date = "2026-03-14"

[assets]
directory = "./"
not_found_handling = "single-page-application"
```

`name`만 바꾸면 됨.

### LICENSE (각 앱 리포)

```
This work is licensed under CC BY-NC-ND 4.0
https://creativecommons.org/licenses/by-nc-nd/4.0/

Commercial use is exclusively permitted on superless.app
© Superless (superless.app)
```

## 앱 추가 체크리스트

```
[ ] 1. superlessai-market org에 앱 리포 생성
[ ] 2. 워크샵에서 만든 파일들 업로드
[ ] 3. thumbnail.png 추가 (앱 스크린샷)
[ ] 4. wrangler.toml 추가 (name만 변경)
[ ] 5. LICENSE 파일 추가
[ ] 6. npx wrangler deploy → .workers.dev URL 확인
[ ] 7. storefront/public/apps.json에 항목 추가:
       {
         "name": "앱 이름",
         "slug": "앱-슬러그",
         "worker_url": "https://앱이름.xxx.workers.dev",
         "description": "앱 설명"
       }
[ ] 8. storefront 커밋 푸시 (자동 배포)
[ ] 9. superless.app/슬러그/ 접속 확인
```

### slug 규칙

- 영문 소문자 + 하이픈만 사용 (예: `kyoto-guide`, `diet-manager`)
- 짧고 명확하게
- 한번 정하면 변경 금지 (URL이 바뀌면 기존 링크 깨짐)

## AdSense 설정

- **Publisher ID:** `ca-pub-2865941930849930`
- `superless.app`으로 등록 → `superless.app` 하위 모든 경로 커버
- 각 앱 HTML에 AdSense 스크립트 직접 포함
- 수익은 URL 경로별로 트래킹 가능 (`/facebattle`, `/kyoto-guide` 등)
- storefront 갤러리 페이지(루트)에는 광고 없음

## 수익 분배 구조

- 플랫폼(Superless): 20%
- 기여자: 80%
- **월 수익 $500 이하:** 기여자 간 균등 분배 (1/N)
- **월 수익 $500 초과:** 기여도 기반 배분 (별도 협의)
- 수익 리포트: 분기별 이메일
- 정산 관리: 구글 시트

## 주의사항

- 참가자는 코드를 모르고 GitHub도 안 씀. 모든 배포는 호호님이 처리.
- 각 앱은 완전히 독립된 Worker. 한 앱이 깨져도 다른 앱에 영향 없음.
- Cloudflare 프로젝트는 반드시 superless.app이 있는 계정에서 생성.
- 커스텀 도메인은 storefront(superless.app)에만 설정. 각 앱은 .workers.dev URL 사용.
- GitHub Action 사용 안 함. 리포 간 의존성 없음.
- storefront Worker 프록시가 HTMLRewriter + Referer 기반으로 앱 내부 경로를 처리함.
