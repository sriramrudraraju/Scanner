import { useEffect } from "react";

/**
 * Custom hook for listening to the events
 *
 * @param eventName Event name
 * @param handler Callback when event is triggered
 */
export function useEventListener(
  eventName: string,
  handler: (event: Event | CustomEvent) => void,
  options?: AddEventListenerOptions
) {
  useEffect(() => {
    document.addEventListener(eventName, handler, options);
    return () => {
      document.removeEventListener(eventName, handler, options);
    };
  }, [eventName, handler, options]);
}

export function useScanEventListener<T>(
  handler: (event: CustomEvent<T>) => void,
  options?: AddEventListenerOptions
) {
  return useEventListener("scan", (e) => handler(e as CustomEvent), options);
}
