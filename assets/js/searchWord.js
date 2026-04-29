/* 단어 검색 기능 */

/* =========================
  1. 필요한 요소 가져오기
========================= */
const wordInput = document.querySelector(".word-search");
const wordSearchBtn = document.querySelector(".word-search-btn");
const wordPrevBtn = document.querySelector(".word-prev-btn");
const wordNextBtn = document.querySelector(".word-next-btn");
const wordResetBtn = document.querySelector(".word-reset");

const currentNumEl = document.querySelector(".current-num");
const totalNumEl = document.querySelector(".total-num");
const countWrap = document.querySelector(".count");

const pages = document.querySelectorAll(".page");

/* =========================
  2. 검색 상태 저장 변수
========================= */
let currentKeyword = "";
let results = [];
let currentIndex = -1;

/* =========================
  3. 공통 함수
========================= */

// 검색 결과 숫자 표시
function updateCount() {
  if (results.length === 0 || currentIndex === -1) {
    currentNumEl.textContent = "0";
    totalNumEl.textContent = "0";
    return;
  }

  currentNumEl.textContent = String(currentIndex + 1);
  totalNumEl.textContent = String(results.length);
}

// 검색 결과 UI 숨기기
function hideSearchUI() {
  wordPrevBtn.classList.add("hide");
  wordNextBtn.classList.add("hide");
  countWrap.classList.add("hide");
}

// 검색 결과 UI 보이기
function showSearchUI() {
  wordPrevBtn.classList.remove("hide");
  wordNextBtn.classList.remove("hide");
  countWrap.classList.remove("hide");
}

// 검색어 안 공백도 유연하게 처리
/* function makeRegex(keyword) {
  const safeText = keyword.trim();
  const spaceFlexibleText = safeText.replace(/\s+/g, "\\s+");
  return new RegExp(spaceFlexibleText, "gi");
} */

/* 원래와 다르게 23스페이스바 23스페이스바스페이스바 검색 가능하게 */
function makeRegex(keyword) {
  if (keyword === "") return null;

  const safeText = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(safeText, "g");
}

/* =========================
  4. 강조 제거
========================= */

// 강조 span을 벗겨서 원래 텍스트로 되돌리기
function clearHighlights() {
  document.querySelectorAll(".search-highlight, .current-highlight").forEach((el) => {
    const textNode = document.createTextNode(el.textContent);
    el.replaceWith(textNode);
  });

  // 텍스트 노드 합치기
  pages.forEach((page) => {
    page.normalize();
  });
}

/* =========================
  5. 검색 초기화
========================= */

function resetWordSearch() {
  currentKeyword = "";
  results = [];
  currentIndex = -1;

  wordInput.value = "";

  clearHighlights();
  hideSearchUI();
  updateCount();
}

/* =========================
  6. 한 페이지 안 검색어 강조
========================= */

function highlightPage(page, keyword) {
  // 검색어를 정규식으로 변환 (대소문자 무시, 공백 대응 등)
  const regex = makeRegex(keyword);

  // 페이지 안의 "텍스트 노드만" 순회하기 위한 도구
  const walker = document.createTreeWalker(
    page,                      // 기준 요소 (이 페이지 안에서만 검색)
    NodeFilter.SHOW_TEXT,      // 텍스트 노드만 탐색
    null                       // 필터 없음
  );

  const textNodes = []; // 검색어가 포함된 텍스트 노드 저장

  // 모든 텍스트 노드 순회
  while (walker.nextNode()) {
    const node = walker.currentNode;

    // 공백만 있는 텍스트는 제외
    /* if (!node.nodeValue.trim()) continue; */
    if (!node.nodeValue) continue;

    // script / style 안의 텍스트는 제외
    // 텍스트들만 가져와서 그 텍스트의 태그
    const parentTag = node.parentNode.nodeName;
    if (parentTag === "SCRIPT" || parentTag === "STYLE") continue;

    // 이미 하이라이트 된 span 안은 제외 (중복 방지)
    const parentClass = node.parentNode.classList;
    if (parentClass && (parentClass.contains("search-highlight") || parentClass.contains("current-highlight"))) {
      continue;
    }

    // 초기화
    regex.lastIndex = 0;

    // 검색어가 포함된 텍스트 노드만 따로 저장
    if (regex.test(node.nodeValue)) {
      textNodes.push(node);
    }
  }

  // 실제 하이라이트 적용
  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue;

    // DOM을 직접 건드리기 전에 임시 공간 생성
    /* DocumentFragment 객체는 가상의 메모리 공간에 존재하는 일시적인 DOM 조각으로
    원하는 메인 DOM 트리 위치에 직접 추가(혹은 삽입)해야 웹 페이지에서 표시 */
    const fragment = document.createDocumentFragment();

    regex.lastIndex = 0;

    let lastIndex = 0;
    let match = '';

    // 텍스트 검색어를 찾음 있으면 또 실행 없으면 종료
    while ((match = regex.exec(text)) !== null) {

      // 검색어 앞 텍스트
      const before = text.slice(lastIndex, match.index);
      if (before) {
        fragment.appendChild(document.createTextNode(before));
      }

      // 검색어 부분 → span으로 감싸기
      const span = document.createElement("span");
      span.className = "search-highlight";
      span.textContent = match[0];
      fragment.appendChild(span);

      // 다음 탐색 시작 위치 업데이트
      lastIndex = match.index + match[0].length;
    }

    // 마지막 검색어 이후 텍스트
    const after = text.slice(lastIndex);
    if (after) {
      fragment.appendChild(document.createTextNode(after));
    }

    // 기존 텍스트 노드를 fragment로 교체
    textNode.parentNode.replaceChild(fragment, textNode);
  });
}

