"use client";

import { useCallback, useRef } from "react";

type OverlayThreadProps = {
  thread: any; // Replace with your own thread type
  maxZIndex: number;
};

export const CommentsOverlay = () => {
  // Replace with your own logic to get threads
  const threads = []; // Placeholder for threads data
  const maxZIndex = 0; // Placeholder for max z-index logic

  return (
    <div>
      {threads
        .filter((thread) => !thread.resolved) // Adjust based on your thread structure
        .map((thread) => (
          <OverlayThread key={thread.id} thread={thread} maxZIndex={maxZIndex} />
        ))}
    </div>
  );
};

const OverlayThread = ({ thread, maxZIndex }: OverlayThreadProps) => {
  // Replace with your own logic to edit thread metadata
  const editThreadMetadata = (data: any) => {
    // Implement your own logic here
  };

  // Replace with your own logic to get user data
  const isLoading = false; // Placeholder for loading state

  const threadRef = useRef<HTMLDivElement>(null);

  const handleIncreaseZIndex = useCallback(() => {
    if (maxZIndex === thread.zIndex) {
      return;
    }

    // Update the z-index of the thread
    editThreadMetadata({
      threadId: thread.id,
      metadata: {
        zIndex: maxZIndex + 1,
      },
    });
  }, [thread, editThreadMetadata, maxZIndex]);

  if (isLoading) {
    return null;
  }

  return (
    <div
      ref={threadRef}
      id={`thread-${thread.id}`}
      className="absolute left-0 top-0 flex gap-5"
      style={{
        transform: `translate(${thread.x}px, ${thread.y}px)`, // Adjust based on your thread structure
      }}
    >
      {/* render the thread */}
      {/* Replace with your own thread rendering logic */}
      <div>{thread.content}</div>
    </div>
  );
};
