# 새 앱 셋업 프롬프트

market.superless.ai에 새 앱을 추가할 때 이 문서를 Claude에게 전달하세요.
아래 규칙에 따라 필요한 파일들을 생성합니다.

---

## 입력 정보 (앱마다 다른 것)

새 앱을 만들기 전에 아래 정보를 확인하세요:

| 항목 | 예시 (FaceBattle) |
|------|-------------------|
| 앱 이름 EN | Face Battle |
| 앱 이름 KO | 관상 전투력 측정기 |
| 앱 이름 JA | Face Battle |
| 앱 이름 ZH | Face Battle |
| slug | facebattle |
| 서비스 설명 (4개 국어) | 얼굴 사진을 분석하여 가상의 전투력 수치를 산출하는 엔터테인먼트 웹 앱 |
| 데이터 처리 내용 (4개 국어) | 얼굴 사진 → 브라우저 로컬 처리, face-api.js, 분석 후 자동 삭제 |
| 결과물 면책 (4개 국어) | 전투력 수치는 가상이며 사실적 근거 없음 |
| 날짜 | 2026-03-17 |

---

## 1. Static-First 원칙 (필수)

- **React / Vite / SPA 프레임워크 사용 금지** — 처음부터 vanilla HTML/CSS/JS로만
- **HTML이 콘텐츠의 주인** — UI 구조, 텍스트, placeholder는 모두 HTML에 직접 작성
- **JS는 채워넣기만** — 인터랙티브 로직은 백그라운드, 결과만 DOM에 반영
- **빌드 단계 없음** — package.json, node_modules, 번들러 불필요
- **크롤러 테스트** — JS 비활성화 상태에서도 페이지 구조와 콘텐츠가 보여야 함

> 이유: React SPA 구조로 AdSense 심사 거절됨. 크롤러가 빈 페이지로 판단.

---

## 2. 필수 파일 구조

```
앱이름/
├── index.html          ← 앱 본체 (AdSense + 푸터 포함)
├── privacy.html        ← 개인정보 처리방침 (EN/KO/JA/ZH 다국어)
├── terms.html          ← 이용약관 (EN/KO/JA/ZH 다국어)
├── thumbnail.png       ← 갤러리 썸네일
├── wrangler.jsonc      ← Cloudflare Workers 배포 설정
├── LICENSE             ← CC BY-NC-ND 4.0
└── (기타 파일들)       ← style.css, js/, images/ 등
```

---

## 3. privacy.html 템플릿

