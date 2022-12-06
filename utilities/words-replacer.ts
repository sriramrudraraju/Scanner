/**
 * Replaces the words in a string with a substitute
 * 
 * @param text Sentence
 * @param words Array of words that needs to be replaced
 * @param replaceWith Replace with character
 * @returns New sentence
 */
export const wordsReplacer = (text: string, words: string[], replaceWith = '') => words.reduce((result, word) => result.replaceAll(word, replaceWith), text);