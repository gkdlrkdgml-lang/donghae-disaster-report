/**
 * 동해시 재난상황판 - 재난문자 중계 (Google Apps Script) · 캐시 버전
 *
 * safetydata.go.kr 는 브라우저 직접 호출(CORS)을 막아둬서,
 * 이 스크립트가 서버쪽에서 대신 받아와 재난상황판에 넘겨줍니다.
 *
 * ★ 캐시 기능: 화면을 여러 대 켜둬도 safetydata 는 90초에 한 번만 실제 호출하고
 *   나머지는 저장해둔 값을 돌려줍니다 → 하루 API 한도(1000회) 안에서 안전.
 *
 * [처음 배포] (이미 배포했으면 아래 '코드 교체 후 재배포' 참고)
 *  1) https://script.google.com → '새 프로젝트'
 *  2) 기존 코드 전부 지우고 이 파일 내용을 붙여넣기 → 저장(💾)
 *  3) '배포' → '새 배포' → 톱니(유형) → '웹 앱'
 *  4) 실행 계정 '나', 액세스 권한 '모든 사용자' → '배포'
 *  5) 권한 승인(본인 계정) → 나온 '웹 앱 URL(.../exec)' 을 config.js DISASTER_MSG_PROXY 에 입력
 *
 * [코드 교체 후 재배포] (이미 한 번 배포한 경우 — URL 은 그대로 유지됩니다)
 *  1) 코드를 이 내용으로 교체 → 저장(💾)
 *  2) '배포' → '배포 관리' → 연필(편집) 아이콘
 *  3) 버전: '새 버전' 선택 → '배포'
 *  (exec 주소는 바뀌지 않으니 config.js 는 그대로 두면 됩니다)
 */

// safetydata.go.kr 인증키 (받으신 키)
var SERVICE_KEY = "H8650I4B948RTDJW";
// safetydata 실제 호출 간격(초) — 이 시간 동안은 저장해둔 값을 돌려줍니다.
var CACHE_SECONDS = 90;

function doGet(e) {
  var region = (e && e.parameter && e.parameter.region) ? e.parameter.region : "";
  var cacheKey = "dm_" + region;
  var cache = CacheService.getScriptCache();

  // 1) 캐시에 있으면 그대로 반환 (safetydata 호출 안 함)
  var cached = cache.get(cacheKey);
  if (cached) {
    return ContentService.createTextOutput(cached)
                         .setMimeType(ContentService.MimeType.JSON);
  }

  // 2) 없으면 safetydata 호출 후 캐시에 저장
  var url = "https://www.safetydata.go.kr/V2/api/DSSP-IF-00247"
          + "?serviceKey=" + encodeURIComponent(SERVICE_KEY)
          + "&pageNo=1&numOfRows=30&returnType=json"
          + (region ? "&rgnNm=" + encodeURIComponent(region) : "");
  var text;
  try {
    var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    text = resp.getContentText();
    try { cache.put(cacheKey, text, CACHE_SECONDS); } catch (ignore) {}
  } catch (err) {
    text = JSON.stringify({ error: String(err) });
  }
  return ContentService.createTextOutput(text)
                       .setMimeType(ContentService.MimeType.JSON);
}
