/**
 * @param {String} el
 * @param {String} classNames
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param  {...array} dataAttr
 */

export default function create(
  el: string,
  classNames: string,
  child?: HTMLElement | string | Array<HTMLElement> | null,
  parent?: HTMLElement | null,
  dataAttr?: string[][],
): HTMLElement {
  let element: HTMLElement;
  try {
    element = document.createElement(el);
  } catch (error) {
    throw new Error('Unable to create HTMLElement! Give a proper tag name');
  }

  if (classNames) element.classList.add(...classNames.split(' ')); // "class1 class2 class3"

  if (child && Array.isArray(child)) {
    child.forEach((childElement) => childElement && element.appendChild(childElement));
  } else if (child && typeof child === 'object') {
    element.appendChild(child);
  } else if (child && typeof child === 'string') {
    element.innerHTML = child;
  }

  if (parent) {
    parent.appendChild(element);
  }

  if (dataAttr?.length) {
    dataAttr.forEach((rec) => {
      const [attrName, attrValue] = rec;
      if (rec.length) {
        if (attrName.match(/value|id|placeholder|cols|rows|autocorrect|selected|disabled|width|height/)) {
          element.setAttribute(attrName, attrValue);
        } else {
          element.dataset[attrName] = attrValue;
        }
      }
    });
  }
  return element;
}
