/**
 * 구글 드라이브 이미지 URL을 썸네일 URL로 변환
 * @param {string} url 원본 URL
 * @returns {string} 변환된 URL
 */
export const getOptimizedImageUrl = (url) => {
  if (!url) return '';
  
  // 구글 드라이브 URL 처리
  if (url.includes('drive.google.com/file/d/')) {
    // 파일 ID 추출
    const fileIdMatch = url.match(/\/d\/([^/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }
  
  // 이미 썸네일 URL인 경우
  if (url.includes('drive.google.com/thumbnail')) {
    return url;
  }
  
  // 그 외 URL은 그대로 반환
  return url;
};
