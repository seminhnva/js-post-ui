import { setTextContents, truncateText } from './common';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//to use fromNow
dayjs.extend(relativeTime);

//  STEP1 : RENDER POST
export function createPostElement(post) {
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

export function renderPostList(elementId,postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  //clear current list
  ulElement.textContent = '';

  postList.forEach((post, index) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
