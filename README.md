# Scanner

JavaScript scan-events for hardware barcode scanners.

## How it works

Attempts to distinguish between regular input and scan input by measuring input spead, looking for certain suffix characters, etc. If a scan is detected, it triggers a custom JavaScript event called `scan` for the DOM element specified during initialization.

## Quick Start

- Not prublished to npm yet, so copy the sanner file to your project and import as module
- Initialize scanner

```typescript
import { Scanner } from "<relative path>/scanner/scanner";

// Create a scanner with optinal configs
scanner = new Scanner(options);

// Adds keydown listener for scanner
scanner.addEventListeners();

// Register event listener
document.addEventListener("scan", function (event) {
  const { parsed, scanned } = (event as CustomEvent).detail;
  console.log("processed scan value", parsed);
  console.log("raw scan value", scanned);
});
```

## Options

The following options can be set when initializing Scanner:

| Option                    | Type                                        | Default               | Description                                                                                                                                          |
| ------------------------- | ------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| timer                     | number                                      | 100                   | After first valid keydown, milliseconds after which scanning is considered. <br><br>Note:<br> - if prefixKeys exists, only then timer logic is used. |
| prefixKeys                | string[]                                    | []                    | List of possible keys that can be as prefix to the barcode.                                                                                          |
| suffixKeys                | string[]                                    | []                    | List of possible keys that can be as suffix to the barcode.                                                                                          |
| excludeListeningFromNodes | string[]                                    | ["TEXTAREA", "INPUT"] | Events from these nodes will be ignored. <br><br>Note:<br> - If suffixKeys exists. keyGap, prefixKeys logic is ignored.                              |
| keyGap                    | number                                      | 40                    | Max time gap in milliseconds between each keydown events.=                                                                                           |
| onException               | (e: ScannerError) => void                   | undefined             | Callback that return error or exception messages when encountered any.                                                                               |
| onScan                    | (values: ScannerValues) => void             | undefined             | Callback that return scanner values.                                                                                                                 |
| onKeyDetect               | (key: string, event: KeyboardEvent) => void | undefined             | Callback after detecting a keyDown from expected nodes.                                                                                              |
| barcodeParser             | (value: string) => Map<string, string>      | undefined             | Parser logic to parse the scanner value.                                                                                                             |

## Simulate Scan

```typescript
// In project

import { Scanner } from "<relative path>/scanner/scanner";

// Create a scanner with optinal configs
scanner = new Scanner(options);

scanner.simulateScan("raw scanned value from scanner");
```

or

```javascript
// In browser console

document.dispatchEvent(
  new KeyboardEvent("keydown", { key: "raw scanned value from scanner" })
);
```
