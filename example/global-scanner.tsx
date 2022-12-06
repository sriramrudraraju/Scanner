import { useEffect } from "react";
import { Scanner } from "../scanner/scanner";
import { gs1Parser } from "../scanner/parsers/gs1";

const scanner = new Scanner({
  onException: (e) => {
    console.log("exception", e);
  },
  onKeyDetect(key, e) {
    // console.log("keydown", e);
  },
  barcodeParser: (scanned) => gs1Parser(scanned, ["Clear0029Clear", "F8"]),
});

interface GlobalScannerInterface {
  /**
   * disabled: boolean, to disable scanner
   */
  disabled?: boolean;
}

export const GlobalScanner = ({ disabled = false }: GlobalScannerInterface) => {
  useEffect(() => {
    if (!disabled) {
      scanner.addEventListeners();
    }
    return () => {
      scanner.removeEventListeners();
    };
  }, [disabled]);

  return null;
};
