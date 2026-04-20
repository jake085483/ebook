/* 단어 검색 기능 - 단순 버전 */

/* =========================
  1. 필요한 요소 가져오기
========================= */
const wordInput = document.getElementById("word-search");
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

// 정규식 특수문자 처리
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 검색어 안 공백도 유연하게 처리
function makeRegex(keyword) {
  const safeText = escapeRegExp(keyword.trim());
  const spaceFlexibleText = safeText.replace(/\s+/g, "\\s+");
  return new RegExp(spaceFlexibleText, "gi");
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
  const regex = makeRegex(keyword);

  const walker = document.createTreeWalker(
    page,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;

    // 빈 텍스트 제외
    if (!node.nodeValue.trim()) continue;

    // script / style 제외
    const parentTag = node.parentNode.nodeName;
    if (parentTag === "SCRIPT" || parentTag === "STYLE") continue;

    // 이미 강조된 span 안은 제외
    const parentClass = node.parentNode.classList;
    if (parentClass && (parentClass.contains("search-highlight") || parentClass.contains("current-highlight"))) {
      continue;
    }

    regex.lastIndex = 0;
    if (regex.test(node.nodeValue)) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    const fragment = document.createDocumentFragment();

    regex.lastIndex = 0;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const before = text.slice(lastIndex, match.index);
      if (before) {
        fragment.appendChild(document.createTextNode(before));
      }

      const span = document.createElement("span");
      span.className = "search-highlight";
      span.textContent = match[0];
      fragment.appendChild(span);

      lastIndex = match.index + match[0].length;
    }

    const after = text.slice(lastIndex);
    if (after) {
      fragment.appendChild(document.createTextNode(after));
    }

    textNode.parentNode.replaceChild(fragment, textNode);
  });
}

/* =========================
  7. 전체 검색 실행
========================= */

function searchWord() {
  const keyword = wordInput.value.trim();

  // 입력이 비었으면 검색 대신 초기화
  if (!keyword) {
    resetWordSearch();
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

  // 이전 현재 강조 제거
  document.querySelectorAll(".current-highlight").forEach((el) => {
    el.classList.remove("current-highlight");
    el.classList.add("search-highlight");
  });

  const target = results[currentIndex];

  nowPage = target.page;
  showPage(nowPage);

  const currentPage = document.querySelector(`.page-${target.page}`);
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

function findFirstResultInCurrentPage() {
  return results.findIndex((item) => item.page === nowPage);
}

function findLastResultInCurrentPage() {
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].page === nowPage) return i;
  }
  return -1;
}

function getNextIndex() {
  if (
    currentIndex !== -1 &&
    results[currentIndex] &&
    results[currentIndex].page === nowPage
  ) {
    return currentIndex + 1;
  }

  const firstInPage = findFirstResultInCurrentPage();
  if (firstInPage !== -1) return firstInPage;

  const nextPageIndex = results.findIndex((item) => item.page > nowPage);
  if (nextPageIndex !== -1) return nextPageIndex;

  return 0;
}

function getPrevIndex() {
  if (
    currentIndex !== -1 &&
    results[currentIndex] &&
    results[currentIndex].page === nowPage
  ) {
    return currentIndex - 1;
  }

  const lastInPage = findLastResultInCurrentPage();
  if (lastInPage !== -1) return lastInPage;

  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].page < nowPage) return i;
  }

  return results.length - 1;
}

/* =========================
  10. 다음 / 이전 버튼
========================= */

function moveNextMatch() {
  if (results.length === 0) {
    alert("먼저 검색을 해주세요.");
    return;
  }

  moveToResult(getNextIndex());
}

function movePrevMatch() {
  if (results.length === 0) {
    alert("먼저 검색을 해주세요.");
    return;
  }

  moveToResult(getPrevIndex());
}

/* =========================
  11. 이벤트 연결
========================= */

// 검색 버튼
wordSearchBtn.addEventListener("click", searchWord);

// 입력값이 완전히 비워지면 자동 초기화
wordInput.addEventListener("input", () => {
  if (wordInput.value.trim() === "") {
    resetWordSearch();
  }
});

// Enter / Shift + Enter
wordInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  e.preventDefault();

  const inputKeyword = wordInput.value.trim();

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
    movePrevMatch();
  } else {
    moveNextMatch();
  }
});

// 다음 / 이전 버튼
wordNextBtn.addEventListener("click", moveNextMatch);
wordPrevBtn.addEventListener("click", movePrevMatch);

// reset 버튼
wordResetBtn.addEventListener("click", resetWordSearch);

/* =========================
  12. 처음 상태
========================= */
hideSearchUI();
updateCount();