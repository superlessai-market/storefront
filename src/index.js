import apps from '../public/apps.json';

/**
 * storefront Worker — market.superless.ai
 *
 * 라우팅:
 *   /              → 갤러리 페이지 (public/)
 *   /{slug}        → 301 → /{slug}/
 *   /{slug}/*      → 해당 앱 Worker(.workers.dev)로 프록시
 *   /*             → Referer 기반 앱 프록시 (JS 절대경로 대응)
 *
 * 앱 추가: apps.json에 한 줄 추가 → 재배포
 */

// O(1) 조회용 Map
const appMap = new Map(apps.map(a => [a.slug, a]));

function getApp(slug) {
  return appMap.get(slug);
}

function getAppFromReferer(request) {
  const referer = request.headers.get('referer');
  if (!referer) return null;
  try {
    const slug = new URL(referer).pathname.split('/')[1];
    return slug ? getApp(slug) : null;
  } catch {
    return null;
  }
}

async function proxyToApp(app, path, search, request) {
  const origin = new URL(app.worker_url).origin;
  return fetch(`${origin}${path}${search}`, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
}

function rewriteHtml(response, slug) {
  const prefix = `/${slug}`;

  function rewriteAttr(attr) {
    return {
      element(el) {
        const val = el.getAttribute(attr);
        if (val && val.startsWith('/') && !val.startsWith('//')) {
          el.setAttribute(attr, `${prefix}${val}`);
        }
      }
    };
  }

  return new HTMLRewriter()
    // src: script, img, video, audio, source, iframe, embed, input
    .on('[src^="/"]', rewriteAttr('src'))
    // href: link, a
    .on('[href^="/"]', rewriteAttr('href'))
    // action: form
    .on('[action^="/"]', rewriteAttr('action'))
    // poster: video
    .on('[poster^="/"]', rewriteAttr('poster'))
    // data: object
    .on('[data^="/"]', rewriteAttr('data'))
    // srcset: img, source (쉼표 구분, 각 URL 앞에 prefix)
    .on('[srcset]', {
      element(el) {
        const srcset = el.getAttribute('srcset');
        if (!srcset) return;
        const rewritten = srcset.split(',').map(entry => {
          const trimmed = entry.trim();
          if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
            return entry.replace(/\//, `${prefix}/`);
          }
          return entry;
        }).join(',');
        el.setAttribute('srcset', rewritten);
      }
    })
    .transform(response);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const slug = url.pathname.split('/')[1];

    // 루트 → 갤러리
    if (!slug) {
      return env.ASSETS.fetch(request);
    }

    const app = getApp(slug);

    // slug가 앱이 아닌 경우 → Referer 기반 프록시 또는 정적 파일
    if (!app) {
      const refererApp = getAppFromReferer(request);
      if (refererApp) {
        return proxyToApp(refererApp, url.pathname, url.search, request);
      }
      return env.ASSETS.fetch(request);
    }

    // /slug → /slug/ 리다이렉트
    if (url.pathname === `/${slug}`) {
      return Response.redirect(`${url.origin}/${slug}/`, 301);
    }

    // 앱 Worker로 프록시
    const subPath = url.pathname.substring(slug.length + 1) || '/';

    // HTML이 아닌 정적 에셋은 엣지 캐시 (1일)
    const isHtml = subPath === '/' || subPath.endsWith('.html');
    if (!isHtml) {
      const cache = caches.default;
      const cacheKey = new Request(url.toString(), request);
      const hit = await cache.match(cacheKey);
      if (hit) return hit;

      const res = await proxyToApp(app, subPath, url.search, request);
      const cached = new Response(res.body, res);
      cached.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      await cache.put(cacheKey, cached.clone());
      return cached;
    }

    const res = await proxyToApp(app, subPath, url.search, request);
    return rewriteHtml(res, slug);
  }
};
