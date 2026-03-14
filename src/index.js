import apps from '../apps.json';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const slug = url.pathname.split('/')[1];

    // 루트 → 갤러리 페이지
    if (!slug) {
      return env.ASSETS.fetch(request);
    }

    // apps.json에서 매칭되는 앱 찾기
    const app = apps.find(a => a.slug === slug);

    if (!app) {
      // 앱이 아니면 정적 파일 시도 (thumbnails 등)
      return env.ASSETS.fetch(request);
    }

    // /slug → /slug/ 리다이렉트 (상대경로 정상 동작을 위해)
    if (url.pathname === `/${slug}`) {
      return Response.redirect(`${url.origin}/${slug}/`, 301);
    }

    // 앱 Worker로 프록시
    const appUrl = new URL(app.worker_url);
    const newPath = url.pathname.substring(slug.length + 1) || '/';
    const proxyUrl = `${appUrl.origin}${newPath}${url.search}`;

    const res = await fetch(proxyUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

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
