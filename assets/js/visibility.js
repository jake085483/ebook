/* fadein / fadeout 기능*/

// 영역 숨기기
// element = document.querySelector(".className");
function $hide(element) {
    if (!element.classList.contains("hide")) {
        element.classList.add("hide");
    }
    if (element.classList.contains("fadeIn")) {
        element.classList.remove("fadeIn");
    }
};

// fadeIn 효과
// element = ".classname"
// time = 기본값 : 0.1초
function $fadeIn(element, time = 500) {
    element.classList.remove("hide"); // 숨기기 해제
    setTimeout(() => { element.classList.add("fadeIn"); }, time); // fadeIn
};

// hide and fadeIn merge
// element1 => 숨길 요소 element2 => 띄울 요소
// time = 기본값 : 0.1초
function $hideNfadeIn(element1, element2, time = 500) {
    $hide(element1);
    $fadeIn(element2, time);
};