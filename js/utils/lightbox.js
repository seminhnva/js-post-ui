function showModal(modalElement) {
  //make sure bootstrap scrip is loaded
  if (!window.bootstrap) return;
  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function registerLightBox({ modalId, imgSelector, prevSelector, NextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  if (Boolean(modalElement.dataset.registered)) return;

  //selectors
  const imageElement = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(NextSelector);

  if (!imgSelector || !prevButton || !nextButton) return;

  // lightbox var
  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src;
  }

  // handle click for all imgs => event delegation
  // img click > find all imgs with the same album / gallery
  // determine index of selected img
  // show modal with selected img
  // handle prev/ next click

  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    imgList = document.querySelectorAll(`img[data-album ="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);

    //set img at index
    showImageAtIndex(currentIndex);
    // show modal
    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImageAtIndex(currentIndex);
    //   show prev img of current album
  });
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    showImageAtIndex(currentIndex);
    //   show prev img of current album
  });
  modalElement.dataset.registered = true;
}
