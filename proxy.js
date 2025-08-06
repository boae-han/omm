const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 8000;

// CORS 설정
app.use(cors());
app.use(express.json());



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
                'Authorization': `KakaoAK ${process.env.KAKAO_API_KEY}`
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('카카오 API 프록시 오류:', error);
        res.status(500).json({ error: 'API 요청 실패' });
    }
});

app.get('/api/kakao/geo', async (req, res) => {
    try {
        const { x, y } = req.query;
        
        const params = new URLSearchParams({
            x: x,
            y: y
        });

        const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?${params}`, {
            headers: {
                'Authorization': `KakaoAK ${process.env.KAKAO_API_KEY}`
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('카카오 API 프록시 오류:', error);
        res.status(500).json({ error: 'API 요청 실패' });
    }
});

// favicon.ico 404 에러 방지
app.get('/favicon.ico', (req, res) => res.status(204).send());

// 정적 파일 서빙
app.use(express.static('.'));

app.listen(PORT, () => {
    console.log(`프록시 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
}); 