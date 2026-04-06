"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error("Route error boundary:", error);
  }, [error]);

  return (
    <main>
      <h1>Something went wrong</h1>
      <p>Try refreshing this page or retrying the action.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
