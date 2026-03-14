import apps from '../apps.json';

function findAppBySlug(slug) {
  return apps.find(a => a.slug === slug);
}

function proxyToApp(app, pathname, search, request) {
  const appUrl = new URL(app.worker_url);
  const proxyUrl = `${appUrl.origin}${pathname}${search}`;
  return fetch(proxyUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const slug = url.pathname.split('/')[1];

    // 루트 → 갤러리 페이지
    if (!slug) {
      return env.ASSETS.fetch(request);
    }

    // apps.json에서 매칭되는 앱 찾기
    const app = findAppBySlug(slug);

    if (!app) {
      // JS에서 절대경로(/models/..., /scan.gif 등)로 요청하는 경우
      // Referer 헤더로 어느 앱에서 온 요청인지 판단
      const referer = request.headers.get('referer');
      if (referer) {
        try {
          const refererSlug = new URL(referer).pathname.split('/')[1];
          const refererApp = findAppBySlug(refererSlug);
          if (refererApp) {
            return proxyToApp(refererApp, url.pathname, url.search, request);
          }
        } catch (e) {}
      }
      return env.ASSETS.fetch(request);
    }

    // /slug → /slug/ 리다이렉트 (상대경로 정상 동작을 위해)
    if (url.pathname === `/${slug}`) {
      return Response.redirect(`${url.origin}/${slug}/`, 301);
    }

    // 앱 Worker로 프록시
    const newPath = url.pathname.substring(slug.length + 1) || '/';
    const res = await proxyToApp(app, newPath, url.search, request);

    // HTML 응답이면 절대경로를 /slug/ 접두사로 rewrite
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      return new HTMLRewriter()
        .on('script[src^="/"]', {
          element(el) {
            el.setAttribute('src', `/${slug}${el.getAttribute('src')}`);
          }
        })
        .on('link[href^="/"]', {
          element(el) {
            el.setAttribute('href', `/${slug}${el.getAttribute('href')}`);
          }
        })
        .on('img[src^="/"]', {
          element(el) {
            el.setAttribute('src', `/${slug}${el.getAttribute('src')}`);
          }
        })
        .on('a[href^="/"]', {
          element(el) {
            el.setAttribute('href', `/${slug}${el.getAttribute('href')}`);
          }
        })
        .transform(res);
    }

    return res;
  }
};
