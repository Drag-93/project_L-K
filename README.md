# --------- 관리자페이지 주요기능 ----------
- 관리자 페이지 내 검색, 페이징, 메뉴별 정렬,필터 기능 모두 추가
- 회원관리 - 회원 삭제, 추가 수정 기능
- 상품관리 - 카테고리 별 추가,삭제,수정 기능
- 예약관리 - 지점관리 메뉴와 연동된 예약지점 선택기능, 자유롭게 추가,삭제 가능한 예약시간 선택 기능, 카테고리별 추가, 삭제, 수정 기능
- 상품결제관리 - 해당 주문 상태 변경기능(배송준비,배송완료), 상품 수정,삭제 기능
- 상품결제관리 - 해당 주문 상태 변경기능(예약대기,예약확정), 상품 수정,삭제 기능
- 지점관리 - 카카오 api를 활용한 지도,주소 입력 기능, 지점 추가,삭제시 지점소개 페이지에 실시간 반영
- 공지사항 관리 - 글 작성 및 수정, 삭제기능
- q&a 관리 - 유저의 작성글에 답변 기능, 답변시 상태변경 기능(답변대기,답변완료)

### 사용기술
- html
- css
- javascript
- react
- JSON
- Node js
- Figma
- Adobe Photoshop

### 진행 상황
- [o] header
- [o] footer
- [o] main
- [o] 소개
- [o] 연혁
- [o] 회사소개
- [o] 로그인, 회원가입
- [o] 상품판매
- [o] 상품판매 - detail
- [o] 진료예약
- [o] 진료예약 - detail
- [o] 판매,예약 리뷰
- [o] 공지사항
- [o] faq
- [o] q&a
- [o] 장바구니,결제하기
- [o] 결재내역
- [o] 마이페이지
- [o] 검색, 정렬, 페이징 기능 개발
- [o] 관리자 페이지 레이아웃
- [o] 관리자 - 회원관리
- [o] 관리자 - 상품관리
- [o] 관리자 - 예약관리
- [o] 관리자 - 상품결제관리
- [o] 관리자 - 예약결제관리
- [o] 관리자 - 지점관리
- [o] 관리자 - 공지사항 관리
- [o] 관리자 - q&a관리


### hotfix - 수정사항
- [o] 예약관리,예약결제관리 필터 기능수정
- [o] q&a 번호 역순
- [o] q&a 필터 추가 - 전체,대기,완료
- [o] 리뷰 페이지 input 수정
- [o] 마이페이지 정렬기능 수정
- [o] 마이페이지 내정보 버튼 수정
- [o] 예약관리 db 관련 수정
- [o] 예약관리 시간,지점 수정
- [o] 마이페이지 컴포넌트별로 분리


# --------- 주의사항 ----------
    inputSlice -> input ->

    isState = false 일때 로그인

    isState = true 일때 로그아웃
----------------------------


# --- git 사용방법 ---
<항상 본인의 브랜치에서 작업 부탁드립니다.*확인필수*>

git add . -> 파일 로컬저장소에 추가

git commit -m '커밋한내용' -> 로컬저장소 파일 커밋하기

git push -> 원격저장소 브랜치에 파일업로드 하기

git checkout 본인브랜치이름 -> 자신의 브랜치로 이동

git pull origin dev -> 자신의 브랜치를 dev의 최신상태로 업데이트

git pull -> 해당브랜치를 최신으로 업데이트




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

npm install @fullpage/react-fullpage   -> 리액트 메인 풀페이지 라이브러리

npm i react-calendar   -> 리액트 캘린더 추가 라이브러리


# --- CSS 작성규칙 ---
별도의 css파일 제작 및 작성 후 style.css 에 import

reset.css -> css 전체초기화

common.css -> 프로젝트 전체 적용 CSS (header,footer,button 등)

style.css -> 모든 css파일을 inport 후 main.jsx에 링크# 1st_project_mine
# 1st_project_mine
