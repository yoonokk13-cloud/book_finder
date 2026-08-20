우리도서관 책 찾기 — 초등도서관형 배포용

중요
- 화면과 디자인은 기존 '초등도서관형'을 그대로 유지했습니다.
- 바뀐 것은 알라딘 API 연결 방식뿐입니다.
- 학생 브라우저에는 알라딘 TTBKey가 노출되지 않습니다.

구조
index.html
functions/api/aladin.js
_headers

Cloudflare Pages 배포
1. 이 폴더 전체를 GitHub 저장소에 올립니다.
2. Cloudflare Pages에서 해당 저장소를 연결합니다.
3. Build command는 비워두고, Output directory는 프로젝트 루트(.)로 둡니다.
4. Cloudflare Pages > Settings > Variables and Secrets에서
   이름: ALADIN_TTB_KEY
   값: 발급받은 TTBKey
   로 'Secret'을 등록합니다.
5. 배포하면 학생은 생성된 URL 하나로 접속합니다.

동작
- 학교 소장도서 검색: index.html 내부 장서 데이터로 작동
- 표지/책소개: /api/aladin 을 통해 서버측에서 알라딘 OpenAPI 호출
- 독서로: 보조 링크 유지
- 독서활동/PDF: 기존 기능 유지

보안
- TTBKey를 index.html에 직접 넣지 않습니다.
- 공개 저장소에도 키를 올리지 마세요.
