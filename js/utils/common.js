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
