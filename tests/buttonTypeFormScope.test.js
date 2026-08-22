import test from 'node:test';
import assert from 'node:assert/strict';
import { SourceFixEngine } from '../src/core/sourceFixEngine.js';

const finding = [{ rule: 'missing-button-type' }];

function repair(content) {
  const engine = new SourceFixEngine('/tmp');
  return engine.applyFixes('Page.jsx', content, finding);
}

test('repairs a button outside an unrelated form in the same file', () => {
  const content = `
export function SignupForm() {
  return <form onSubmit={save}><input name="email" /></form>;
}

export function Toolbar() {
  return <button className="menu-trigger">Menu</button>;
}
`;

  const result = repair(content);

  assert.match(result.content, /<button className="menu-trigger" type="button">Menu<\/button>/);
  assert.equal(result.fixes.length, 1);
});

test('does not repair a button that is actually inside a form', () => {
  const content = `
export function Editor() {
  return (
    <form onSubmit={save}>
      <button className="secondary-action">Preview</button>
    </form>
  );
}
`;

  const result = repair(content);

  assert.equal(result.content, content);
  assert.equal(result.fixes.length, 0);
});

test('a later unrelated form does not suppress an earlier safe button repair', () => {
  const content = `
export function Toolbar() {
  return <button className="menu-trigger">Menu</button>;
}

export function SignupForm() {
  return <form onSubmit={save}><input name="email" /></form>;
}
`;

  const result = repair(content);

  assert.match(result.content, /<button className="menu-trigger" type="button">Menu<\/button>/);
  assert.equal(result.fixes.length, 1);
});
