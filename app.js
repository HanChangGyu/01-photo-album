const express = require('express');
const morgan = require('morgan');
// 2. 로그인/세션 관리
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
// 3. 파일/경로 처리 
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// 기본 설정
dotenv.config(); // .env파일 읽기
const app = express();
app.set('port', process.env.PORT || 3000); // 공장 포트

try {
    // uploads 폴더 있는지 검사를 시도
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

// 'multer' 택배 시스템 주문 (변수에 저장)
const upload = multer({
    storage: multer.diskStorage({ // 1. 저장 방식: '하드 디스크'
        destination(req, file, done) { // 2. 저장 위치: 'uploads/'폴더
            done(null, 'uploads/');
        },
        filename(req, file, done) { // 3. 파일 이름: '원본이름+날짜+확장자'
            const ext = path.extname(file.originalname); // .jpg 라는 확장자만 오리기
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 4. 크기 제한
});

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public'))); // 정적파일 요청은 효율을 위해서 굳이 뒤에까지 갈 필요 없음
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
// 반드시 cookieparser 뒤에
app.use(session({ 
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie', // 이름을 바꿔서 도움
}));
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})