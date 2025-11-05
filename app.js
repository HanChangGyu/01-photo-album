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


app.use(morgan('dev'));
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