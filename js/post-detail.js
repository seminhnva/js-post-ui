import postApi from './api/postApi';
import { setTextContents } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { registerLightBox } from './utils/lightbox';

dayjs.extend(relativeTime);

function renderPostDetail(post) {
  if (!post) return;
  // render title
  setTextContents(document, '#postDetailTitle', post.title);
  // render description
  setTextContents(document, '#postDetailDescription', post.desciption);
  // render author
  setTextContents(document, '#postDetailAuthor', post.author);
  // render updateAt
  setTextContents(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updateAt).format('- DD-MM-YYYY HH:mm')
  );

  // render img
  // setTextContents(document, '#postHeroImage', post,true);
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;
  }
  heroImage.addEventListener('error', () => {
    heroImage.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
  });
  // render edit page link

  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.textContent = 'Edit Post';
  }
  // id = 'goToEditPageLink';
}

(async () => {
  //get post id from url
  //fetch post detail from API
  //render Post detail
  // Light box
  registerLightBox({
    modalId: 'lightbox',
    imgSelector: `img[data-id="lightboxImg"]`,
    prevSelector: `button[data-id="lightboxPrev"]`,
    NextSelector: `button[data-id="lightboxNext"]`,
  });
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postID = searchParams.get('id');
    if (!postID) return;
    const post = await postApi.getById(postID);

    //Render
    renderPostDetail(post);
  } catch (error) {
    console.log(error);
  }
})();
