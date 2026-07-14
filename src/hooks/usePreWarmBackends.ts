import { useEffect } from "react";

const BACKENDS = [
  "https://stock-controll-back.onrender.com",
  "https://elianapp.onrender.com",
];

/**
 * Fires fire-and-forget GET requests to backend URLs on mount to wake up
 * Render free-tier services (~50s cold start). Runs once per page load.
 * Errors are silently swallowed — pre-warming is best-effort.
 */
export function usePreWarmBackends(): void {
  useEffect(() => {
    for (const url of BACKENDS) {
      fetch(url, { mode: "no-cors", keepalive: true }).catch(() => {
        /* pre-warming is best-effort */
      });
    }
  }, []);
}
