/* 특정 페이지번호 입력 시 해당 페이지로 이동하는 기능 */
const pageInput = document.querySelector(".page-search");
const pageBtn = document.querySelector(".page-search-btn");
const pageResetBtn = document.querySelector(".page-reset");

document.addEventListener('wheel', function(e) {
    if (document.activeElement.type === 'number') {
        document.activeElement.blur();
    }
});

// keydown: 특정 키 입력 막기
pageInput.addEventListener("keydown", (e) => {
    if (
        e.key === "e" ||
        e.key === "E" ||
        e.key === "+" ||
        e.key === "-" ||
        e.key === "."
    ) {
        e.preventDefault(); // 입력 차단
    }
});

function goToPage() {
    let inputValue = pageInput.value.trim();

    // 빈값이면 그냥 종료 (원하면 1페이지로 보내도록 바꿀 수도 있음)
    if (inputValue === "") {
        return;
    }

    // 숫자로 변환
    let pageNum = Number(inputValue);

    // 숫자가 아니거나 1보다 작으면 1페이지
    if (isNaN(pageNum) || pageNum < 1) {
        pageNum = 1;
    }

    // totalPage보다 크면 마지막 페이지
    if (pageNum > totalPage) {
        pageNum = totalPage;
    }

    // 현재 페이지 반영
    nowPage = pageNum;
    pageInput.value = pageNum; // 보정된 값 input에도 다시 넣기
    showPage(nowPage);
}

// 버튼 클릭 시 이동
pageBtn.addEventListener("click", goToPage);

// 엔터 입력 시 이동
pageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        goToPage();
    }
});

// 리셋 버튼 클릭 시 입력창 비우기
pageResetBtn.addEventListener("click", () => {
    pageInput.value = "";
});