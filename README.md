# --------- 작업일지 ----------
   
----------------------------



# --- 브랜치 ---
dev = 공용 브랜치(테스트서버)

faithyg93 = 이용근

lhstk114 = 이현성

gusdn000615 = 김현우

snooze30 = 이선영



# --- 서버설치 ---
npm install @reduxjs/toolkit react-redux

npm install react-router-dom

npm install -g json-server

json-server --watch src/db/db.json --host 0.0.0.0 --port 3001

npm install axios


# --- CSS 작성규칙 ---
별도의 css파일 제작 및 작성 후 style.css 에 import

reset.css -> css 전체초기화

common.css -> 프로젝트 전체 적용 CSS (header,footer,button 등)

style.css -> 모든 css파일을 inport 후 main.jsx에 링크