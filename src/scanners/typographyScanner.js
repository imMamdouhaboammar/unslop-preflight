const ARABIC_SCRIPT = /[\u0600-\u06FF]/;
const SIMPLE_HTML_ENTITY = /&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]+);/gi;
const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const RAW_TEXT_ELEMENTS = new Set(['script', 'style']);
const MIN_VISIBLE_ARABIC_CHARACTERS = 80;

function readTagAt(content, start) {
  if (content[start] !== '<') return null;

  if (content.startsWith('<!--', start)) {
    const commentEnd = content.indexOf('-->', start + 4);
    return commentEnd === -1 ? null : { kind: 'comment', start, end: commentEnd + 2 };
  }

  if (content.startsWith('<>', start)) {
    return { kind: 'open', name: '#fragment', start, end: start + 1, raw: '<>', selfClosing: false };
  }
  if (content.startsWith('</>', start)) {
    return { kind: 'close', name: '#fragment', start, end: start + 2, raw: '</>', selfClosing: false };
  }

  let quote = null;
  let braceDepth = 0;
  let end = start + 1;

  for (; end < content.length; end++) {
    const char = content[end];
    if (quote) {
      if (char === quote && content[end - 1] !== '\\') quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '{') {
      braceDepth += 1;
      continue;
    }
    if (char === '}' && braceDepth > 0) {
      braceDepth -= 1;
      continue;
    }
    if (char === '>' && braceDepth === 0) break;
  }

  if (end >= content.length) return null;

  const raw = content.slice(start, end + 1);
  if (/^<!|^<\?/.test(raw)) return { kind: 'comment', start, end, raw };

  const closing = /^<\//.test(raw);
  const nameMatch = raw.match(/^<\/?\s*([A-Za-z][\w:.-]*)/);
  if (!nameMatch) return null;

  const name = nameMatch[1];
  const selfClosing = !closing && (/\/\s*>$/.test(raw) || VOID_ELEMENTS.has(name.toLowerCase()));
  return { kind: closing ? 'close' : 'open', name, start, end, raw, selfClosing };
}

