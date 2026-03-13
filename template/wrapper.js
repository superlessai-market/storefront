(function () {
  // --- AdSense ---
  const ad = document.createElement('script');
  ad.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2865941930849930';
  ad.crossOrigin = 'anonymous';
  ad.async = true;
  document.head.appendChild(ad);

  // --- 메타 태그 읽기 ---
  function getMeta(name) {
    const el = document.querySelector('meta[name="' + name + '"]');
    return el ? el.getAttribute('content') : '';
  }

  const creators = getMeta('creators');
  const workshopDate = getMeta('workshop-date');

  // --- 상단 바 ---
  const topBar = document.createElement('div');
  topBar.id = 'sl-top-bar';
  topBar.innerHTML =
    '<a href="/" style="display:flex;align-items:center;gap:6px;text-decoration:none;color:#fff;font-weight:700;font-size:14px;">' +
      '<span style="font-size:18px;">S</span>UPERLESS Market' +
    '</a>' +
    '<a href="/" style="color:rgba(255,255,255,0.6);text-decoration:none;font-size:13px;">&larr; 갤러리로 돌아가기</a>';
  topBar.style.cssText =
    'position:fixed;top:0;left:0;right:0;z-index:99999;' +
    'display:flex;align-items:center;justify-content:space-between;' +
    'padding:8px 16px;' +
    'background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);' +
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;';
  document.body.prepend(topBar);

  // body에 상단 바 높이만큼 패딩 추가
  document.body.style.paddingTop = '44px';

  // --- 광고 슬롯 (상단) ---
  const adTop = document.createElement('div');
  adTop.id = 'sl-ad-top';
  adTop.style.cssText = 'width:100%;text-align:center;background:rgba(0,0,0,0.03);padding:4px 0;';
  adTop.innerHTML =
    '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2865941930849930" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>';
  topBar.insertAdjacentElement('afterend', adTop);

  // --- 광고 슬롯 (하단) ---
  const adBottom = document.createElement('div');
  adBottom.id = 'sl-ad-bottom';
  adBottom.style.cssText = 'width:100%;text-align:center;background:rgba(0,0,0,0.03);padding:4px 0;';
  adBottom.innerHTML =
    '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2865941930849930" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>';

  // --- 푸터 ---
  const footer = document.createElement('div');
  footer.id = 'sl-footer';
  var footerParts = [];
  if (creators) footerParts.push('만든 사람: ' + creators);
  if (workshopDate) footerParts.push('워크샵: ' + workshopDate);
  footerParts.push('Powered by <a href="/" style="color:rgba(255,255,255,0.8);text-decoration:underline;">SUPERLESS</a>');
  footer.innerHTML = footerParts.join(' · ');
  footer.style.cssText =
    'width:100%;text-align:center;padding:16px;' +
    'font-size:12px;color:rgba(255,255,255,0.5);' +
    'background:rgba(0,0,0,0.85);' +
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;';

  document.body.appendChild(adBottom);
  document.body.appendChild(footer);

  // --- AdSense push ---
  ad.onload = function () {
    try {
      var slots = document.querySelectorAll('.adsbygoogle');
      for (var i = 0; i < slots.length; i++) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {}
  };
})();