/* =========================
  7. 전체 검색 실행
========================= */

function searchWord() {
  /* const keyword = wordInput.value.trim(); */
  const keyword = wordInput.value;

  // 입력이 비었으면 검색 대신 초기화
  if (!keyword) {
    resetWordSearch();
    alert("단어를 입력해주세요.")
    return;
  }

  // 이전 검색 흔적 제거
  clearHighlights();

  currentKeyword = keyword;
  results = [];
  currentIndex = -1;

  pages.forEach((page, pageIndex) => {
    const regex = makeRegex(keyword);

    regex.lastIndex = 0;
    if (!regex.test(page.textContent)) return;

    highlightPage(page, keyword);

    const highlights = page.querySelectorAll(".search-highlight");

    highlights.forEach((item, index) => {
      results.push({
        page: pageIndex + 1,
        order: index
      });
    });

    /* console.log(results); */
  });

  if (results.length === 0) {
    hideSearchUI();
    updateCount();
    alert("검색 결과가 없습니다.");
    return;
  }

  showSearchUI();
  moveToResult(0);
}

/* =========================
  8. 검색 결과로 이동
========================= */

function moveToResult(index) {
  if (results.length === 0) {
    currentIndex = -1;
    updateCount();
    return;
  }

  // 범위 넘으면 순환
  if (index < 0) index = results.length - 1;
  if (index >= results.length) index = 0;

  currentIndex = index;

  // 강조 제거
  document.querySelectorAll(".current-highlight").forEach((el) => {
    el.classList.remove("current-highlight");
    el.classList.add("search-highlight");
  });

  const target = results[currentIndex];

  nowPage = target.page;
  showPage(nowPage);

  const currentPage = document.querySelector(`.page-${nowPage}`);
  if (!currentPage) {
    updateCount();
    return;
  }

  const highlights = currentPage.querySelectorAll(".search-highlight");
  const currentTarget = highlights[target.order];

  if (currentTarget) {
    currentTarget.classList.remove("search-highlight");
    currentTarget.classList.add("current-highlight");
  }

  updateCount();
}

/* =========================
  9. 현재 페이지 기준 다음/이전 찾기
========================= */

// 현재 페이지(nowPage)에 해당하는 첫 번째 결과의 index 찾기
function findFirstResultInCurrentPage() {
  // findIndex: 조건에 맞는 첫 번째 요소의 index 반환 (없으면 -1)
  return results.findIndex((item) => item.page === nowPage);
}


// 현재 페이지(nowPage)에 해당하는 마지막 결과의 index 찾기
function findLastResultInCurrentPage() {
  // 배열의 뒤에서부터 탐색 (마지막 요소부터)
  for (let i = results.length - 1; i >= 0; i--) {
    // 현재 페이지와 같은 값이면 바로 index 반환
    if (results[i].page === nowPage) return i;
  }
  // 없으면 -1 반환
  return -1;
}


// "다음"으로 이동할 index 계산
function getAdjacentIndex(direction) {
  const step = direction === "next" ? 1 : -1;

  // 현재 index가 유효하고, 현재 페이지에 속한 경우
  if (
    currentIndex !== -1 &&
    results[currentIndex] &&
    results[currentIndex].page === nowPage
  ) {
    return currentIndex + step;
  }

  if (direction === "next") {
    // 현재 페이지의 첫 번째 요소
    const firstInPage = findFirstResultInCurrentPage();
    if (firstInPage !== -1) return firstInPage;

    // 다음 페이지 중 가장 먼저 나오는 index
    const nextPageIndex = results.findIndex((item) => item.page > nowPage);
    if (nextPageIndex !== -1) return nextPageIndex;

    return 0; // 순환
  } else {
    // 현재 페이지의 마지막 요소
    const lastInPage = findLastResultInCurrentPage();
    if (lastInPage !== -1) return lastInPage;

    // 이전 페이지 중 가장 뒤에 있는 index
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i].page < nowPage) return i;
    }

    return results.length - 1; // 순환
  }
}

/* =========================
  10. 다음 / 이전 버튼
========================= */

function moveMatch(directions) {
  if (results.length === 0) {
    alert("먼저 검색을 해주세요.");
    return;
  }

  moveToResult(getAdjacentIndex(directions));
}

/* =========================
  11. 이벤트 연결
========================= */

// 검색 버튼
wordSearchBtn.addEventListener("click", searchWord);

// 입력값이 완전히 비워지면 자동 초기화
wordInput.addEventListener("input", () => {
  /* if (wordInput.value.trim() === "") {
    resetWordSearch();
  } */

  if (wordInput.value === "") {
    resetWordSearch();
  }
});

// Enter / Shift + Enter
wordInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  e.preventDefault();

  /* const inputKeyword = wordInput.value.trim(); */
  const inputKeyword = wordInput.value;

  if (!inputKeyword) {
    resetWordSearch();
    return;
  }

  // 검색 안 했거나 검색어가 바뀌었으면 새 검색
  if (results.length === 0 || inputKeyword !== currentKeyword) {
    searchWord();
    return;
  }

  // 같은 검색어면 Enter = 다음, Shift+Enter = 이전
  if (e.shiftKey) {
    moveMatch("prev");
  } else {
    moveMatch("next");
  }
});

// 다음 / 이전 버튼
wordNextBtn.addEventListener("click", () => moveMatch("next"));
wordPrevBtn.addEventListener("click", () => moveMatch("prev"));

// reset 버튼
wordResetBtn.addEventListener("click", resetWordSearch);

/* =========================
  12. 처음 상태
========================= */
hideSearchUI();
updateCount();