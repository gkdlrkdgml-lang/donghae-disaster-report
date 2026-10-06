/* 설정 파일
   ※ 키를 바꾸려면 아래 따옴표 안의 값만 교체하세요. */

// 카카오 지도 JavaScript 키 (도메인 github.io에 묶임)
window.KAKAO_JS_KEY = "8bd60a8c16ef9f53b458b92b46753125";

// 기상청 단기예보 인증키 (공공데이터포털 · Encoding 키, 이미 URL 인코딩됨)
window.KMA_KEY = "RQIEhSzZ3LYrBeZCv4a7aoFXCjqHzyHY0wLrF%2BTxE8QzvvkWxgE6G0AYGdg4myIHIdTYtgCXEvpXk0CvTEnzmw%3D%3D";

// 문자전송시스템 주소 (지휘부 안내문자 '문자전송시스템 열기' 버튼이 이 주소를 새 창으로 엽니다)
// 예: "https://sms.donghae.go.kr" — 아래 따옴표 안에 실제 주소를 넣으세요. 비워두면 버튼이 안 보입니다.
window.SMS_SYSTEM_URL = "";

// 재난상황판 '실시간 뉴스' 기본 검색어 ('네이버 열기' 버튼에 사용)
window.NEWS_QUERY = "동해시 재난 사고 안전";
window.NEWS_PROXY = "";

// ───────────────────────────────────────────────────────────────
// 재난상황판 '실시간 재난문자(긴급재난문자)' API 인증키
//  · 공공데이터포털(data.go.kr) 또는 안전데이터(safetydata.go.kr)에서 발급받은 인증키를 넣으세요.
//  · 아래 따옴표 안에 'Encoding(URL인코딩) 인증키'를 그대로 붙여넣으면 됩니다.
//  · 신청: 공공데이터포털 → '행정안전부 긴급재난문자' 검색 → 활용신청 → 인증키
//  · 비워두면 재난문자 목록 대신 안내가 표시됩니다.
window.DISASTER_MSG_KEY = "";
// 기본 조회 지역(부분일치). "강원" 또는 "동해" 등. 비우면 전국.
window.DISASTER_MSG_REGION = "강원";
// (고급) 재난문자 API 주소 — 기본값이 사내망에서 막히면 다른 주소로 교체 가능. 비우면 기본 후보들을 순서대로 시도.
window.DISASTER_MSG_URL = "";