아래 HTML에서 `<!-- APP: 설명 -->` 주석이 있는 부분만 앱에 맞게 교체하세요.
나머지는 모든 앱에서 동일합니다.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- APP: 앱 이름 EN -->
  <title>Privacy Policy | 앱이름EN</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #f0f2f5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #222;
      padding: 40px 20px;
    }
    .container {
      max-width: 700px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      padding: 40px 32px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .lang-bar {
      display: flex;
      gap: 6px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .lang-btn {
      background: #e8e8e8;
      border: none;
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    .lang-btn.active {
      background: #222;
      color: #fff;
    }
    .lang-section { display: none; }
    .lang-section.active { display: block; }
    h1 { font-size: 1.8rem; margin-bottom: 8px; color: #000; }
    h2 { font-size: 1.2rem; margin-top: 28px; margin-bottom: 8px; color: #000; }
    p, li { font-size: 0.95rem; line-height: 1.8; color: #333; }
    ul { margin-left: 20px; margin-bottom: 12px; }
    .updated { color: #999; font-size: 0.85rem; margin-bottom: 24px; }
    a { color: #333; }
    a:hover { color: #000; }
    .back { display: inline-block; margin-top: 32px; color: #333; font-weight: bold; text-decoration: none; }
    .back:hover { color: #000; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="lang-bar">
      <button class="lang-btn active" onclick="switchLang('en')">English</button>
      <button class="lang-btn" onclick="switchLang('ko')">한국어</button>
      <button class="lang-btn" onclick="switchLang('ja')">日本語</button>
      <button class="lang-btn" onclick="switchLang('zh')">中文</button>
    </div>

    <!-- ======================== English ======================== -->
    <div id="lang-en" class="lang-section active">
      <h1>Privacy Policy</h1>
      <!-- APP: 날짜 EN -->
      <p class="updated">Last updated: March 17, 2026</p>
      <!-- APP: 앱 이름 EN -->
      <p>SUPERLESS Inc. ("Company") values the privacy of users of "앱이름EN" ("Service") and complies with applicable laws and regulations.</p>

      <h2>1. Personal Information Collected</h2>
      <p>This Service <strong>does not collect or store any personal information on its servers.</strong></p>
      <ul>
        <!-- APP: 데이터 처리 내용 EN (앱에서 어떤 데이터를 어떻게 처리하는지) -->
        <li>항목 1</li>
        <li>항목 2</li>
        <li>항목 3</li>
      </ul>

      <!-- 아래는 모든 앱 공통 — 수정 금지 -->
      <h2>2. Cookies and Advertising</h2>
      <ul>
        <li>This Service displays advertisements through Google AdSense, which may use cookies to serve ads.</li>
        <li>For more information about Google's use of cookies, please refer to <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google's Advertising Policies</a>.</li>
        <li>Users may disable cookies through their browser settings.</li>
      </ul>

      <h2>3. Analytics</h2>
      <ul>
        <li>This Service may use Google Analytics to collect anonymized visitor statistics such as browser type, device type, and geographic region.</li>
        <li>This data is used solely for improving the Service and does not personally identify individual users.</li>
      </ul>

      <h2>4. Third-Party Disclosure</h2>
      <p>The Company does not provide personal information to third parties, except as required by law or with user consent. Advertising cookies from Google AdSense and analytics data from Google Analytics are subject to Google's policies.</p>

      <h2>5. User Rights</h2>
      <ul>
        <li>Since this Service does not store personal information, no separate requests for access, correction, or deletion are necessary.</li>
        <li>Advertising-related cookies can be managed directly through browser settings.</li>
      </ul>

      <h2>6. Children's Privacy</h2>
      <p>This Service is not intended for children under the age of 14. The Company does not knowingly collect personal information from children under 14. If a parent or guardian becomes aware that their child has used the Service, please contact us.</p>

      <h2>7. Changes to This Policy</h2>
      <p>The Company may update this Privacy Policy as necessary. Any changes will be posted within the Service with an updated revision date. Continued use of the Service after changes constitutes acceptance of the updated policy.</p>

      <h2>8. Contact</h2>
      <ul>
        <li>Company: SUPERLESS Inc.</li>
        <li>Email: super@superless.ai</li>
      </ul>
      <a href="./" class="back">&larr; Back to App</a>
    </div>

    <!-- ======================== 한국어 ======================== -->
    <div id="lang-ko" class="lang-section">
      <h1>개인정보 처리방침</h1>
      <!-- APP: 날짜 KO -->
      <p class="updated">최종 수정일: 2026년 3월 17일</p>
      <!-- APP: 앱 이름 KO -->
      <p>슈퍼레스 주식회사(SUPERLESS Inc., 이하 "회사")는 「앱이름KO」(이하 "서비스") 이용자의 개인정보를 중요시하며, 관련 법령을 준수합니다.</p>

      <h2>1. 수집하는 개인정보</h2>
      <p>본 서비스는 <strong>서버에 어떠한 개인정보도 수집·저장하지 않습니다.</strong></p>
      <ul>
        <!-- APP: 데이터 처리 내용 KO -->
        <li>항목 1</li>
        <li>항목 2</li>
        <li>항목 3</li>
      </ul>

      <!-- 아래는 모든 앱 공통 -->
      <h2>2. 쿠키 및 광고</h2>
      <ul>
        <li>본 서비스는 Google AdSense를 통해 광고를 제공하며, Google이 쿠키를 사용하여 광고를 게재할 수 있습니다.</li>
        <li>Google의 쿠키 사용에 대한 자세한 내용은 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google 광고 정책</a>을 참고하시기 바랍니다.</li>
        <li>사용자는 브라우저 설정에서 쿠키를 비활성화할 수 있습니다.</li>
      </ul>

      <h2>3. 분석 도구</h2>
      <ul>
        <li>본 서비스는 Google Analytics를 사용하여 브라우저 유형, 기기 유형, 지역 정보 등 익명화된 방문자 통계를 수집할 수 있습니다.</li>
        <li>이 데이터는 서비스 개선 목적으로만 사용되며, 개인을 식별하지 않습니다.</li>
      </ul>

      <h2>4. 제3자 제공</h2>
      <p>회사는 법적 요구 또는 이용자 동의가 있는 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다. Google AdSense 광고 쿠키 및 Google Analytics 분석 데이터는 Google의 정책에 따릅니다.</p>

      <h2>5. 이용자의 권리</h2>
      <ul>
        <li>본 서비스는 개인정보를 저장하지 않으므로 별도의 열람·수정·삭제 요청이 필요하지 않습니다.</li>
        <li>광고 관련 쿠키는 브라우저 설정에서 직접 관리할 수 있습니다.</li>
      </ul>

      <h2>6. 아동의 개인정보</h2>
      <p>본 서비스는 만 14세 미만의 아동을 대상으로 하지 않으며, 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다. 보호자가 자녀의 서비스 이용 사실을 인지한 경우, 아래 연락처로 문의해 주시기 바랍니다.</p>

      <h2>7. 방침 변경</h2>
      <p>회사는 필요에 따라 본 개인정보 처리방침을 변경할 수 있으며, 변경 시 서비스 내에 수정일과 함께 공지합니다. 변경 후 서비스를 계속 이용하면 변경된 방침에 동의한 것으로 간주됩니다.</p>

      <h2>8. 문의</h2>
      <ul>
        <li>회사명: 슈퍼레스 주식회사 (SUPERLESS Inc.)</li>
        <li>이메일: super@superless.ai</li>
      </ul>
      <a href="./" class="back">&larr; 돌아가기</a>
    </div>

    <!-- ======================== 日本語 ======================== -->
    <div id="lang-ja" class="lang-section">
      <h1>プライバシーポリシー</h1>
      <!-- APP: 날짜 JA -->
      <p class="updated">最終更新日: 2026年3月17日</p>
      <!-- APP: 앱 이름 JA -->
      <p>SUPERLESS Inc.（以下「当社」）は、「앱이름JA」（以下「本サービス」）のユーザーのプライバシーを重視し、関連法令を遵守します。</p>

      <h2>1. 収集する個人情報</h2>
      <p>本サービスは<strong>サーバーにいかなる個人情報も収集・保存しません。</strong></p>
      <ul>
        <!-- APP: 데이터 처리 내용 JA -->
        <li>항목 1</li>
        <li>항목 2</li>
        <li>항목 3</li>
      </ul>

      <!-- 아래는 모든 앱 공통 -->
      <h2>2. Cookieと広告</h2>
      <ul>
        <li>本サービスはGoogle AdSenseを通じて広告を表示しており、Googleが広告配信のためにCookieを使用する場合があります。</li>
        <li>GoogleのCookie使用の詳細については、<a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google広告ポリシー</a>をご参照ください。</li>
        <li>ユーザーはブラウザの設定からCookieを無効にすることができます。</li>
      </ul>

      <h2>3. アクセス解析</h2>
      <ul>
        <li>本サービスはGoogle Analyticsを使用して、ブラウザの種類、デバイスの種類、地域情報などの匿名化された訪問者統計を収集する場合があります。</li>
        <li>このデータはサービス改善のみに使用され、個人を特定するものではありません。</li>
      </ul>

      <h2>4. 第三者への提供</h2>
      <p>当社は、法的要求またはユーザーの同意がある場合を除き、個人情報を第三者に提供しません。Google AdSenseの広告CookieおよびGoogle Analyticsの分析データについては、Googleのポリシーに従います。</p>

      <h2>5. ユーザーの権利</h2>
      <ul>
        <li>本サービスは個人情報を保存しないため、閲覧・修正・削除の個別リクエストは不要です。</li>
        <li>広告関連のCookieはブラウザの設定から直接管理できます。</li>
      </ul>

      <h2>6. 児童のプライバシー</h2>
      <p>本サービスは14歳未満の児童を対象としておらず、14歳未満の児童の個人情報を意図的に収集しません。保護者がお子様の利用を認識した場合は、下記までご連絡ください。</p>

      <h2>7. ポリシーの変更</h2>
      <p>当社は必要に応じて本プライバシーポリシーを変更することがあります。変更はサービス内で更新日とともに告知します。変更後のサービス利用は、更新されたポリシーへの同意とみなされます。</p>

      <h2>8. お問い合わせ</h2>
      <ul>
        <li>会社名: SUPERLESS Inc.</li>
        <li>メール: super@superless.ai</li>
      </ul>
      <a href="./" class="back">&larr; アプリに戻る</a>
    </div>

    <!-- ======================== 中文 ======================== -->
    <div id="lang-zh" class="lang-section">
      <h1>隐私政策</h1>
      <!-- APP: 날짜 ZH -->
      <p class="updated">最后更新日期：2026年3月17日</p>
      <!-- APP: 앱 이름 ZH -->
      <p>SUPERLESS Inc.（以下简称"本公司"）重视"앱이름ZH"（以下简称"本服务"）用户的隐私，并遵守相关法律法规。</p>

      <h2>1. 收集的个人信息</h2>
      <p>本服务<strong>不会在服务器上收集或存储任何个人信息。</strong></p>
      <ul>
        <!-- APP: 데이터 처리 내용 ZH -->
        <li>항목 1</li>
        <li>항목 2</li>
        <li>항목 3</li>
      </ul>

      <!-- 아래는 모든 앱 공통 -->
      <h2>2. Cookie与广告</h2>
      <ul>
        <li>本服务通过Google AdSense展示广告，Google可能会使用Cookie来投放广告。</li>
        <li>有关Google使用Cookie的详细信息，请参阅<a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google广告政策</a>。</li>
        <li>用户可以通过浏览器设置禁用Cookie。</li>
      </ul>

      <h2>3. 数据分析</h2>
      <ul>
        <li>本服务可能使用Google Analytics收集匿名访问者统计数据，如浏览器类型、设备类型和地理区域。</li>
        <li>这些数据仅用于改善服务，不会识别个人身份。</li>
      </ul>

      <h2>4. 第三方披露</h2>
      <p>除法律要求或用户同意外，本公司不会向第三方提供个人信息。Google AdSense的广告Cookie和Google Analytics的分析数据受Google政策约束。</p>

      <h2>5. 用户权利</h2>
      <ul>
        <li>由于本服务不存储个人信息，因此无需单独申请查阅、更正或删除。</li>
        <li>与广告相关的Cookie可以通过浏览器设置直接管理。</li>
      </ul>

      <h2>6. 儿童隐私</h2>
      <p>本服务不面向14岁以下的儿童，也不会故意收集14岁以下儿童的个人信息。如果监护人发现孩子使用了本服务，请通过以下方式联系我们。</p>

      <h2>7. 政策变更</h2>
      <p>本公司可根据需要更新本隐私政策。任何变更将在服务内连同更新日期一起公布。变更后继续使用本服务即表示接受更新后的政策。</p>

      <h2>8. 联系方式</h2>
      <ul>
        <li>公司名称：SUPERLESS Inc.</li>
        <li>电子邮件：super@superless.ai</li>
      </ul>
      <a href="./" class="back">&larr; 返回应用</a>
    </div>
  </div>

  <script>
    function switchLang(lang) {
      document.querySelectorAll('.lang-section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('lang-' + lang).classList.add('active');
      document.querySelector('[onclick="switchLang(\'' + lang + '\')"]').classList.add('active');
    }
    (function() {
      var userLang = (navigator.language || '').toLowerCase();
      if (userLang.startsWith('ko')) switchLang('ko');
      else if (userLang.startsWith('ja')) switchLang('ja');
      else if (userLang.startsWith('zh')) switchLang('zh');
    })();
  </script>
</body>
</html>
```

---

## 4. terms.html 템플릿

아래 HTML에서 `<!-- APP: 설명 -->` 주석이 있는 부분만 앱에 맞게 교체하세요.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- APP: 앱 이름 EN -->
  <title>Terms of Service | 앱이름EN</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #f0f2f5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #222;
      padding: 40px 20px;
    }
    .container {
      max-width: 700px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      padding: 40px 32px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .lang-bar {
      display: flex;
      gap: 6px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .lang-btn {
      background: #e8e8e8;
      border: none;
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    .lang-btn.active {
      background: #222;
      color: #fff;
    }
    .lang-section { display: none; }
    .lang-section.active { display: block; }
    h1 { font-size: 1.8rem; margin-bottom: 8px; color: #000; }
    h2 { font-size: 1.2rem; margin-top: 28px; margin-bottom: 8px; color: #000; }
    p, li { font-size: 0.95rem; line-height: 1.8; color: #333; }
    ul { margin-left: 20px; margin-bottom: 12px; }
    .updated { color: #999; font-size: 0.85rem; margin-bottom: 24px; }
    a { color: #333; }
    a:hover { color: #000; }
    .back { display: inline-block; margin-top: 32px; color: #333; font-weight: bold; text-decoration: none; }
    .back:hover { color: #000; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="lang-bar">
      <button class="lang-btn active" onclick="switchLang('en')">English</button>
      <button class="lang-btn" onclick="switchLang('ko')">한국어</button>
      <button class="lang-btn" onclick="switchLang('ja')">日本語</button>
      <button class="lang-btn" onclick="switchLang('zh')">中文</button>
    </div>

    <!-- ======================== English ======================== -->
    <div id="lang-en" class="lang-section active">
      <h1>Terms of Service</h1>
      <!-- APP: 날짜 EN -->
      <p class="updated">Last updated: March 17, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <!-- APP: 앱 이름 EN -->
      <p>By accessing or using "앱이름EN" ("Service") provided by SUPERLESS Inc. ("Company"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>

      <h2>2. Definitions</h2>
      <ul>
        <!-- APP: 앱 이름 EN -->
        <li><strong>Service:</strong> The 앱이름EN web application and all related content.</li>
        <li><strong>User:</strong> Any individual who accesses or uses the Service.</li>
        <li><strong>Content:</strong> All text, images, analysis results, and other materials provided through the Service.</li>
      </ul>

      <h2>3. Eligibility</h2>
      <p>The Service is intended for users aged 14 and above. Users under 14 must obtain consent from a parent or legal guardian before using the Service.</p>

      <h2>4. Service Description</h2>
      <!-- APP: 서비스 설명 EN (앱이 뭘 하는지 1문단) -->
      <p>서비스설명EN. The Service is provided "as is" without any guarantee of accuracy or availability.</p>
      <ul>
        <li>This Service is provided free of charge.</li>
        <li>No registration or account creation is required.</li>
        <!-- APP: 결과물 면책 EN -->
        <li>결과물면책EN</li>
      </ul>

      <h2>5. User Obligations</h2>
      <ul>
        <li>Users must not submit others' personal information without their consent.</li>
        <li>Users must not use the Service for illegal purposes.</li>
        <li>Users must not interfere with the normal operation of the Service.</li>
        <li>Users must not use automated tools (bots, scrapers) to access the Service.</li>
        <li>Users must not use the Service for unauthorized commercial purposes.</li>
      </ul>

      <h2>6. Privacy</h2>
      <p>The Service does not collect personal information. All data is processed locally in the browser and is never transmitted to external servers. For details, see our <a href="privacy.html">Privacy Policy</a>.</p>

      <h2>7. Disclaimer</h2>
      <ul>
        <li>The Service is for entertainment only and does not constitute medical, scientific, or professional advice.</li>
        <!-- APP: 결과 면책 상세 EN -->
        <li>결과면책상세EN</li>
        <li>The Company is not liable for any direct or indirect damages arising from the use of the Service.</li>
        <li>The Company's total liability shall not exceed $100 USD.</li>
      </ul>

      <h2>8. Service Limitations and Suspension</h2>
      <ul>
        <li>The Company may restrict access without prior notice if a user violates these terms.</li>
        <li>The Company may modify or discontinue the Service for maintenance, technical issues, legal requirements, or other reasons.</li>
      </ul>

      <h2>9. Intellectual Property</h2>
      <p>All intellectual property rights for the Service's design, code, and content belong to the Company. Users are granted a personal, non-commercial license to use the Service. Rights to content uploaded by users remain with the users.</p>

      <h2>10. Advertising</h2>
      <p>The Service may include advertisements served through Google AdSense. Responsibility for advertisement content lies with the respective advertisers.</p>

      <h2>11. Third-Party Links</h2>
      <p>The Service may contain links to third-party websites. The Company is not responsible for the content or practices of those external sites.</p>

      <h2>12. Changes to Terms</h2>
      <p>The Company may modify these terms as necessary. Significant changes will be notified within the Service. Continued use of the Service after changes constitutes acceptance of the revised terms.</p>

      <h2>13. Governing Law</h2>
      <p>These terms shall be governed by the laws of the Republic of Korea. Any disputes arising from the use of the Service shall be submitted to the competent court in the Republic of Korea.</p>

      <h2>14. Contact</h2>
      <ul>
        <li>Company: SUPERLESS Inc.</li>
        <li>Email: super@superless.ai</li>
      </ul>
      <a href="./" class="back">&larr; Back to App</a>
    </div>

    <!-- ======================== 한국어 ======================== -->
    <div id="lang-ko" class="lang-section">
      <h1>이용약관</h1>
      <!-- APP: 날짜 KO -->
      <p class="updated">최종 수정일: 2026년 3월 17일</p>

      <h2>1. 약관 동의</h2>
      <!-- APP: 앱 이름 KO -->
      <p>슈퍼레스 주식회사(SUPERLESS Inc., 이하 "회사")가 제공하는 「앱이름KO」(이하 "서비스")에 접속하거나 이용함으로써 본 이용약관에 동의하는 것으로 간주됩니다. 동의하지 않는 경우 서비스를 이용하지 마시기 바랍니다.</p>

      <h2>2. 정의</h2>
      <ul>
        <!-- APP: 앱 이름 KO -->
        <li><strong>서비스:</strong> 앱이름KO 웹 애플리케이션 및 관련 콘텐츠 일체.</li>
        <li><strong>이용자:</strong> 서비스에 접속하거나 이용하는 모든 개인.</li>
        <li><strong>콘텐츠:</strong> 서비스를 통해 제공되는 텍스트, 이미지, 분석 결과 등 모든 자료.</li>
      </ul>

      <h2>3. 이용 자격</h2>
      <p>본 서비스는 만 14세 이상의 이용자를 대상으로 합니다. 만 14세 미만의 이용자는 부모 또는 법정 대리인의 동의를 얻은 후 서비스를 이용해야 합니다.</p>

      <h2>4. 서비스 개요</h2>
      <!-- APP: 서비스 설명 KO -->
      <p>서비스설명KO. 서비스는 정확성이나 가용성에 대한 보장 없이 "있는 그대로" 제공됩니다.</p>
      <ul>
        <li>본 서비스는 무료로 제공됩니다.</li>
        <li>서비스 이용에 별도의 회원가입이 필요하지 않습니다.</li>
        <!-- APP: 결과물 면책 KO -->
        <li>결과물면책KO</li>
      </ul>

      <h2>5. 이용자의 의무</h2>
      <ul>
        <li>타인의 동의 없이 타인의 개인정보를 제출하지 않아야 합니다.</li>
        <li>서비스를 불법적인 목적으로 사용하지 않아야 합니다.</li>
        <li>서비스의 정상적인 운영을 방해하는 행위를 하지 않아야 합니다.</li>
        <li>자동화 도구(봇, 스크래퍼 등)를 사용하여 서비스에 접근하지 않아야 합니다.</li>
        <li>서비스를 허가 없이 상업적 목적으로 사용하지 않아야 합니다.</li>
      </ul>

      <h2>6. 개인정보</h2>
      <p>본 서비스는 개인정보를 수집하지 않습니다. 모든 데이터는 브라우저 내에서 로컬로 처리되며, 외부 서버로 전송되지 않습니다. 자세한 내용은 <a href="privacy.html">개인정보 처리방침</a>을 참고하시기 바랍니다.</p>

      <h2>7. 면책 조항</h2>
      <ul>
        <li>본 서비스는 오락 목적으로만 제공되며, 의료·과학·전문적 조언에 해당하지 않습니다.</li>
        <!-- APP: 결과 면책 상세 KO -->
        <li>결과면책상세KO</li>
        <li>회사는 서비스 이용으로 인해 발생한 직접적·간접적 손해에 대해 책임을 지지 않습니다.</li>
        <li>회사의 총 배상 책임은 100 USD를 초과하지 않습니다.</li>
      </ul>

      <h2>8. 서비스 제한 및 중단</h2>
      <ul>
        <li>회사는 이용자가 본 약관을 위반한 경우 사전 통보 없이 접근을 제한할 수 있습니다.</li>
        <li>회사는 유지보수, 기술적 문제, 법적 요구 등의 사유로 서비스를 변경하거나 중단할 수 있습니다.</li>
      </ul>

      <h2>9. 지적재산권</h2>
      <p>서비스의 디자인, 코드, 콘텐츠에 대한 모든 지적재산권은 회사에 귀속됩니다. 이용자는 개인적·비상업적 목적으로 서비스를 이용할 수 있는 라이선스를 부여받습니다. 사용자가 업로드한 콘텐츠에 대한 권리는 사용자에게 있습니다.</p>

      <h2>10. 광고</h2>
      <p>서비스는 Google AdSense를 통한 광고를 포함할 수 있습니다. 광고 내용에 대한 책임은 해당 광고주에게 있습니다.</p>

      <h2>11. 제3자 링크</h2>
      <p>서비스는 제3자 웹사이트로의 링크를 포함할 수 있습니다. 회사는 해당 외부 사이트의 콘텐츠나 관행에 대해 책임을 지지 않습니다.</p>

      <h2>12. 약관 변경</h2>
      <p>회사는 필요에 따라 본 약관을 변경할 수 있습니다. 중요한 변경사항은 서비스 내에 공지합니다. 변경 후 서비스를 계속 이용하면 변경된 약관에 동의한 것으로 간주됩니다.</p>

      <h2>13. 준거법 및 분쟁 해결</h2>
      <p>본 약관은 대한민국 법률에 따라 해석됩니다. 서비스 이용과 관련한 분쟁은 대한민국의 관할 법원에 제출됩니다.</p>

      <h2>14. 문의</h2>
      <ul>
        <li>회사명: 슈퍼레스 주식회사 (SUPERLESS Inc.)</li>
        <li>이메일: super@superless.ai</li>
      </ul>
      <a href="./" class="back">&larr; 돌아가기</a>
    </div>

    <!-- ======================== 日本語 ======================== -->
    <div id="lang-ja" class="lang-section">
      <h1>利用規約</h1>
      <!-- APP: 날짜 JA -->
      <p class="updated">最終更新日: 2026年3月17日</p>

      <h2>1. 規約への同意</h2>
      <!-- APP: 앱 이름 JA -->
      <p>SUPERLESS Inc.（以下「当社」）が提供する「앱이름JA」（以下「本サービス」）にアクセスまたは利用することにより、本利用規約に同意したものとみなされます。同意いただけない場合は、本サービスをご利用にならないでください。</p>

      <h2>2. 定義</h2>
      <ul>
        <!-- APP: 앱 이름 JA -->
        <li><strong>サービス:</strong> 앱이름JA Webアプリケーションおよび関連するすべてのコンテンツ。</li>
        <li><strong>ユーザー:</strong> 本サービスにアクセスまたは利用するすべての個人。</li>
        <li><strong>コンテンツ:</strong> 本サービスを通じて提供されるテキスト、画像、分析結果などすべての資料。</li>
      </ul>

      <h2>3. 利用資格</h2>
      <p>本サービスは14歳以上のユーザーを対象としています。14歳未満のユーザーは、保護者の同意を得てから本サービスをご利用ください。</p>

      <h2>4. サービスの説明</h2>
      <!-- APP: 서비스 설명 JA -->
      <p>서비스설명JA。本サービスは正確性や可用性の保証なく「現状のまま」提供されます。</p>
      <ul>
        <li>本サービスは無料で提供されます。</li>
        <li>会員登録やアカウント作成は不要です。</li>
        <!-- APP: 결과물 면책 JA -->
        <li>결과물면책JA</li>
      </ul>

      <h2>5. ユーザーの義務</h2>
      <ul>
        <li>他人の同意なく他人の個人情報を提出してはなりません。</li>
        <li>本サービスを違法な目的で使用してはなりません。</li>
        <li>本サービスの正常な運営を妨害する行為をしてはなりません。</li>
        <li>自動化ツール（ボット、スクレイパー等）を使用してサービスにアクセスしてはなりません。</li>
        <li>許可なく商業目的でサービスを使用してはなりません。</li>
      </ul>

      <h2>6. プライバシー</h2>
      <p>本サービスは個人情報を収集しません。すべてのデータはブラウザ内でローカルに処理され、外部サーバーに送信されることはありません。詳細は<a href="privacy.html">プライバシーポリシー</a>をご覧ください。</p>

      <h2>7. 免責事項</h2>
      <ul>
        <li>本サービスは娯楽目的でのみ提供され、医療・科学・専門的アドバイスには該当しません。</li>
        <!-- APP: 결과 면책 상세 JA -->
        <li>결과면책상세JA</li>
        <li>当社は本サービスの利用により生じた直接的・間接的損害について責任を負いません。</li>
        <li>当社の賠償責任の上限は100 USDとします。</li>
      </ul>

      <h2>8. サービスの制限および中断</h2>
      <ul>
        <li>当社は、ユーザーが本規約に違反した場合、事前通知なくアクセスを制限することがあります。</li>
        <li>当社は、メンテナンス、技術的問題、法的要件等の理由によりサービスを変更または中止することがあります。</li>
      </ul>

      <h2>9. 知的財産権</h2>
      <p>本サービスのデザイン、コード、コンテンツのすべての知的財産権は当社に帰属します。ユーザーには個人的・非商業的目的でサービスを利用するライセンスが付与されます。ユーザーがアップロードしたコンテンツの権利はユーザーに帰属します。</p>

      <h2>10. 広告</h2>
      <p>本サービスにはGoogle AdSenseによる広告が含まれる場合があります。広告内容の責任は各広告主にあります。</p>

      <h2>11. 第三者リンク</h2>
      <p>本サービスは第三者のウェブサイトへのリンクを含む場合があります。当社は当該外部サイトのコンテンツや慣行について責任を負いません。</p>

      <h2>12. 規約の変更</h2>
      <p>当社は必要に応じて本規約を変更することがあります。重要な変更はサービス内で通知します。変更後のサービス利用は、改定された規約への同意とみなされます。</p>

      <h2>13. 準拠法</h2>
      <p>本規約は大韓民国の法律に準拠して解釈されます。サービス利用に関する紛争は、大韓民国の管轄裁判所に提出されます。</p>

      <h2>14. お問い合わせ</h2>
      <ul>
        <li>会社名: SUPERLESS Inc.</li>
        <li>メール: super@superless.ai</li>
      </ul>
      <a href="./" class="back">&larr; アプリに戻る</a>
    </div>

    <!-- ======================== 中文 ======================== -->
    <div id="lang-zh" class="lang-section">
      <h1>服务条款</h1>
      <!-- APP: 날짜 ZH -->
      <p class="updated">最后更新日期：2026年3月17日</p>

      <h2>1. 条款接受</h2>
      <!-- APP: 앱 이름 ZH -->
      <p>访问或使用SUPERLESS Inc.（以下简称"本公司"）提供的"앱이름ZH"（以下简称"本服务"），即表示您同意受本服务条款的约束。如果您不同意，请勿使用本服务。</p>

      <h2>2. 定义</h2>
      <ul>
        <!-- APP: 앱 이름 ZH -->
        <li><strong>服务：</strong>앱이름ZH Web应用程序及所有相关内容。</li>
        <li><strong>用户：</strong>访问或使用本服务的任何个人。</li>
        <li><strong>内容：</strong>通过本服务提供的所有文字、图片、分析结果等资料。</li>
      </ul>

      <h2>3. 使用资格</h2>
      <p>本服务面向14岁及以上的用户。14岁以下的用户需在父母或法定监护人同意后方可使用本服务。</p>

      <h2>4. 服务说明</h2>
      <!-- APP: 서비스 설명 ZH -->
      <p>서비스설명ZH。本服务按"原样"提供，不保证准确性或可用性。</p>
      <ul>
        <li>本服务免费提供。</li>
        <li>无需注册或创建账户。</li>
        <!-- APP: 결과물 면책 ZH -->
        <li>결과물면책ZH</li>
      </ul>

      <h2>5. 用户义务</h2>
      <ul>
        <li>未经他人同意，不得提交他人的个人信息。</li>
        <li>不得将本服务用于非法目的。</li>
        <li>不得妨碍本服务的正常运营。</li>
        <li>不得使用自动化工具（机器人、爬虫等）访问本服务。</li>
        <li>不得未经授权将本服务用于商业目的。</li>
      </ul>

      <h2>6. 隐私</h2>
      <p>本服务不收集个人信息。所有数据在浏览器中本地处理，不会传输到外部服务器。详情请参阅<a href="privacy.html">隐私政策</a>。</p>

      <h2>7. 免责声明</h2>
      <ul>
        <li>本服务仅供娱乐，不构成医疗、科学或专业建议。</li>
        <!-- APP: 결과 면책 상세 ZH -->
        <li>결과면책상세ZH</li>
        <li>本公司不对因使用本服务而产生的任何直接或间接损害承担责任。</li>
        <li>本公司的总赔偿责任不超过100美元。</li>
      </ul>

      <h2>8. 服务限制与中断</h2>
      <ul>
        <li>如用户违反本条款，本公司可在不事先通知的情况下限制其访问。</li>
        <li>本公司可因维护、技术问题、法律要求等原因修改或中断服务。</li>
      </ul>

      <h2>9. 知识产权</h2>
      <p>本服务的设计、代码和内容的所有知识产权归本公司所有。用户获得个人非商业目的使用本服务的许可。用户上传的内容的权利归用户所有。</p>

      <h2>10. 广告</h2>
      <p>本服务可能包含通过Google AdSense投放的广告。广告内容的责任由各广告主承担。</p>

      <h2>11. 第三方链接</h2>
      <p>本服务可能包含指向第三方网站的链接。本公司不对这些外部网站的内容或做法承担责任。</p>

      <h2>12. 条款变更</h2>
      <p>本公司可根据需要修改本条款。重大变更将在服务内通知。变更后继续使用本服务即表示接受修订后的条款。</p>

      <h2>13. 适用法律</h2>
      <p>本条款受大韩民国法律管辖。因使用本服务而产生的争议应提交大韩民国有管辖权的法院。</p>

      <h2>14. 联系方式</h2>
      <ul>
        <li>公司名称：SUPERLESS Inc.</li>
        <li>电子邮件：super@superless.ai</li>
      </ul>
      <a href="./" class="back">&larr; 返回应用</a>
    </div>
  </div>

  <script>
    function switchLang(lang) {
      document.querySelectorAll('.lang-section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('lang-' + lang).classList.add('active');
      document.querySelector('[onclick="switchLang(\'' + lang + '\')"]').classList.add('active');
    }
    (function() {
      var userLang = (navigator.language || '').toLowerCase();
      if (userLang.startsWith('ko')) switchLang('ko');
      else if (userLang.startsWith('ja')) switchLang('ja');
      else if (userLang.startsWith('zh')) switchLang('zh');
    })();
  </script>
</body>
</html>
```

---

## 5. index.html 규칙

### AdSense 스크립트 (`<head>` 안에 삽입)

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2865941930849930" crossorigin="anonymous"></script>
```

### 푸터 (`</body>` 직전에 삽입)

앱 본체 콘텐츠 아래에 아래 푸터를 추가합니다.
스타일은 앱 디자인에 맞게 조정하되, 구조와 링크는 반드시 유지하세요.

```html
<footer style="text-align:center; padding:2rem 1rem; font-size:12px; color:#999;">
  <p>&copy; 2026 SUPERLESS Inc. All rights reserved.</p>
  <p style="margin-top:6px;">
    <a href="privacy.html" style="color:#999;">Privacy Policy</a>
    &nbsp;|&nbsp;
    <a href="terms.html" style="color:#999;">Terms of Service</a>
  </p>
</footer>
```

### 링크 규칙

- **모든 내부 링크는 상대경로** 사용 (`privacy.html`, `terms.html`, `./`)
- **절대경로(`/`) 사용 금지** — market.superless.ai/slug/ 하위 배포이므로 루트로 빠짐
- 돌아가기 링크: `href="./"`

---

## 6. CLAUDE.md 필수 항목

각 앱 리포의 CLAUDE.md에 반드시 포함할 내용:

```markdown
# 앱이름

앱 설명 한 줄.

## 배포

- GitHub: https://github.com/superlessai-market/slug
- Cloudflare Workers로 배포 (wrangler.jsonc)
- 배포 대상 디렉토리: (루트 또는 public/)

## 기술 스택

- Vanilla HTML/CSS/JS (빌드 없음, Static-First)
- (앱별 기술 나열)

## 실행

빌드 과정 없음. 정적 파일 서빙.
\```bash
npx serve .
\```

## 파일 구조

(앱 파일 트리)

## 디자인 규칙

(앱별 디자인 결정사항)

## 광고 & 법적 페이지

- Google AdSense (Auto Ads) — index.html에 스크립트 삽입
- privacy.html — 개인정보 처리방침 (EN/KO/JA/ZH 다국어)
- terms.html — 이용약관 (EN/KO/JA/ZH 다국어)
- 회사명: 슈퍼레스 주식회사 (SUPERLESS Inc.)
- 이메일: super@superless.ai
- 푸터에 copyright + 개인정보처리방침/이용약관 링크 포함
- **중요: 모든 링크는 상대경로 사용** — 절대경로(`/`) 사용 금지

## Static-First 원칙

- React/Vite/SPA 프레임워크 사용 금지
- HTML이 콘텐츠의 주인, JS는 채워넣기만
- 빌드 단계 없음
- 크롤러 테스트: JS 없이도 구조/콘텐츠 보여야 함
```

---

## 7. 배포 파일

### wrangler.jsonc

```jsonc
{
  "name": "slug",
  "compatibility_date": "2026-03-17",
  "assets": { "directory": "./" }
}
```

`"directory"` — 배포 대상 폴더. 루트면 `"./"`, public 분리 구조면 `"./public"`.

### LICENSE

```
This work is licensed under CC BY-NC-ND 4.0
https://creativecommons.org/licenses/by-nc-nd/4.0/

Commercial use is exclusively permitted on market.superless.ai
(c) Superless (superless.ai)
```

### thumbnail.png

- 갤러리 썸네일 (필수)
- 9:16 비율 권장, CSS에서 자동 크롭
- 앱 스크린샷 또는 대표 이미지

---

## 8. storefront 연동

앱 배포 후, storefront 리포의 `public/apps.json`에 항목 추가:

```json
{
  "name": "앱 표시 이름",
  "slug": "slug",
  "worker_url": "https://slug.xxx.workers.dev",
  "description": "앱 설명"
}
```

### slug 규칙

- 영문 소문자 + 하이픈만 (`kyoto-guide`, `diet-manager`)
- 짧고 명확하게
- 한번 정하면 변경 금지 (URL 깨짐)

---

## 요약: 새 앱 셋업 체크리스트

```
[ ] 1. superlessai-market org에 앱 리포 생성
[ ] 2. 앱 파일 업로드 (Static-First 원칙 준수)
[ ] 3. privacy.html 생성 (이 문서의 템플릿 사용)
[ ] 4. terms.html 생성 (이 문서의 템플릿 사용)
[ ] 5. index.html에 AdSense 스크립트 + 푸터 추가
[ ] 6. thumbnail.png 추가
[ ] 7. wrangler.jsonc 추가
[ ] 8. LICENSE 추가
[ ] 9. CLAUDE.md 작성
[ ] 10. npx wrangler deploy → .workers.dev URL 확인
[ ] 11. storefront/public/apps.json에 항목 추가
[ ] 12. storefront 커밋 푸시 (자동 배포)
[ ] 13. market.superless.ai/slug/ 접속 확인
```
