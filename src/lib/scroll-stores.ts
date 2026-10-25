// Lightweight mutable stores shared between GSAP ScrollTrigger callbacks
// (outside React) and R3F useFrame loops. Avoiding React state here keeps
// the WebGL scenes decoupled from React's render cycle for smooth 60fps
// scrubbing.

export const heroProgress = { value: 0 };
export const panelsProgress = { value: 0 };
