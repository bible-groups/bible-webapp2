# nuxt3 프로젝트 세팅 가이드
## nuxt3 프로젝트 설치
- 현재 폴더에 nuxt3를 프로젝트 작업을 위해 설치해줘
```
npx nuxi@latest init .
```

## 프로젝트 세팅
- 터미널에서 아래 명령어를 입력해 패키지를 설치해줘
```
npm i -D @nuxtjs/tailwindcss sass@1.64.2 @nuxtjs/supabase
npm i font-awesome@4.7.0
npx tailwindcss init
```

## 프로젝트 폴더 및 파일 생성
- 터미널에서 아래 명령어를 입력해 폴더와 파일 생성해줘
```
mkdir components assets assets/scss assets/css layouts pages auth middleware composables
touch .env layouts/default.vue pages/index.vue assets/scss/main.scss assets/css/tailwind.css auth/auth.js middleware/auth.js composables/useSidebar.js 
```

## 프로젝트 실행
- 프로젝트 세팅 후 터미널에서 아래 명령어를 입력해줘
```
npm run dev
```
