import { SPECIAL_KEYS } from '../utilities/special-keys';
import { wordsReplacer } from '../utilities/words-replacer';
import { applicationIdentifier } from '../utilities/application-identifier';

/**
 * GS1 References
 * {@link https://www.barcodefaq.com/2d/gs1-datamatrix/ GS1 Data matrix}.
 * {@link https://www.barcodefaq.com/barcode-properties/definitions/gs1-application-identifiers/ Application Identifiers}.
 * {@link https://www.gs1.org/docs/barcodes/GS1_DataMatrix_Guideline.pdf GS1 Data matrix}.
 * {@link https://www.databar-barcode.info/application-identifiers/ Application Identifiers}.
 */

/**
 * GS1 Parser
 * @example
 * input: 4000136896ShiftGShiftDShiftMClearAlt0029Clear01006815990637223010 with ClearAlt0029Clear as FNC
 * output:
 *  0: {"400" => "0136896GDM"}
 *  1: {"01" => "00681599063722"}
 *  2: {"30" => "10"}
 *  3: {"GS1" => "(400)0136896GDM(01)00681599063722(30)10"}
 * 
 * @param text Scanner raw value
 * @param FNCs Array of functional keys which acts as separators for variable length AIs.
 * @param specialKeys Keys thats needs to filtered out, like Shift, Enter ...
 * @returns 
 */
export const gs1Parser = (text: string, FNCs: string[], specialKeys = SPECIAL_KEYS) => {
  const gs1Map = new Map();
  const aiMaps = new Map();
  const ais = [''];
  const basicParsed = wordsReplacer(text, specialKeys, '');
  const parsedFNC = wordsReplacer(basicParsed, FNCs, '<GS>');
  const gs = parsedFNC.split('<GS>');
  gs.forEach((gs) => {
    const aiSplits = splitAis(gs);
    aiSplits.forEach((aiSplit) => {
      const aiDetails = getAiDetails(aiSplit)
      if (aiDetails) {
        aiMaps.set(aiDetails.ai, aiSplit.substring(aiDetails.ai.length, aiDetails.ai.length + aiDetails.length));
        ais.push(formattedAi(aiSplit, aiDetails.ai.length))
      }
    })
  });

  if (basicParsed && ais.length === 1) {
    gs1Map.set('1D', basicParsed);
    return gs1Map
  } else if (basicParsed && ais.length > 1) {
    gs1Map.set('1D', basicParsed)
    gs1Map.set('2D', new Map([['gs1', ais.join('')], ...aiMaps]))
    return gs1Map
  } else {
    return null;
  }
}

/**
 * Wraps with () around AI code
 * 
 * @param ai AI, eg: 013456789012345
 * @param length Length of ai
 * @returns (01)3456789012345
 */
export const formattedAi = (ai: string, length: number) => {
  return `(${ai.substring(0, length)})${ai.substring(length)}`
}

/**
 * Splits AIs based on their fixed lengths and returns array of AIs
 * 
 * @param text AI / Combination of AIs
 * @param ais Array of AIs
 * @returns  Array of split AIs
 */
export const splitAis = (text: string, ais: string[] = []) => {
  if (!text) {
    return ais;
  }
  const aiDetails = getAiDetails(text);
  if (aiDetails) {
    ais.push(text.substring(0, aiDetails.ai.length + aiDetails.length));
    splitAis(text.substring(aiDetails.ai.length + aiDetails.length), ais)
  }
  return ais;
}

/**
 * Checks 2,3,4 digit Ais and returns details
 * 
 * @param text AI text
 * @returns AI details
 */
export const getAiDetails = (text: string) => {
  return applicationIdentifier.get(text.substring(0, 2))
    ? applicationIdentifier.get(text.substring(0, 2))
    : applicationIdentifier.get(text.substring(0, 3))
      ? applicationIdentifier.get(text.substring(0, 3))
      : applicationIdentifier.get(text.substring(0, 4))
        ? applicationIdentifier.get(text.substring(0, 4))
        : null;
}