function skipJsxExpression(content, start) {
  let depth = 0;
  let quote = null;

  for (let index = start; index < content.length; index++) {
    const char = content[index];
    if (quote) {
      if (char === quote && content[index - 1] !== '\\') quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return -1;
}

function skipQuotedLiteral(content, start) {
  const quote = content[start];
  let index = start + 1;

  while (index < content.length) {
    if (content[index] === '\\') {
      index += 2;
      continue;
    }
    if (content[index] === quote) return index;
    index += 1;
  }

  return content.length - 1;
}

function skipLineComment(content, start) {
  const end = content.indexOf('\n', start + 2);
  return end === -1 ? content.length - 1 : end;
}

function skipBlockComment(content, start) {
  const end = content.indexOf('*/', start + 2);
  return end === -1 ? content.length - 1 : end + 1;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findRawTextClosingTag(content, openingTag) {
  const expectedClosingName = openingTag.name.toLowerCase();
  const closePattern = new RegExp(`</${escapeRegExp(expectedClosingName)}`, 'gi');
  closePattern.lastIndex = openingTag.end + 1;

  for (let match = closePattern.exec(content); match; match = closePattern.exec(content)) {
    const closingTag = readTagAt(content, match.index);
    if (closingTag?.kind === 'close' && closingTag.name.toLowerCase() === expectedClosingName) {
      return closingTag.end;
    }
    closePattern.lastIndex = match.index + 2;
  }

  return -1;
}

function collectJsxElementTags(content, openingTag, tags) {
  tags.push(openingTag);
  if (openingTag.selfClosing) return openingTag.end;

  const expectedClosingName = openingTag.name.toLowerCase();
  if (RAW_TEXT_ELEMENTS.has(expectedClosingName)) {
    return findRawTextClosingTag(content, openingTag);
  }

  let cursor = openingTag.end + 1;
  while (cursor < content.length) {
    if (content[cursor] === '<') {
      const tag = readTagAt(content, cursor);
      if (!tag) {
        cursor += 1;
        continue;
      }
      if (tag.kind === 'comment') {
        cursor = tag.end + 1;
        continue;
      }
      if (tag.kind === 'close') {
        return tag.name.toLowerCase() === expectedClosingName ? tag.end : -1;
      }

      const nestedEnd = collectJsxElementTags(content, tag, tags);
      if (nestedEnd === -1) return -1;
      cursor = nestedEnd + 1;
      continue;
    }

    if (content[cursor] === '{') {
      const expressionEnd = collectTagsFromCode(content, cursor + 1, tags, true);
      if (expressionEnd === -1) return -1;
      cursor = expressionEnd + 1;
      continue;
    }

    cursor += 1;
  }

  return -1;
}

function collectTagsFromCode(content, start, tags, stopAtClosingBrace = false) {
  let braceDepth = stopAtClosingBrace ? 1 : 0;
  let cursor = start;

  while (cursor < content.length) {
    const char = content[cursor];
    if (char === "'" || char === '"' || char === '`') {
      cursor = skipQuotedLiteral(content, cursor) + 1;
      continue;
    }
    if (content.startsWith('//', cursor)) {
      cursor = skipLineComment(content, cursor) + 1;
      continue;
    }
    if (content.startsWith('/*', cursor)) {
      cursor = skipBlockComment(content, cursor) + 1;
      continue;
    }
    if (char === '{') {
      braceDepth += 1;
      cursor += 1;
      continue;
    }
    if (char === '}' && stopAtClosingBrace) {
      braceDepth -= 1;
      if (braceDepth === 0) return cursor;
      cursor += 1;
      continue;
    }
    if (char === '<') {
      const tag = readTagAt(content, cursor);
      if (tag?.kind === 'open') {
        const elementEnd = collectJsxElementTags(content, tag, tags);
        if (elementEnd !== -1) {
          cursor = elementEnd + 1;
          continue;
        }
      }
    }
    cursor += 1;
  }

  return stopAtClosingBrace ? -1 : content.length;
}

function collectMarkupTags(content) {
  const tags = [];
  let cursor = 0;

  while (cursor < content.length) {
    const start = content.indexOf('<', cursor);
    if (start === -1) break;

    const tag = readTagAt(content, start);
    if (!tag || tag.kind !== 'open') {
      cursor = start + 1;
      continue;
    }

    const elementEnd = collectJsxElementTags(content, tag, tags);
    cursor = elementEnd === -1 ? tag.end + 1 : elementEnd + 1;
  }

  return tags;
}

function uniqueOpeningTags(tags) {
  const seenStarts = new Set();
  return tags.filter((tag) => {
    if (seenStarts.has(tag.start)) return false;
    seenStarts.add(tag.start);
    return true;
  });
}

function candidateOpeningTags(content, file) {
  if (/\.(?:jsx?|tsx)$/i.test(file)) {
    const tags = [];
    collectTagsFromCode(content, 0, tags);
    return uniqueOpeningTags(tags);
  }
  if (/\.(?:html|vue|svelte|mdx)$/i.test(file)) return uniqueOpeningTags(collectMarkupTags(content));
  return [];
}

function extractDirectLiteralText(content, openingTag) {
  const stack = [openingTag.name.toLowerCase()];
  let directText = '';
  let cursor = openingTag.end + 1;
  let segmentStart = cursor;

  while (cursor < content.length) {
    if (content[cursor] === '<') {
      if (stack.length === 1) directText += content.slice(segmentStart, cursor);

      const tag = readTagAt(content, cursor);
      if (!tag) {
        cursor += 1;
        continue;
      }

      if (tag.kind === 'open' && !tag.selfClosing) {
        stack.push(tag.name.toLowerCase());
      } else if (tag.kind === 'close') {
        if (stack.at(-1) !== tag.name.toLowerCase()) return null;
        stack.pop();
        if (stack.length === 0) return directText;
      }

      cursor = tag.end + 1;
      segmentStart = cursor;
      continue;
    }

    if (content[cursor] === '{') {
      if (stack.length === 1) directText += content.slice(segmentStart, cursor);
      const expressionEnd = skipJsxExpression(content, cursor);
      if (expressionEnd === -1) return null;
      cursor = expressionEnd + 1;
      segmentStart = cursor;
      continue;
    }

    cursor += 1;
  }

  return null;
}

function staticClassTokens(rawTag) {
  const match = rawTag.match(/\bclass(?:Name)?\s*=\s*(["'])([\s\S]*?)\1/i);
  return match ? new Set(match[2].trim().split(/\s+/).filter(Boolean)) : null;
}

function visibleCharacterCount(text) {
  const entitiesCollapsed = text.replace(SIMPLE_HTML_ENTITY, '¤');
  return Array.from(entitiesCollapsed.replace(/\s/gu, '')).length;
}

function openingTagLine(content, start) {
  return (content.slice(0, start).match(/\n/g) || []).length + 1;
}

function findLongArabicTextHeight(content, file, findings) {
  for (const tag of candidateOpeningTags(content, file)) {
    if (tag.selfClosing) continue;

    const classes = staticClassTokens(tag.raw);
    if (!classes?.has('leading-none')) continue;
    if (!classes.has('text-center') && !classes.has('text-justify')) continue;

    const directText = extractDirectLiteralText(content, tag);
    if (directText === null || !ARABIC_SCRIPT.test(directText)) continue;
    if (visibleCharacterCount(directText) < MIN_VISIBLE_ARABIC_CHARACTERS) continue;

    findings.push({
      file,
      line: openingTagLine(content, tag.start),
      level: 'info',
      rule: 'long-arabic-text-height',
      excerpt: 'Long direct Arabic text uses `leading-none` with centered or justified alignment. Review line-height for clipping and readability.'
    });
  }
}

export const typographyRules = [
  {
    name: 'oversized-typography-mobile-risk',
    level: 'warning',
    pattern: /text-(7xl|8xl|9xl|\[\d{2,3}px\])/i,
    heuristic: (content, file, findings) => {
      const oversizedMatch = /text-(7xl|8xl|9xl|\[\d{2,3}px\])/i.test(content);
      if (oversizedMatch) {
        // If it uses huge text without a responsive prefix like md:text-7xl or clamp
        if (!/md:text-|sm:text-|clamp/i.test(content)) {
          findings.push({
            file,
            line: content.split(/\r?\n/).findIndex(l => /text-(7xl|8xl|9xl|\[\d{2,3}px\])/i.test(l)) + 1,
            level: 'warning',
            rule: 'oversized-typography-mobile-risk',
            excerpt: 'Oversized text utility found without a responsive constraint. This will break mobile layouts.'
          });
        }
      }
    }
  },
  {
    name: 'leading-none-cutoff-risk',
    level: 'warning',
    pattern: /leading-none/i,
    heuristic: (content, file, findings) => {
      if (/leading-none/i.test(content) && /text-(4xl|5xl|6xl|7xl|8xl)/i.test(content)) {
        findings.push({
          file,
          line: content.split(/\r?\n/).findIndex(l => /leading-none/i.test(l)) + 1,
          level: 'info',
          rule: 'leading-none-cutoff-risk',
          excerpt: '`leading-none` on large text can clip descenders (like j, p, q, y). Consider `leading-tight` instead.'
        });
      }
    }
  },
  {
    name: 'long-arabic-text-height',
    level: 'info',
    heuristic: findLongArabicTextHeight
  }
];
