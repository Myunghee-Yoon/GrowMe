import axios from 'axios';
import { GOOGLE_API_KEY, SHEET_ID, SHEET_RANGE } from '../config';
import { mockApps } from './mockData';

/**
 * Google Sheets API를 사용하여 시트 데이터를 가져오는 함수
 * @returns {Promise<Array>} 시트 데이터
 */
export const fetchSheetData = async () => {
  // API 키가 없는 경우 모의 데이터 사용
  if (!GOOGLE_API_KEY) {
    console.warn('API 키가 없어 모의 데이터를 사용합니다.');
    return Promise.resolve(mockApps);
  }

  try {
    console.log('API 키 확인:', GOOGLE_API_KEY ? 'API 키 있음' : 'API 키 없음');
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${GOOGLE_API_KEY}`;
    console.log('API URL:', apiUrl);

    const response = await axios.get(apiUrl);
    console.log('API 응답:', response.status, response.statusText);

    const rows = response.data.values;
    console.log('가져온 데이터 행 수:', rows?.length || 0);

    // 첫 번째 행은 설명, 두 번째 행은 헤더이므로 제외
    if (rows.length <= 2) {
      return [];
    }

    // 헤더 행 (인덱스 1)
    const headers = rows[1];

    // 데이터 행 (인덱스 2부터)
    return rows.slice(2)
      .filter(row => row && row.length > 1) // 비어있는 행 제외
      .map(row => {
        const app = {};

        // 각 열의 값을 해당 헤더와 매핑
        headers.forEach((header, index) => {
          if (row[index]) {
            app[header] = row[index];
          }
        });

        // 필수 필드 검사
        if (!app.title) {
          console.warn('제목이 없는 항목 발견:', app);
          app.title = '제목 없음';
        }

        // 태그 처리 (쉼표로 구분된 문자열을 배열로 변환)
        if (app.tags) {
          app.tags = app.tags.split(',').map(tag => tag.trim());
        } else {
          app.tags = [];
        }

        // featured 값을 불리언으로 변환
        app.featured = app.featured === 'true';

        return app;
      });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    console.error('Error details:', error.response?.data || error.message);

    // 오류 발생 시 모의 데이터로 대체
    console.warn('오류가 발생하여 모의 데이터를 사용합니다.');
    return mockApps;
  }
};
