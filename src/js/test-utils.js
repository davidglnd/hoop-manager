
export function createElement(tagName) {
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  return element;
}

export function removeElement(element) {
  document.body.removeChild(element);
}