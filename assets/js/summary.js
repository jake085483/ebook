// 목차를 넣을 위치 선택
const section = document.querySelector(".page-2");

/* 목차 기능 및 목차 클릭 시 해당 페이지로 이동 기능 */
const contentData = [
  {
    title: "Chapter 1: Introduction to Ebooks",
    page: 3,
    children: [
      {
        title: "1.1 What is an ebook?",
        page: 4,
        children: [
          {
            title: "1.1.1 Definition and history of ebooks",
            page: 5
          },
          {
            title: "1.1.2 Comparison with print books",
            page: 6
          },
          {
            title: "1.1.3 Current trends in ebook publishing",
            page: 8
          }
        ]
      },
      {
        title: "1.2 Popular ebook formats",
        page: 10
      },
      {
        title: "1.3 Key benefits for readers and authors",
        page: 12
      }
    ]
  },
  {
    title: "Chapter 2: Benefits of Ebooks",
    page: 14,
    children: [
      {
        title: "2.1 Accessibility and portability",
        page: 15,
        children: [
          {
            title: "2.1.1 Device compatibility",
            page: 16
          },
          {
            title: "2.1.2 Screen readability",
            page: 19
          }
        ]
      },
      {
        title: "2.2 Lower production and distribution costs",
        page: 20,
        children: [
          {
            title: "2.2.1 Self-publishing opportunities",
            page: 21
          },
          {
            title: "2.2.2 Global distribution potential",
            page: 24
          }
        ]
      },
      {
        title: "2.3 Interactive and searchable content",
        page: 26
      }
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
          {
            title: "3.1.1 Defining your target audience",
            page: 29
          },
          {
            title: "3.1.2 Organizing content into chapters",
            page: 30
          }
        ]
      },
      {
        title: "3.2 Writing, editing, and design tips",
        page: 32
      },
      {
        title: "3.3 Publishing and file conversion",
        page: 33,
        children: [
          {
            title: "3.3.1 Choosing the right format",
            page: 34
          },
          {
            title: "3.3.2 Optimizing for different devices",
            page: 35
          }
        ]
      }
    ]
  }
];

// 목차(JSON 데이터)를 기반으로 <ol> 리스트를 생성하는 함수
function createList(data, depth = 1) {
  const ol = document.createElement("ol");
  ol.classList.add(`depth-${depth}`);

  data.forEach(item => {
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.href = "#";
    a.textContent = `${item.title} - ${item.page}`;

    // 이동할 페이지 번호만 저장
    a.dataset.page = item.page;

    li.appendChild(a);

    if (item.children && item.children.length > 0) {
      li.appendChild(createList(item.children, depth + 1));
    }

    ol.appendChild(li);
  });

  return ol;
}

// 목차 생성
section.appendChild(createList(contentData));

// 목차 클릭 이벤트 위임
section.addEventListener("click", (e) => {
  const targetLink = e.target.closest("a[data-page]");

  // 목차 링크가 아니면 종료
  if (!targetLink || !section.contains(targetLink)) return;

  e.preventDefault();

  nowPage = Number(targetLink.dataset.page);
  showPage(nowPage);
});