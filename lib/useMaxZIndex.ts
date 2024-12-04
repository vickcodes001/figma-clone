import { useMemo } from "react";

// Mock implementation of useThreads
const useThreads = () => {
  // Replace this with your actual thread data
  const threads = [
    { metadata: { zIndex: 1 } },
    { metadata: { zIndex: 3 } },
    { metadata: { zIndex: 2 } },
  ];
  return { threads };
};

// Returns the highest z-index of all threads
export const useMaxZIndex = () => {
  // get all threads
  const { threads } = useThreads();

  // calculate the max z-index
  return useMemo(() => {
    let max = 0;
    for (const thread of threads) {
      // @ts-ignore
      if (thread.metadata.zIndex > max) {
        // @ts-ignore
        max = thread.metadata.zIndex;
      }
    }
    return max;
  }, [threads]);
};
