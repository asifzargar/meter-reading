// useNetworkStatus.js
import { useEffect, useState, useRef } from "react";

/**
 * useNetworkStatus({ pingUrl, pingInterval, timeout })
 * - pingUrl: optional URL to fetch to verify connectivity (e.g. '/favicon.ico' or a small endpoint you control)
 * - pingInterval: how often (ms) to re-check when offline (default 5000)
 * - timeout: fetch timeout in ms (default 3000)
 */
export default function useNetworkStatus({
  pingUrl = null,
  pingInterval = 5000,
  timeout = 3000,
} = {}) {
  const [isOnline, setIsOnline] = useState(() => {
    // initial value
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });

  const pingTimerRef = useRef(null);
  const abortRef = useRef(null);

  const checkByPing = async () => {
    if (!pingUrl) return setIsOnline(navigator.onLine);
    try {
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      const timer = setTimeout(() => {
        abortRef.current?.abort();
      }, timeout);

      // use no-cache to avoid stale 200 from browser cache
      await fetch(pingUrl, {
        method: "HEAD",
        cache: "no-store",
        signal,
      });
      clearTimeout(timer);
      setIsOnline(true);
    } catch (e) {
      setIsOnline(false);
    } finally {
      abortRef.current = null;
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      // optimistic set; optionally verify via ping
      if (pingUrl) {
        checkByPing();
      } else {
        setIsOnline(true);
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Do an initial ping check if pingUrl provided
    if (pingUrl) checkByPing();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      abortRef.current?.abort();
      if (pingTimerRef.current) clearInterval(pingTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pingUrl]);

  // If offline and pingUrl provided, poll every pingInterval to see if back online
  useEffect(() => {
    if (!pingUrl) return;
    if (!isOnline) {
      // start polling
      pingTimerRef.current = setInterval(checkByPing, pingInterval);
    } else {
      // clear polling if we became online
      if (pingTimerRef.current) {
        clearInterval(pingTimerRef.current);
        pingTimerRef.current = null;
      }
    }
    return () => {
      if (pingTimerRef.current) clearInterval(pingTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, pingUrl, pingInterval]);

  return isOnline;
}
