import { SPECIAL_KEYS } from '../utilities/special-keys';
import { wordsReplacer } from '../utilities/words-replacer';

/**
 * 
 * @param text Sentence
 * @param words Array or words thats need to be replaced
 * @returns a new sentence with special keys replaced with ''
 */
export const basicParser = (text: string, words = SPECIAL_KEYS) => {
  const parsed = wordsReplacer(text, words, '');
  if (parsed) {
    return new Map([['1D', parsed]])
  }
  return null;
}