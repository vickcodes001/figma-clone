"use client";

import { ReactNode, useState, useEffect } from "react";

export function Room({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading…</div>;
  }

  return (
    <>
      {children}
    </>
  );
}