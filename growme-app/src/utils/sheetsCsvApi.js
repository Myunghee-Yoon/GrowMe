import axios from 'axios';
import { SHEET_ID } from '../config';
import { mockApps } from './mockData';

/**
 * Google Sheets를 CSV로 가져오는 함수
 * @returns {Promise<Array>} 시트 데이터
 */
export const fetchSheetDataCsv = async () => {
  try {
    // CSV 형식으로 시트 데이터 가져오기
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
    console.log('CSV URL:', csvUrl);

    const response = await axios.get(csvUrl);
    console.log('CSV 응답 상태:', response.status);

    // CSV 데이터 파싱
    const csvData = response.data;
    console.log('CSV 데이터 일부:', csvData.substring(0, 200));

    // 줄바꿈 처리 (다양한 플랫폼 고려)
    const rows = csvData.split(/\r?\n/).map(row => row.split(','));

    console.log('CSV 데이터 행 수:', rows.length);

    // 첫 번째 행은 설명, 두 번째 행은 헤더이므로 제외
    if (rows.length <= 2) {
      return [];
    }

    // 헤더 행 (인덱스 1)
    const headers = rows[1];

    // 데이터 행 (인덱스 2부터)
    return rows.slice(2)
      .filter(row => row.length > 1 && row[1]) // 빈 행 제외
      .map(row => {
        const app = {};

        // 각 열의 값을 해당 헤더와 매핑
        headers.forEach((header, index) => {
          if (row[index]) {
            app[header] = row[index].trim().replace(/^"|"$/g, ''); // 따옴표 제거
          }
        });

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
    console.error('Error fetching CSV data:', error);
    console.error('Error details:', error.response?.data || error.message);

    // 오류 발생 시 모의 데이터로 대체
    console.warn('CSV 가져오기 오류가 발생하여 모의 데이터를 사용합니다.');
    return mockApps;
  }
};
