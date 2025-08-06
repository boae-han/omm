const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 8080; // 3001에서 8080으로 변경

// CORS 설정
app.use(cors());
app.use(express.json());

// 정적 파일 서빙
app.use(express.static('.'));

// 네이버 API 프록시
app.get('/api/naver/search', async (req, res) => {
    try {
        const { query, display = 15, start = 1, sort = 'random' } = req.query;
        
        const params = new URLSearchParams({
            query: query,
            display: display,
            start: start,
            sort: sort
        });

        const response = await fetch(`https://openapi.naver.com/v1/search/local.json?${params}`, {
            headers: {
                'X-Naver-Client-Id': 'Db98gzpzD4N9ljte2M1j',
                'X-Naver-Client-Secret': 'W7dckFhWdS'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('네이버 API 프록시 오류:', error);
        res.status(500).json({ error: 'API 요청 실패' });
    }
});

// 카카오 API 프록시
app.get('/api/kakao/search', async (req, res) => {
    try {
        const { query, x, y, radius = 1000, size = 15, category_group_code = 'FD6' } = req.query;
        
        const params = new URLSearchParams({
            query: query,
            x: x,
            y: y,
            radius: radius,
            size: size,
            category_group_code: category_group_code
        });

        const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?${params}`, {
            headers: {
                'Authorization': `KakaoAK 28d0a1b4e9c46ef1292049a6555e8207`
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('카카오 API 프록시 오류:', error);
        res.status(500).json({ error: 'API 요청 실패' });
    }
});

// 네이버 지도 API 프록시 (별점, 영업시간 정보 제공)
app.get('/api/naver/map', async (req, res) => {
    try {
        const { query } = req.query;
        
        // 네이버 지도 API 호출 (실제로는 웹 스크래핑이 필요할 수 있음)
        const response = await fetch(`https://map.naver.com/v5/api/search?query=${encodeURIComponent(query)}&type=place`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://map.naver.com/'
            }
        });

        if (response.ok) {
            const data = await response.json();
            res.json(data);
        } else {
            // 지도 API가 실패하면 검색 API로 대체
            const searchResponse = await fetch(`https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=1`, {
                headers: {
                    'X-Naver-Client-Id': 'Db98gzpzD4N9ljte2M1j',
                    'X-Naver-Client-Secret': 'W7dckFhWdS'
                }
            });
            
            const searchData = await searchResponse.json();
            res.json(searchData);
        }
    } catch (error) {
        console.error('네이버 지도 API 프록시 오류:', error);
        res.status(500).json({ error: 'API 요청 실패' });
    }
});

app.listen(PORT, () => {
    console.log(`프록시 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
}); 