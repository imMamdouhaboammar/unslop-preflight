function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
const sectionOld = (name) => new RegExp(`(?:^|\\n)#{1,3}\\s+.*${escapeRegExp(name)}.*(?:$|\\n)`, 'i');
const sectionNew = (name) => new RegExp(String.raw`(?:^|\n)#{1,3}\s+.*${escapeRegExp(name)}.*(?:$|\n)`, 'i');

const text1 = `
## Target Users
- Primary user
`;
console.log("Old Regex:", sectionOld("Target User").test(text1));
console.log("New Regex:", sectionNew("Target User").test(text1));
