// 🔑 API 키 설정 파일
// 환경변수에서 API 키를 가져옵니다.

const CONFIG = {
    // 카카오 로컬 API 키
    KAKAO_API_KEY: '28d0a1b4e9c46ef1292049a6555e8207',
    
    // API URL
    KAKAO_API_URL: 'https://dapi.kakao.com/v2/local/search/keyword.json',
    
    // 검색 설정
    SEARCH_RADIUS: 1000, // 1km
    MAX_RESULTS: 15
};

// 전역 변수로 노출
window.CONFIG = CONFIG; 