function stopProp(ev) {
  if (ev.stopPropagation) {
    ev.stopPropagation();
  } else if (window.event) {
    window.event.cancelBubble = true; //兼容IE
  }
}