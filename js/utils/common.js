export function setTextContents(parent, selector, text, isImg = false) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element && !isImg) {
    element.textContent = text;
  } else {
    element.src = text;
    element.addEventListener('error', () => {
      element.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }
}

export function truncateText(text, maxLength) {
  if (text.length < maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export function setFieldContent(form, selector, value) {
  if (!form) return;
  const field = form.querySelector(selector);
  if (field) {
    field.value = value;
  }
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element) {
    element.style.backgroundImage = `url("${imageUrl}")`;
  }
}

export function randomNumber(n) {
  if (n <= 0) return -1;
  const random = Math.random() * (n - 0);
  return Math.round(random);
}
