/* 단어 검색 기능 */

/* =========================
   1. 필요한 요소 가져오기
========================= */
const wordInput = document.getElementById("word-search");
const wordSearchBtn = document.querySelector(".word-search-btn");
const wordPrevBtn = document.querySelector(".word-prev-btn");
const wordNextBtn = document.querySelector(".word-next-btn");
const searchBtn = document.querySelectorAll(".search-btn");
const currentNumEl = document.querySelector(".current-num");
const totalNumEl = document.querySelector(".total-num");
const countWrap = document.querySelector(".count");

const pages = document.querySelectorAll(".page");

/* =========================
   2. 검색 상태 저장 변수
========================= */

// 마지막으로 검색한 단어
let currentKeyword = "";

// 검색 결과 전체 목록
//        페이지 번호: , 검색결과 개수:
// 예: [{ page: 2, order: 0 }, { page: 2, order: 1 }, { page: 5, order: 0 }]
let results = [];

// 지금 보고 있는 검색 결과 번호
// 처음에는 아무것도 검색 안한 상태라 -1
let currentIndex = -1;

/* =========================
   3. 페이지 원본 저장
========================= */

// 검색 강조를 지우기 위해 원본 HTML을 저장해 둠
pages.forEach((page) => {
  page.dataset.originalHtml = page.innerHTML;
});

/* =========================
   4. 공통 함수
========================= */

// 검색 결과 숫자 표시
function updateCount() {
  /* 검색결과가 없거나 검색을 안했다면 */
  if (results.length === 0 || currentIndex === -1) {
    currentNumEl.textContent = "0";
    totalNumEl.textContent = "0";
    return;
  }

  currentNumEl.textContent = currentIndex + 1;
  totalNumEl.textContent = results.length;
}

// 검색을 정규식 기반으로 하기 때문에 특수문자도 그냥 텍스트로 처리
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 검색어 안의 공백도 유연하게 검색되게 처리
// 예: "what is" -> "what\\s+is"
function makeRegex(keyword) {
  const safeText = escapeRegExp(keyword.trim());
  /* 공백을 \s+로 전환하여 텍스트 사이에 있는 공백 전부 찾기 가능 */
  const spaceFlexibleText = safeText.replace(/\s+/g, "\\s+");
  return new RegExp(spaceFlexibleText, "gi");
}

// 모든 페이지를 원본 상태로 되돌리기
function clearHighlights() {
  pages.forEach((page) => {
    page.innerHTML = page.dataset.originalHtml;
  });
}

/* =========================
   5. 한 페이지 안 검색어 강조
========================= */

function highlightPage(page, keyword) {
  const regex = makeRegex(keyword);
  /* 지금 페이지에서 모든 텍스트 탐색할 수 있게 */
  const walker = document.createTreeWalker(
    page,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;

    // 빈 텍스트는 제외
    if (!node.nodeValue.trim()) continue;

    // script/style 안은 제외
    const parentTag = node.parentNode.nodeName;
    if (parentTag === "SCRIPT" || parentTag === "STYLE") continue;

    regex.lastIndex = 0;
    /* 실제 검색 */
    if (regex.test(node.nodeValue)) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    const fragment = document.createDocumentFragment();

    regex.lastIndex = 0;
    let lastIndex = 0;
    let match = '';

    while ((match = regex.exec(text)) !== null) {
      // 검색어 앞 텍스트
      const before = text.slice(lastIndex, match.index);
      if (before) {
        fragment.appendChild(document.createTextNode(before));
      }

      // 검색어 span
      const span = document.createElement("span");
      span.className = "search-highlight";
      span.textContent = match[0];
      fragment.appendChild(span);

      // 검색어 다음부터 시작
      lastIndex = match.index + match[0].length;
    }

    // 검색어 뒤 텍스트
    const after = text.slice(lastIndex);
    if (after) {
      fragment.appendChild(document.createTextNode(after));
    }

    textNode.parentNode.replaceChild(fragment, textNode);
  });
}

/* =========================
   6. 전체 검색 실행
========================= */

