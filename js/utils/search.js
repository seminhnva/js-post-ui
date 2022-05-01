import debounce from 'lodash.debounce';

//pure function = dumb function
export function initSearch({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;
  //set default values from query param
  // title - like
  if (defaultParams && defaultParams.get('title_lile')) {
    searchInput.value = defaultParams.get('title_like');
  }
  const debounceSearch = debounce((event) => onChange?.(event.target.value), 500);
  searchInput.addEventListener('input', debounceSearch);
}
