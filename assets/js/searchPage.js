/* 특정 페이지번호 입력 시 해당 페이지로 이동에 관한 기능 */
const pageInput = document.getElementById("page-search");
const pageBtn = document.querySelector(".page-search-btn");
const pageResetBtn = document.querySelector(".page-reset");

function goToPage() {
    const pageNum = Number(pageInput.value);

    if (pageNum >= 1 && pageNum <= totalPage) {
        nowPage = pageNum;
        showPage(nowPage);
    } else {
        alert("유효한 페이지 번호를 입력해주세요.");
    }
}

pageBtn.addEventListener("click", goToPage);

pageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        goToPage();
    }
});

pageResetBtn.addEventListener("click", () => {
    pageInput.value = "";
})