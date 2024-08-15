# wordle

## 기술 스택
- react / TypeScript (Vite)
- styled-components
- react-router-dom
- axios
- shadcn/ui
- node.js v18.17.0

## 실행방법
```
npm install
npm run dev
```

## 프로젝트 설명
- 프로젝트는 React와 TypeScript를 기반으로 개발되었으며, 개발 및 빌드 도구로 Vite를 사용하였습니다.
- 기본적인 UI 컴포넌트는 shadcn/ui를 사용하여 구현하였으며, 다른 컴포넌트는 하나의 폴더에 스타일 파일과 같이 위치하고 있습니다.
- 암호화 및 복호화에는 시저 암호를 사용하였으며, 게임 진행 정도는 로컬 스토리지를 사용하여 저장하였습니다.
- 공통으로 사용하는 함수 및 consts는 lib 폴더에 저장하였습니다.


## 구현 사항 목록 
- [x] 첫 페이지에 들어오면 두가지 버튼이 있습니다. 시작하기(정답은 WORLD로 고정), 워들 생성하기
- [x] 워들 생성하기 버튼을 누르면 5글자로 된 워들을 직접 생성 가능합니다.
- [x] URL라우팅을 통해 생성한 워들을 풀이 가능하게 합니다. (브라우저를 종료해도 해당 URL로 접속하면 풀이하던 워들이 남아있어야 합니다. 또한 “해시(암호화)된 단어”가 포함된 URL을 다른 사람들에게 보낸 경우, 동작해야합니다.)
- [x] URL을 통해 바로 정답이 노출되면 안됩니다. 예 (정답이 WORLD일 경우 잘못된 예 :localhost:xxxx/WORLD → 올바른 예 localhost:xxxx/AgagG)
- [x] 입력되는 값들은 실제로 존재하는 단어이며, 단어 검증은 [해당 API](https://dictionaryapi.dev/)에 요청을 보내서 검증합니다.
- [x] 단어 검증 실패시, 단어를 찾을 수 없습니다 라는 메세지가 표시됩니다.
- [x] 게임이 끝나게 되면 결과 창에 표시되어야 할 값들, (이번 게임 플레이시간, 현재까지 워들을 승리한 횟수, 현재까지의 워들 승률, 현재까지 워들 시도한 횟수의 통계)

## 폴더구조
```
📦 src
├── 📂 components
│   ├── 📜 ...
│   ├── ...
│   ├── 📂 ui
│   │    ├── 📜 button.tsx
│   │    ├── 📜 card.tsx
│   │    ├── 📜 toast.tsx
│   │    ├── ...
├── 📂 lib
│   ├── 📜 utils.ts
│   ├── 📜 consts.ts
├── 📂 pages
│   ├── 📜 IntroMenu.tsx
│   ├── 📜 Wordle.tsx
├── 📂 styles
│   ├── 📜 GlobalStyle.ts
```