function searchWord() {
  const keyword = wordInput.value.trim();

  if (!keyword) {
    alert("검색할 단어를 입력해주세요.");
    return;
  }

  // 새 검색 시작
  currentKeyword = keyword;
  
  results = [];
  currentIndex = -1;

  // 이전 강조 제거
  clearHighlights();

  // 모든 페이지 돌면서 검색
  pages.forEach((page, pageIndex) => {
    const regex = makeRegex(keyword);

    // 이 페이지에 검색어가 있는지 먼저 확인
    regex.lastIndex = 0;
    if (!regex.test(page.textContent)) return;

    // 이 페이지에서 검색어 강조
    highlightPage(page, keyword);

    // 강조된 span들을 찾아서 results에 저장
    const highlights = page.querySelectorAll(".search-highlight");

    highlights.forEach((item, index) => {
      results.push({
        page: pageIndex + 1, // 몇 페이지인지
        order: index         // 그 페이지 안에서 몇 번째인지
      });
    });
  });

  countWrap.classList.remove("hide");
  searchBtn.forEach((btn) => {
    btn.classList.remove("hide");
  });

  if (results.length === 0) {
    updateCount();
    alert("검색 결과가 없습니다.");
    return;
  }

  // 첫 번째 결과로 이동
  moveToResult(0);
}

/* =========================
   7. 검색 결과로 이동
========================= */

function moveToResult(index) {
  if (results.length === 0) {
    currentIndex = -1;
    updateCount();
    return;
  }

  // 범위를 넘으면 순환
  if (index < 0) index = results.length - 1;
  if (index >= results.length) index = 0;

  currentIndex = index;

  // 강조 제거
  document.querySelectorAll(".current-highlight").forEach((el) => {
    el.classList.remove("current-highlight");
  });

  const target = results[currentIndex];

  // 해당 페이지로 이동
  nowPage = target.page;
  showPage(nowPage);

  // 현재 페이지에서 강조된 검색어들 다시 찾기
  const currentPage = document.querySelector(`.page-${target.page}`);
  if (!currentPage) {
    updateCount();
    return;
  }

  const highlights = currentPage.querySelectorAll(".search-highlight");
  const currentTarget = highlights[target.order];

  if (currentTarget) {
    currentTarget.classList.add("current-highlight");
    /* currentTarget.scrollIntoView({
      block: "center",
      behavior: "smooth"
    }); */
  }

  updateCount();
}

/* =========================
   8. 현재 페이지 기준으로 다음/이전 결과 찾기
========================= */

// 현재 페이지에 있는 검색 결과 중 첫 번째 찾기
function findFirstResultInCurrentPage() {
  return results.findIndex((item) => item.page === nowPage);
}

// 현재 페이지에 있는 검색 결과 중 마지막 찾기
function findLastResultInCurrentPage() {
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].page === nowPage) return i;
  }
  return -1;
}

// 다음 찾기용 인덱스 구하기
function getNextIndex() {
  // 지금 보고 있는 결과가 현재 페이지에 있으면 → 그 다음 결과
  if (
    currentIndex !== -1 &&
    results[currentIndex] &&
    results[currentIndex].page === nowPage
  ) {
    return currentIndex + 1;
  }

  // 아니면 현재 페이지 안의 첫 번째 결과
  const firstInPage = findFirstResultInCurrentPage();
  if (firstInPage !== -1) return firstInPage;

  // 현재 페이지 뒤쪽에서 첫 번째 결과
  const nextPageIndex = results.findIndex((item) => item.page > nowPage);
  if (nextPageIndex !== -1) return nextPageIndex;

  // 없으면 맨 처음
  return 0;
}

// 이전 찾기용 인덱스 구하기
function getPrevIndex() {
  // 지금 보고 있는 결과가 현재 페이지에 있으면 → 그 이전 결과
  if (
    currentIndex !== -1 &&
    results[currentIndex] &&
    results[currentIndex].page === nowPage
  ) {
    return currentIndex - 1;
  }

  // 아니면 현재 페이지 안의 마지막 결과
  const lastInPage = findLastResultInCurrentPage();
  if (lastInPage !== -1) return lastInPage;

  // 현재 페이지 앞쪽에서 마지막 결과
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].page < nowPage) return i;
  }

  // 없으면 맨 마지막
  return results.length - 1;
}

/* =========================
   9. 검색 결과 다음 / 이전 버튼 기능
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
   10. 이벤트 연결
========================= */

// 검색 버튼
wordSearchBtn.addEventListener("click", searchWord);

// Enter / Shift+Enter
wordInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  e.preventDefault();

  const inputKeyword = wordInput.value.trim();

  if (!inputKeyword) {
    alert("검색할 단어를 입력해주세요.");
    return;
  }

  // 입력값이 바뀌었으면 새 검색
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

// 버튼 클릭
wordNextBtn.addEventListener("click", moveNextMatch);
wordPrevBtn.addEventListener("click", movePrevMatch);