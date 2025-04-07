import { useState, useEffect } from 'react'
import './App.css'
import { fetchSheetData } from './utils/sheetsApi'
import { fetchSheetDataCsv } from './utils/sheetsCsvApi'
import { getOptimizedImageUrl } from './utils/imageUtils'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { FaPlay } from 'react-icons/fa'

function App() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApps = async () => {
      try {
        // 먼저 Google Sheets API를 사용하여 데이터 가져오기 시도
        try {
          console.log('구글 시트 API로 데이터 가져오기 시도...');
          const appsData = await fetchSheetData();
          console.log('API로 가져온 데이터:', appsData);

          if (appsData && appsData.length > 0) {
            setApps(appsData);
            setLoading(false);
            return; // 성공적으로 가져왔으면 여기서 종료
          }
        } catch (apiErr) {
          console.error('API 방식 오류:', apiErr);
        }

        // API 방식이 실패하면 CSV 방식 시도
        console.log('CSV 방식으로 데이터 가져오기 시도...');
        const csvData = await fetchSheetDataCsv();
        console.log('CSV로 가져온 데이터:', csvData);

        setApps(csvData);
        setLoading(false);
      } catch (err) {
        console.error('모든 방식 실패:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    loadApps();
  }, []);

  // 태그 렌더링 함수
  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return null;

    return (
      <div className="app-card-tags">
        {tags.map((tag, index) => (
          <span key={index} className="app-card-tag">{tag}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <header className="header">
        <h1>GrowMe</h1>
        <p>오픈소스를 활용한 앱 개발 프로젝트</p>
      </header>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="app-grid">
          {apps.map((app, index) => (
            <div
              key={app.id || `app-${index}`}
              className="app-card"
              style={app.bgColor ? { backgroundColor: app.bgColor } : {}}
            >
              {app.imageUrl && (
                <img
                  src={getOptimizedImageUrl(app.imageUrl)}
                  alt={app.title}
                  className="app-card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x180?text=이미지+없음';
                  }}
                />
              )}
              <div className="app-card-content">
                <h2 className="app-card-title">{app.title}</h2>
                <p className="app-card-description">{app.description}</p>
                {renderTags(app.tags)}
                {app.appUrl && (
                  <a
                    href={app.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`app-card-link ${app.appUrl.includes('drive.google.com') || app.appUrl.includes('youtube.com') ? 'app-card-link-video' : 'app-card-link-app'}`}
                  >
                    {app.appUrl.includes('drive.google.com') || app.appUrl.includes('youtube.com') ? (
                      <>
                        <FaPlay style={{ marginRight: '8px', fontSize: '0.8rem' }} />
                        시연영상 보기
                      </>
                    ) : (
                      <>
                        <FaExternalLinkAlt style={{ marginRight: '8px', fontSize: '0.8rem' }} />
                        앱 열기
                      </>
                    )}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="footer">
        <p>© 2025 Contenlena. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App
