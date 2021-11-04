
/* 
    Commonly used helper functions.
*/

function log(s: any) {
    console.log(s);
}

function q(selector: string, elem?: Element) {
    if (elem) return elem.querySelector(selector);
    return document.querySelector(selector);
}

function qAll(selector: string, elem?: Element) {
    if (elem) return Array.from(elem.querySelectorAll(selector));
    return Array.from(document.querySelectorAll(selector));
}

function findAncestor(selector: string, elem: Element) {
    let isId, isClass, isAttr, isTag;
    switch (selector[0]) {
        case '#': isId    = true; selector = selector.slice(1);      break;
        case '.': isClass = true; selector = selector.slice(1);      break;
        case '[': isAttr  = true; selector = selector.slice(1, -1);  break;
        default : isTag   = true; selector = selector.toUpperCase(); break;
    }
    while (elem !== null) {
        if      (isId    && elem.id === selector)              break;
        else if (isClass && elem.classList.contains(selector)) break;
        else if (isAttr  && elem.getAttribute(selector))       break;
        else if (isTag   && elem.tagName === selector)         break;
        elem = elem.parentNode as Element;
    }
    return elem;
}

export {log, q, qAll, findAncestor};