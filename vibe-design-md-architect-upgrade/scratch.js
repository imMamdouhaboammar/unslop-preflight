const regex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u;
const d1 = "Make it look happy 😊";
const d2 = "Test";
console.log("😊", regex.test(d1));
console.log("Test", regex.test(d2));
