// Google Sheets API 설정
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
export const SHEET_ID = '19p_nmvWZz3z5usCbw0sHqBywg6pW5jQTiOdbB2-ZBsU';
export const SHEET_RANGE = 'A1:L100'; // 데이터 범위 (시트 이름 생략 - 첫 번째 시트 사용)

// 환경 변수가 설정되지 않은 경우 경고
if (!GOOGLE_API_KEY) {
  console.warn('Google API Key가 설정되지 않았습니다. .env 파일에 VITE_GOOGLE_API_KEY를 설정하세요.');
}
