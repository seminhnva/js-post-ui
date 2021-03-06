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
    // goto post detail when click on div.post-item
    const divElement = liElement.firstElementChild;
    if (divElement) {
      divElement.addEventListener('click', (e) => {
        //if event is triggered from menu -> ignore
        const menu = liElement.querySelector('[data-id="menu"]');
        if (menu && menu.contains(e.target)) return;
        window.location.assign(`/post-detail.html?id=${post.id}`);
      });
    }

    //add click event for edit button
    const editButton = liElement.querySelector('[data-id="edit"]');
    if (editButton) {
      editButton.addEventListener('click', (event) => {
        //stop event bubling;
        // event.stopPropagation();

        window.location.assign(`/add-edit-post.html?id=${post.id}`);
      });
    }
    //remove button
    const removeButton = liElement.querySelector('[data-id="remove"]');
    if (removeButton) {
      removeButton.addEventListener('click', (event) => {
        const customEvent = new CustomEvent('post-delete', {
          bubbles: true,
          detail: post,
        });
        removeButton.dispatchEvent(customEvent);
      });
    }
    return liElement;
  } catch (error) {
    console.log('fall to create post', error);
  }
  // find n clone template
}

export function renderPostList(elementId, postList) {
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
