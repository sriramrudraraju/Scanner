interface Ai {
  /**
   * purpose: Purpose of the ai
   */
  purpose: string;
  /**
   * length: Max length of this ai
   */
  length: number;
  /**
   * ai: Application Identifier
   */
  ai: string;
  /**
   * isVariable: is length a variable
   */
  isVariable?: boolean;
}

export const applicationIdentifier = new Map<string, Ai>([
  ['00', { purpose: 'SSCC-18', length: 18, ai: '00' }],
  ['01', { purpose: 'GTIN-14', length: 14, ai: '01' }],
  ['02', { purpose: 'GTIN-14', length: 14, ai: '02' }],
  ['10', { purpose: 'Batch', length: 20, ai: '10', isVariable: true }],
  ['11', { purpose: 'Production Date', length: 6, ai: '11' }],
  ['12', { purpose: 'Due Date', length: 6, ai: '12' }],
  ['13', { purpose: 'Packaging Date', length: 6, ai: '13' }],
  ['15', { purpose: 'Best Before Date', length: 6, ai: '15' }],
  ['16', { purpose: 'Sell By Date', length: 6, ai: '16' }],
  ['17', { purpose: 'Expiration Date', length: 6, ai: '17' }],
  ['20', { purpose: 'Variant', length: 2, ai: '20' }],
  ['21', { purpose: 'Serial Number', length: 20, ai: '21', isVariable: true }],
  ['30', { purpose: 'Item Count', length: 8, ai: '30', isVariable: true }],
  ['37', { purpose: 'Trade tem Count', length: 8, ai: '37', isVariable: true }],
  ['91', { purpose: 'USPS', length: 20, ai: '91' }],
  ['253', { purpose: 'GDTI', length: 30, ai: '253', isVariable: true }],
  ['255', { purpose: 'GCN', length: 13, ai: '255' }],
  ['400', { purpose: 'PO Number', length: 30, ai: '400', isVariable: true }],
])