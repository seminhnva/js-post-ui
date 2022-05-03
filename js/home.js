import postApi from './api/postApi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { initPagination, initSearch, renderPagination, renderPostList, toast } from './utils';

//to use fromNow
dayjs.extend(relativeTime);

//  STEP1 : RENDER POST
// STEP 2: PAGINATION

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    if (filterName) url.searchParams.set(filterName, filterValue);
    //reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);
    //fetch API
    // re-render post list

    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('fail to fetch post list', error);
  }
}

function getDefaultParams() {
  const url = new URL(window.location);
  // update search params if needed
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12);
  if (!url.searchParams.get('_pages')) url.searchParams.set('_page', 1);

  history.pushState({}, '', url);
  return url.searchParams;
}

//  STEP 3 - SEARCH

//delte
async function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (e) => {
    //call api remove
    const post = e.detail;
    try {
      let mess = `Are you sure to remove this post ${post.title}?`;
      if (window.confirm(mess)) {
        console.log(post.id);
        await postApi.remove(post.id);
        await handleFilterChange();

        toast.success('remove post successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error(`remove post fail :${error.message}`);
    }
    //refetch
  });
}
(async () => {
  try {
    // set default pagination(_page,_limit) on url
    const queryParams = getDefaultParams();

    registerPostDeleteEvent();

    //render post list base url params
    // const queryParams = new URLSearchParams(window.location.search);
    //attach click event for links
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    handleFilterChange();
  } catch (error) {
    // console.log(error)
  }
})();
