import { escapeHtml } from './utils.js';

let currentPage = 1;
const articlePerPage = 18;

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const getArticles = async(currentPage=0, articlePerPage=0) => {
    const checked = await document.querySelector('input[name=btnradio]:checked')
    const keyword = await document.getElementById('keyword').value;
    let category = '';
    
    if (checked.id === 'btnradio1') {
        category = ''
    }
    if (checked.id === 'btnradio2') {
        category = '生活'
    }
    if (checked.id === 'btnradio3') {
        category = '科技'
    }
    if (checked.id === 'btnradio4') {
        category = '美食'
    }
    if (checked.id === 'btnradio5') {
        category = '理財'
    }

    const response = await fetch(`/api/articles?category=${category}&page=${currentPage}&articlesPerPage=${articlePerPage}&title=${keyword}`, {
        method: 'GET',
    }).then(async (res) => {
        return await res.json();
    });

    let articles = response;

    return articles;
};

const reloadAll = async() => {
    const articles = await getArticles();
    const pageAmount = Math.ceil(articles.length / articlePerPage);
    while (currentPage > pageAmount && currentPage !== 1){
        --currentPage;
    }

    const PageArticles = await getArticles(currentPage, articlePerPage);
    await reloadArticles(PageArticles);
    await reloadHomePageNav(pageAmount);
    // Save current page in URL params
    const url = new URL(window.location);
    url.searchParams.set('page', currentPage);
    window.history.pushState({}, '', url);
};

const reloadArticles = async (PageArticles) => {
    let articleList = '';
    for (let i = 0; i < PageArticles.length; i++) {
        if (i % 3 === 0) {
            articleList += `<div class="row mb-3">`
        }
        let articleContent = PageArticles[i].content;
        if (articleContent.length > 100) {
            articleContent = articleContent.slice(0, 100) + '...';
        }
        let createdAt = new Date(PageArticles[i].createdAt).toLocaleString('Zh-TW', { timeZone: 'Asia/Taipei', hour12: false });
        articleList += `
        <div class="col-sm-4">
            <div class="card">
                <div class="card-header">
                    ${PageArticles[i].category}
                </div>
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="/comments?id=${PageArticles[i].id}" class="card-link link-dark">
                            ${escapeHtml(PageArticles[i].title)}
                        </a>
                    </h5>
                    <h6 class="card-subtitle mb-2 text-muted">${PageArticles[i].name}</h6>
                    <p class="card-text">${escapeHtml(articleContent)}</p>
                    <p class="card-text"><small class="text-muted">${createdAt}</small></p>
                </div>
            </div>
        </div>
        `;
        if (i % 3 === 2 || i === PageArticles.length - 1) {
            articleList += `</div>`
        }
    }

    document.querySelector('#articles-list').innerHTML = articleList;
}

const reloadHomePageNav = async (pageAmount) => {
    const pageUl = document.getElementById("home-page-nav-ul");
    let pageHtml = '';

    // 上一頁按鈕
    if (currentPage > 1) {
        pageHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}">＜</a></li>`;
    } else {
        pageHtml += `<li class="page-item disabled"><span class="page-link">＜</span></li>`;
    }

    for (let i = 1; i <= pageAmount; ++i) {
        if (currentPage === i) {
            pageHtml += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        } else {
            pageHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
    };

    if (currentPage < pageAmount) {
        pageHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}">＞</a></li>`;
    } else {
        pageHtml += `<li class="page-item disabled"><span class="page-link">＞</span></li>`;
    }
    pageUl.innerHTML = pageHtml;
}

const switchHomePage = async (e) => {
    e.preventDefault();
    if (e.target.nodeName !== 'A') return;
    currentPage = Number(e.target.dataset.page);
    window.scrollTo(0, 0);
    await reloadAll();
}

document.querySelectorAll('input[name=btnradio]').forEach(input => input.addEventListener('change', reloadAll))
document.getElementById('keyword').addEventListener('input', (e) => {
    e.preventDefault();
    reloadAll();
})
document.getElementById('home-page-nav-ul').addEventListener('click', switchHomePage);

if (params.page){
    currentPage = Number(params.page);
}
await reloadAll();