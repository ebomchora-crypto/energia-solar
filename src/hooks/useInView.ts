"use client";

import { useEffect, useRef, useState } from "react";

// Lets WebGL canvases stop rendering while their section is far off-screen.
export function useInView<T extends Element>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
