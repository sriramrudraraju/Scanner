/**
 * Inspired from onScan.js.
 * {@link https://github.com/axenox/onscan.js onscan.js}.
 */

import { basicParser } from './parsers/basic';
export interface ScannerError {
  message: string;
  code: "EXCLUDED_NODES",
  event?: KeyboardEvent
}

export interface ScannerValues {
  /**
   * parsed: processed value based on filters and assumptions
   */
  parsed: Map<any, any>;
  /**
   * scanned: raw value from scanner
   */
  scanned: string
}

export interface Options {
  /**
   * timer: [timer = 100] After detecting prefix key, milliseconds after which scanning is considered done.
   * @note if prefixKeys exists, only then timer logic is used.
   */
  timer: number;
  /**
   * prefixKeys: List of possible keys that can be as prefix to the barcode.
   */
  prefixKeys: string[];
  /**
   * suffixKeys: List of possible keys that can be as suffix to the barcode.
   */
  suffixKeys: string[];
  /**
   * excludeListeningFromNodes: [excludeListeningFromNodes = ["TEXTAREA", "INPUT"]] Events from these nodes will be ignored.
   * @note if suffixKeys exists. keyGap, prefixKeys logic is ignored.
   */
  excludeListeningFromNodes: string[];
  /**
   * keyGap: [keyGap = 40] Max time gap in milliseconds between each keydown events.
   */
  keyGap: number;
  /**
   * onException: Callback that return error or exception messages when encountered any.
   */
  onException: (e: ScannerError) => void;
  /**
   * onScan: Callback that return scanner values.
   */
  onScan: (values: ScannerValues) => void;
  /**
   * onKeyDetect: Callback after detecting a keyDown from expected nodes.
   */
  onKeyDetect: (key: string, event: KeyboardEvent) => void;
  /**
   * barcodeParser: Parser logic to parse the scanner value.
   */
  barcodeParser: (value: string) => Map<string, string> | null;
}

const defaultOptions: Partial<Options> = {
  timer: 100,
  prefixKeys: [],
  suffixKeys: [],
  excludeListeningFromNodes: ["TEXTAREA", "INPUT"],
  keyGap: 40
}

const KEYDOWN = "keydown";

/**
 * 
 * 1. We cant differentiate scanner keydown vs regualr keyboard keydown
 * 2. We can identify if its a scanner mostly based on 
 *    Timer-based:
 *      The scanner is likely to input characters much quicker than a user can (sensibly) with a keyboard. Calculate how quickly keystrokes are being received.
 *    Prefix-based:
 *      Most scanners can be configured to prefix all scanned data. Use the prefix to start intercepting all input and once you've got your barcode you stop intercepting input.
 * 3. Ignore other keydown events as many as possible.
 *    Below are the considerations for scanner keydown events:
 *     - Events from certain nodes nedds to ignored
 *     - No special keys should be cpatured
 */
export class Scanner {
  private options: Partial<Options>;
  private scanned = "";
  private reading = false;
  private keyGapInterval: number | null = null;
  private previousKey: KeyboardEvent | null = null;

  constructor(options?: Partial<Options>) {
    this.options = { ...defaultOptions, ...options };
  }

  /**
   * Add keydown event listeners on document level.
   */
  addEventListeners = () => {
    // for listeneing to keydown events
    document.addEventListener(KEYDOWN, this.onKeyDown);
  }

  /**
   * Remove keydown event listeners on document level.
   */
  removeEventListeners = () => {
    document.removeEventListener(KEYDOWN, this.onKeyDown);
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (this.isExcludedNode(e)) {
      this.handleException({
        message: "Event is from excluded nodes",
        code: "EXCLUDED_NODES",
        event: e
      })
    } else {
      this.handleKeyDetect(e);
      if (this.options.suffixKeys?.length) {
        if (this.options?.suffixKeys.includes(e.key)) {
          this.dispatch()
        }
      }
      else if (this.options.prefixKeys?.length) {
        if (this.options?.prefixKeys.includes(e.key)) {
          this.handleTimer();
        }
      }
      else {
        const keyGap = this.previousKey ? (e.timeStamp - this.previousKey.timeStamp) : -1;
        if (this.options.keyGap && keyGap < this.options.keyGap) {
          this.previousKey = e;
          // creates and resets timer unless its a last keypress
          this.handleKeyGapInterval()
        }
      }
    }
  }

  /**
   * setOptions to update options
   * 
   * @param options Scanner options
   */
  setOptions = (options: Partial<Options>) => {
    this.options = { ...this.options, ...options }
  }

  /**
   * simulateScan simulates scanner by dispatching keyborad events
   * 
   * @param scan True scan the scanner will output
   */
  simulateScan = (scan: string) => {
    scan.split('').forEach((key) => {
      document.dispatchEvent(new KeyboardEvent(KEYDOWN, { key }));
    })
  }

  private dispatch = () => {
    const parsed = this.handleBarcodeParser();
    if (parsed) {
      const detail = { parsed, scanned: this.scanned }
      // dispatching new custom event with value as scannedValue
      const scanned = new CustomEvent<ScannerValues>("scan", {
        detail,
      });
      document.dispatchEvent(scanned);
      this.options.onScan && this.options.onScan(detail);
    }
    this.scanned = "";
    this.previousKey = null;
  }

  private handleException(e: ScannerError) {
    this.options.onException && this.options.onException(e)
  }

  private handleBarcodeParser() {
    return this.options.barcodeParser
      ? this.options.barcodeParser(this.scanned)
      : basicParser(this.scanned);
  }

  private handleKeyDetect(event: KeyboardEvent) {
    this.scanned += event.key
    this.options.onKeyDetect && this.options.onKeyDetect(event.key, event)
  }

  private handleTimer = () => {
    if (!this.reading) {
      this.reading = true;
      setTimeout(() => {
        this.dispatch();
        this.reading = false;
      }, this.options.timer);
    }
  }

  private handleKeyGapInterval = () => {
    if (this.keyGapInterval) {
      clearInterval(this.keyGapInterval);
    }
    this.keyGapInterval = setInterval(() => {
      this.dispatch()
      if (this.keyGapInterval) {
        clearInterval(this.keyGapInterval);
      }
    }, this.options.keyGap)
  }

  private isExcludedNode = (event: KeyboardEvent) => {
    // exclude events triggered from these nodes
    return this.options.excludeListeningFromNodes?.includes(
      (event.target as any).nodeName
    );
  }
}