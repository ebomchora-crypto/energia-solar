"use client";

import { useMediaQuery } from "./useMediaQuery";

export function useIsDesktop(breakpoint = 1024) {
  return useMediaQuery(`(min-width: ${breakpoint}px)`);
}
