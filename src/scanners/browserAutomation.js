export function extractDOMTree(html) {
  return { tag: 'body', children: [] };
}

export function checkViewportOverflow(node) {
  const isOverflowing = node.width > node.viewportWidth;
  return {
    isOverflowing,
    overflowPx: isOverflowing ? node.width - node.viewportWidth : 0
  };
}
