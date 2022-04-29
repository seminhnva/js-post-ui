import axiosClient from './api/axiosClient';
import postApi from './api/postApi';
import { getPagination, setTextContents, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//to use fromNow
dayjs.extend(relativeTime);

//  STEP1 : RENDER POST
function createPostElement(post) {
  if (!post) return;

  try {
    const postTemplate = document.getElementById('postTemplate');
    if (!postTemplate) return;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true);

    // update title discription, author, thumbnail (NOTE : set true if element is img tag)

    setTextContents(liElement, '[data-id="title"]', post.title);
    setTextContents(liElement, '[data-id="description"]', truncateText(post.description, 100));
    setTextContents(liElement, '[data-id="author"]', post.author);
    setTextContents(liElement, '[data-id="thumbnail"]', post.imageUrl, true);
    setTextContents(liElement, '[data-id="timeSpan"]', ` - ${dayjs(post.updateAt).fromNow()} `);
    // cuculate time span

    //attach event

    return liElement;
  } catch (error) {
    console.log('fall to create post', error);
  }
  // find n clone template
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  //clear current list
  ulElement.textContent = '';

  postList.forEach((post, index) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

// STEP 2: PAGINATION
function renderPagination(pagination) {
  const ulPagination = getPagination();
  if (!pagination || !ulPagination) return;
  //CAL totalpages

  let { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  //save page and totalpages to ulpagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  //check if enable/disable prev/next link
  //prev
  if (_page <= 1) {
    ulPagination.firstElementChild?.classList.add('disabled');
  } else {
    ulPagination.firstElementChild?.classList.remove('disabled');
  }
  //next
  if (_page >= totalPages) {
    ulPagination.lastElementChild?.classList.add('disabled');
  } else {
    ulPagination.lastElementChild?.classList.remove('disabled');
  }
}

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    history.pushState({}, '', url);
    //fetch API
    // re-render post list

    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
      console.log('fail to fetch post list',error)
  }
}

function handlePrevClick(e) {
  e.preventDefault();
  const ulPagination = getPagination();
  if (!ulPagination) return;
  const page = +ulPagination.dataset.page || 1;
  if (page <= 1) return;

  handleFilterChange('_page', page - 1);
}

function handleNextClick(e) {
  e.preventDefault();
  const ulPagination = getPagination();
  if (!ulPagination) return;
  const page = +ulPagination.dataset.page || 1;
  const totalPages = ulPagination.dataset.totalPages;
  if (page >= totalPages) return;

  handleFilterChange('_page', page + 1);
}

function initPagination() {
  //blind click event for prev/ next
  const ulPagination = getPagination();
  if (!ulPagination) return;

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick);
  }

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick);
  }
}
function initURL() {
  const url = new URL(window.location);
  // update search params if needed
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12);
  if (!url.searchParams.get('_pages')) url.searchParams.set('_page', 1);

  history.pushState({}, '', url);
}
(async () => {
  try {
    //attach click event for links
    initPagination();
    // set default pagination(_page,_limit) on url
    initURL();
    //render post list base url params
    const queryParams = new URLSearchParams(window.location.search);

    //set default query params
    console.log(queryParams.toString());

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    // console.log(error)
  }
})();
