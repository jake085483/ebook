/* next, prev 페이지 이동에 관한 기능 */
const main = document.querySelector("main");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const nowPageElement = document.querySelector(".now-page");
const totalPageElement = document.querySelector(".total-page");

let totalPageArray = document.querySelectorAll(".page"); // 요약 페이지 전체를 배열로 가져옴
let nowPage = 1;
let totalPage = document.querySelectorAll(".page").length;
showPage(1); // 1페이지 출력

// 이전버튼
prevBtn.addEventListener("click", () => {
    nowPage--;
    showPage(nowPage);
});
// 다음버튼
nextBtn.addEventListener("click", () => {
    nowPage++;
    showPage(nowPage);
});

function showPage(num) {
    let $num = Number(num); // 보고싶은 페이지 번호
    totalPageArray.forEach(item => { // 요약 페이지 전체를 가져옴
        // class name에서 현재 번호를 가져옴
        let nowP = Number(item.className.split(" ")[1].split("-")[1]);
        // 모든 페이지 숨김
        $hide(item);
        // 현재 페이지만 출력
        if (nowP == $num) { $fadeIn(item); };
    });
    // 현재 페이지 번호 표시
    nowPageElement.innerText = nowPage;

    // 총 페이지 표시
    totalPageElement.innerText = totalPage;

    moveBtnChange();
}

// 페이지 이동
function moveBtnChange() {
    // 첫번째 페이지면 이전버튼 opacity 및 클릭 안되게
    if (nowPage === 1) { prevBtn.classList.add("none"); }
    else { prevBtn.classList.remove("none");   }
    // 마지막 페이지면 다음버튼 opacity 및 클릭 안되게
    if (nowPage === totalPage) { nextBtn.classList.add("none"); }
    else { nextBtn.classList.remove("none");   }
}