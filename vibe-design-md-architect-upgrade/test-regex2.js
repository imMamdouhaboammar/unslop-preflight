function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
const sectionOld = (name) => new RegExp(`(?:^|\\n)#{1,3}\\s+.*${escapeRegExp(name)}.*(?:$|\\n)`, 'i');

const text1 = "## Target Users\r\n- Primary user";
console.log("Old Regex CRLF:", sectionOld("Target User").test(text1));
