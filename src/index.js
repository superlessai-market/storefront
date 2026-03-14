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
    const proxyUrl = new URL(request.url);
    proxyUrl.hostname = appUrl.hostname;
    proxyUrl.protocol = appUrl.protocol;
    proxyUrl.pathname = url.pathname.substring(slug.length + 1) || '/';

    return fetch(new Request(proxyUrl.toString(), request));
  }
};
