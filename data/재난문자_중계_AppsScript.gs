/**
 * 동해시 재난상황판 - 중계 (Google Apps Script) · 재난문자 + 언론보도 겸용
 *
 * safetydata.go.kr(재난문자) / 뉴스 검색은 브라우저 직접 호출(CORS)이 막혀서,
 * 이 스크립트가 서버쪽에서 대신 받아와 재난상황판에 넘겨줍니다.
 *
 * ★ 캐시 기능: 화면을 여러 대 켜둬도 실제 호출은 일정 간격에 한 번만 → 한도 안전.
 *
 * [코드 교체 후 재배포] (이미 한 번 배포한 경우 — URL 은 그대로 유지됩니다)
 *  1) 코드를 이 내용으로 교체 → 저장(💾)
 *  2) '배포' → '배포 관리' → 연필(편집) 아이콘
 *  3) 버전: '새 버전' 선택 → '배포'
 *  (exec 주소는 바뀌지 않으니 config.js 는 그대로 두면 됩니다)
 *
 * [처음 배포하는 경우]
 *  1) script.google.com → '새 프로젝트' → 이 코드 붙여넣기 → 저장
 *  2) '배포' → '새 배포' → 유형 '웹 앱' → 실행 '나' / 액세스 '모든 사용자' → 배포
 *  3) 권한 승인 → 나온 '웹 앱 URL(.../exec)' 을 config.js DISASTER_MSG_PROXY 에 입력
 */

// safetydata.go.kr 인증키 (재난문자용)
var SERVICE_KEY = "H8650I4B948RTDJW";

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.type === "news") {
    return getNews(p.q || "동해시 재난 사고");
  }
  return getDisasterMsg(p.region || "");
}

/* ── 재난문자 ── */
function getDisasterMsg(region) {
  var cacheKey = "dm_" + region;
  var cache = CacheService.getScriptCache();
  var cached = cache.get(cacheKey);
  if (cached) return out(cached, ContentService.MimeType.JSON);
  var url = "https://www.safetydata.go.kr/V2/api/DSSP-IF-00247"
          + "?serviceKey=" + encodeURIComponent(SERVICE_KEY)
          + "&pageNo=1&numOfRows=30&returnType=json"
          + (region ? "&rgnNm=" + encodeURIComponent(region) : "");
  var text;
  try {
    var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    text = resp.getContentText();
    try { cache.put(cacheKey, text, 90); } catch (ig) {}   // 90초 캐시
  } catch (err) {
    text = JSON.stringify({ error: String(err) });
  }
  return out(text, ContentService.MimeType.JSON);
}

/* ── 언론보도 (구글 뉴스 검색 → 제목/언론사/보도시간/링크) ── */
function getNews(q) {
  var cacheKey = "news_" + q;
  var cache = CacheService.getScriptCache();
  var cached = cache.get(cacheKey);
  if (cached) return out(cached, ContentService.MimeType.JSON);
  var url = "https://news.google.com/rss/search?q=" + encodeURIComponent(q)
          + "&hl=ko&gl=KR&ceid=KR:ko";
  var result = { items: [] };
  try {
    var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var doc = XmlService.parse(resp.getContentText());
    var channel = doc.getRootElement().getChild("channel");
    var items = channel ? channel.getChildren("item") : [];
    for (var i = 0; i < items.length && i < 15; i++) {
      var it = items[i];
      var title = it.getChildText("title") || "";
      var link = it.getChildText("link") || "";
      var pub = it.getChildText("pubDate") || "";
      var srcEl = it.getChild("source");
      var source = srcEl ? srcEl.getText() : "";
      // 구글뉴스 제목은 "제목 - 매체명" 형태 → 매체명 분리
      if (!source) {
        var d = title.lastIndexOf(" - ");
        if (d > 0) { source = title.substring(d + 3); title = title.substring(0, d); }
      } else if (title.lastIndexOf(" - " + source) === title.length - source.length - 3) {
        title = title.substring(0, title.length - source.length - 3);
      }
      result.items.push({ title: title, source: source, pubDate: pub, link: link });
    }
  } catch (err) {
    result.error = String(err);
  }
  var s = JSON.stringify(result);
  try { cache.put(cacheKey, s, 180); } catch (ig) {}        // 3분 캐시
  return out(s, ContentService.MimeType.JSON);
}

function out(text, mime) {
  return ContentService.createTextOutput(text).setMimeType(mime);
}
