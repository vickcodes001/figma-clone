"use client";

import Loader from "@/components/Loader";
import { RoomProvider } from "@/liveblocks.config";
import { LiveMap } from "@liveblocks/client";
import { ReactNode, useState, useEffect } from "react";

export function Room({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <RoomProvider 
        id="my-room"
        initialPresence={{
          cursor: null, 
          cursorColor: null, 
          editingText: null
        }}
        initialStorage={{
          canvasObjects: new LiveMap()
        }}
      >
        {children}
      </RoomProvider>
    </div>
  );
}