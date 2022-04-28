import axiosClient from './api/axiosClient';
import postApi from './api/postApi';
import { setTextContents, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//to use fromNow
dayjs.extend(relativeTime);

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

  postList.forEach((post, index) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

(async () => {
  try {
    const params = {
      _page: 1,
      _limit: 6,
    };
    const { data, pagination } = await postApi.getAll(params);
    renderPostList(data);
  } catch (error) {
    // console.log(error)
  }
})();
