import { getPagination } from './selector';
export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
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

export function initPagination({ elementId, defaultParams, onChange }) {
  //blind click event for prev/ next
  console.log({ elementId, defaultParams, onChange })
  const ulPagination = document.getElementById(elementId);
 
  if (!ulPagination) return;

  // set current active page
  // todo: use default params

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      //prevClick
      e.preventDefault();
      const page = +ulPagination.dataset.page || 1;
      if (page > 2) onChange?.(page - 1);
    });
  }

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (nextLink) {
    // nextClick
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = +ulPagination.dataset.page || 1;
      const totalPages = ulPagination.dataset.totalPages;
      if (page < totalPages) onChange?.(page + 1);
    });
  }
}
