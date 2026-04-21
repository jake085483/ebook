/* 페이지 구성 기능 */

/* =========================
  1. 페이지 데이터
========================= */

const pageInfo = [
  {
    id: 1,
    type: "intro",
    title: "국립중앙도서관 2026년 ebook 인트로",
    description: "안녕하세요 이음컨텐츠입니다."
  },

  {
    id: 2,
    type: "index",
    title: "목차",
    content: [
      {
        title: "Chapter 1: Introduction to Ebooks",
        page: 4,
        children: [
          {
            title: "1.1 What is an ebook?",
            page: 5,
            children: [
              { title: "1.1.1 Definition and history of ebooks", page: 6 },
              { title: "1.1.2 Comparison with print books", page: 7 },
              { title: "1.1.3 Current trends in ebook publishing", page: 9 }
            ]
          },
          { title: "1.2 Popular ebook formats", page: 11 },
          { title: "1.3 Key benefits for readers and authors", page: 13 }
        ]
      },

      {
        title: "Chapter 2: Benefits of Ebooks",
        page: 15,
        children: [
          {
            title: "2.1 Accessibility and portability",
            page: 16,
            children: [
              { title: "2.1.1 Device compatibility", page: 17 },
              { title: "2.1.2 Screen readability", page: 20 }
            ]
          },
          {
            title: "2.2 Lower production and distribution costs",
            page: 21,
            children: [
              { title: "2.2.1 Self-publishing opportunities", page: 23 },
              { title: "2.2.2 Global distribution potential", page: 25 }
            ]
          },
          { title: "2.3 Interactive and searchable content", page: 26 }
        ]
      },

      {
        title: "Chapter 3: How to Create an Ebook",
        page: 27,
        children: [
          {
            title: "3.1 Planning your ebook structure",
            page: 28,
            children: [
              { title: "3.1.1 Defining your target audience", page: 29 },
              { title: "3.1.2 Organizing content into chapters", page: 30 }
            ]
          },
          { title: "3.2 Writing, editing, and design tips", page: 32 },
          {
            title: "3.3 Publishing and file conversion",
            page: 33,
            children: [
              { title: "3.3.1 Choosing the right format", page: 34 },
              { title: "3.3.2 Optimizing for different devices", page: 35 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 3,
    type: "index",
    title: "목차2",
    content: [
      {
        title: "Chapter 4: Introduction to Ebooks",
        page: 37,
        children: [
          {
            title: "4.1 What is an ebook?",
            page: 38,
            children: [
              { title: "4.1.1 Definition and history of ebooks", page: 39 },
              { title: "4.1.2 Comparison with print books", page: 43 },
              { title: "4.1.3 Current trends in ebook publishing", page: 45 }
            ]
          },
          { title: "4.2 Popular ebook formats", page: 46 },
          { title: "4.3 Key benefits for readers and authors", page: 47 }
        ]
      },

      {
        title: "Chapter 5: Benefits of Ebooks",
        page: 49,
        children: [
          {
            title: "5.1 Accessibility and portability",
            page: 51,
            children: [
              { title: "5.1.1 Device compatibility", page: 55 },
              { title: "5.1.2 Screen readability", page: 59 }
            ]
          },
          {
            title: "5.2 Lower production and distribution costs",
            page: 61,
            children: [
              { title: "5.2.1 Self-publishing opportunities", page: 63 },
              { title: "5.2.2 Global distribution potential", page: 64 }
            ]
          },
          { title: "5.3 Interactive and searchable content", page: 65 }
        ]
      },

      {
        title: "Chapter 6: How to Create an Ebook",
        page: 67,
        children: [
          {
            title: "6.1 Planning your ebook structure",
            page: 68,
            children: [
              { title: "6.1.1 Defining your target audience", page: 69 },
              { title: "6.1.2 Organizing content into chapters", page: 70 }
            ]
          },
          { title: "6.2 Writing, editing, and design tips", page: 72 },
          {
            title: "6.3 Publishing and file conversion",
            page: 73,
            children: [
              { title: "6.3.1 Choosing the right format", page: 74 },
              { title: "6.3.2 Optimizing for different devices", page: 75 }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 4,
    type: "main",
    title: "국립중앙도서관 2026년 ebook 본문",
    description: "안녕하세요 이음컨텐츠입니다."
  },

  {
    id: 5,
    type: "main",
    title: "국립중앙도서관 2026년 ebook 본문2",
    description: "안녕하세요 이음컨텐츠입니다."
  },

  {
    id: 6,
    type: "main",
    title: "국립중앙도서관 2026년 ebook 본문3",
    description: "안녕하세요 이음컨텐츠입니다."
  },

  {
    id: 7,
    type: "summary",
    title: "국립중앙도서관 2026년 ebook 요약/정리",
    description: [
      ["핵심 정리", 
        [
          
          ["안녕하세요 이음컨텐츠입니다.",
            [
              ["sdsdsdsd"]
            ]
          ],
          ["전자책의 기본 개념을 정리합니다."]
        
        ]
      ],
      ["추가 정리",
        [
          ["검색 기능이 포함됩니다."],
          ["목차 이동 기능이 포함됩니다."]
        ]
      ]
    ]
  },

  {
    id: 8,
    type: "reference",
    title: "국립중앙도서관 2026년 ebook 부록/참고자료",
    description: "안녕하세요 이음컨텐츠입니다."
  },

  {
    id: 9,
    type: "reference",
    title: "국립중앙도서관 2026년 ebook 부록/참고자료",
    description: "(video) refresh.mp4"
  },

  {
    id: 10,
    type: "outro",
    title: "국립중앙도서관 2026년",
    description: "(img) refresh.png",
    
  }
  
];

/* =========================
  2. 목차 리스트 생성 함수
========================= */

function createList(data, depth = 1) {
  const ol = document.createElement("ol");
  ol.classList.add(`depth-${depth}`);

  data.forEach((item) => {
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.href = "#";
    a.textContent = `${item.title} - ${item.page}`;
    a.dataset.page = item.page;

    li.appendChild(a);

    if (item.children && item.children.length > 0) {
      li.appendChild(createList(item.children, depth + 1));
    }

    ol.appendChild(li);
  });

  return ol;
}

/* =========================
  3. 페이지 하나 생성 함수
========================= */

function parseMedia(description) {
  // 문자열이 아니면 바로 종료
  if (!description || typeof description !== "string") return null;

  // (video) refresh.mp4 → ["(video)", "refresh.mp4"]
  const match = description.match(/\((.*?)\)\s*(.*)/);

  if (!match) return null;

  const type = match[1];   // video, img
  const file = match[2];   // refresh.mp4

  return { type, file };
}

function createPageSection(page, index) {
  const section = document.createElement("section");

  // 공통 section 클래스
  section.classList.add("page", `page-${page.id}`, `${page.type}`);

  // 첫 페이지 제외 hide
  if (index !== 0) {
    section.classList.add("hide");
  }

  // 공통 제목
  if (page.title) {
    const h2 = document.createElement("h2");
    h2.innerHTML = page.title;
    h2.classList.add("section-title")
    section.appendChild(h2);
  }

  // description 안의 (video), (img) 파싱
  const media = parseMedia(page.description);

  // =========================
  // type: index (목차)
  // =========================
  if (page.type === "index") {
    if (page.content && page.content.length > 0) {
      const list = createList(page.content);
      section.appendChild(list);
    }
  }

  // =========================
  // type: summary (요약/정리)
  // =========================
  else if (page.type === "summary") {
    if (page.description && page.description.length > 0) {
      const list = createSummaryList(page.description);
      section.appendChild(list);
    }
  }

  // =========================
  // description: (video) xxx.mp4
  // =========================
  else if (media && media.type === "video") {
    const video = document.createElement("video");
    video.src = `./assets/mp4/${media.file}`;
    video.controls = true;
    section.appendChild(video);
  }

  // =========================
  // description: (img) xxx.png
  // =========================
  else if (media && media.type === "img") {
    const img = document.createElement("img");
    img.src = `./assets/images/${media.file}`;
    img.alt = page.title || "";
    section.appendChild(img);
  }

  // =========================
  // 기본 텍스트 페이지
  // =========================
  else {
    if (page.description) {
      const p = document.createElement("p");
      p.innerHTML = page.description;
      section.appendChild(p);
    }
  }

  return section;
}

function createSummaryList(data, depth = 1, path = []) {
  const ul = document.createElement("ul");

  // ul 클래스: ul-1, ul-2, ul-3 ...
  ul.classList.add(`ul-${depth}`);

  data.forEach((item, index) => {
    const li = document.createElement("li");

    // 현재 li 위치 경로
    const currentPath = [...path, index + 1];

    // li 클래스: li-1, li-1-1, li-1-1-1 ...
    li.classList.add(`li-${currentPath.join("-")}`);

    // item이 문자열이면 그냥 li에 넣기
    if (typeof item === "string") {
      li.textContent = item;
      ul.appendChild(li);
      return;
    }

    // item이 배열이면 [title, children] 구조로 처리
    if (Array.isArray(item)) {
      const [title, children] = item;

      // title 출력
      if (typeof title === "string") {
        li.textContent = title;
      }

      // children이 있으면 하위 ul 생성
      if (children && Array.isArray(children) && children.length > 0) {
        const childUl = createSummaryList(children, depth + 1, currentPath);
        li.appendChild(childUl);
      }

      ul.appendChild(li);
    }
  });

  return ul;
}

/* =========================
  4. 전체 페이지 렌더링
========================= */

function renderPages() {
  const main = document.querySelector("main");
  if (!main) return;

  // main 비우기
  main.innerHTML = "";

  // pageInfo를 기준으로 section.page 생성
  pageInfo.forEach((page, index) => {
    const section = createPageSection(page, index);
    main.appendChild(section);
  });
}

/* =========================
  5. 목차 클릭 이벤트
========================= */

document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-page]");
  if (!link) return;

  e.preventDefault();

  const targetPage = Number(link.dataset.page);

  // 범위 체크
  if (targetPage >= 1 && targetPage <= totalPage) {
    nowPage = targetPage;
    showPage(nowPage);
  } else {
    alert("존재하지 않는 페이지입니다.");
  }
});

/* =========================
  6. 실행
========================= */

renderPages();