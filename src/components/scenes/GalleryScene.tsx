"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, registerGsap, DESKTOP_MQ, MOBILE_MQ } from "@/lib/gsap";
import { GALLERY_PROJECTS } from "@/lib/images";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const TOTAL = GALLERY_PROJECTS.length;
const pad = (n: number) => String(n).padStart(2, "0");

export default function GalleryScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const setProgress = (p: number) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0.02, p))})`;
      if (counterRef.current) {
        const idx = Math.min(TOTAL, Math.max(1, Math.round(p * (TOTAL - 1)) + 1));
        counterRef.current.textContent = pad(idx);
      }
    };

    const mm = gsap.matchMedia();

    // Desktop: vertical scroll drives the horizontal track; images drift
    // inside their frames for layered depth.
    mm.add(`${DESKTOP_MQ} and ${MOTION_OK}`, () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const move = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      gsap.utils.toArray<HTMLElement>(".gallery-img").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: move,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });

      return () => setProgress(0);
    });

    // Mobile / tablet: native snap carousel. No scroll hijacking — only the
    // counter and progress bar follow the swipe.
    mm.add(`${MOBILE_MQ}`, () => {
      let raf = 0;
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const max = track.scrollWidth - track.clientWidth;
          setProgress(max > 0 ? track.scrollLeft / max : 0);
        });
      };
      track.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => {
        cancelAnimationFrame(raf);
        track.removeEventListener("scroll", onScroll);
        setProgress(0);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="projetos"
      ref={sectionRef}
      className="relative overflow-hidden bg-bg-dark lg:flex lg:h-svh lg:flex-col"
    >
      <div className="flex flex-col gap-6 px-6 pb-8 pt-24 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-20 lg:pb-8 lg:pt-28">
        <div className="max-w-2xl">
          <p className="label-caps mb-4 text-solar">Projetos</p>
          <h2
            className="font-display text-balance text-text-light"
            style={{
              fontSize: "clamp(2rem, 4.2vw, 3.75rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.025em",
            }}
          >
            Instalações que transformam consumo em resultado.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-light/55">
            Projetos ilustrativos para demonstração do portfólio.
          </p>
        </div>

        <div className="flex items-center gap-4 text-text-light/60" aria-hidden="true">
          <span className="font-display text-2xl tabular-nums text-text-light">
            <span ref={counterRef}>01</span>
            <span className="text-text-light/35"> / {pad(TOTAL)}</span>
          </span>
          <span className="relative block h-px w-24 bg-line-strong sm:w-32">
            <span
              ref={barRef}
              className="absolute inset-0 origin-left bg-solar"
              style={{ transform: "scaleX(0.02)" }}
            />
          </span>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex gap-4 overflow-x-auto overscroll-x-contain px-6 pb-16 [scroll-padding-inline:1.5rem] snap-x snap-mandatory sm:gap-6 sm:px-10 lg:min-h-0 lg:flex-1 lg:snap-none lg:gap-7 lg:overflow-visible lg:px-20 lg:pb-14"
      >
        {GALLERY_PROJECTS.map((project) => (
          <article
            key={project.id}
            className="group relative h-[62svh] max-h-[34rem] min-h-[22rem] w-[82vw] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-[56vw] lg:h-full lg:max-h-none lg:min-h-0 lg:w-[42vw]"
          >
            <div className="absolute inset-y-0 -inset-x-[7%] transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(min-width: 1024px) 48vw, 90vw"
                className="gallery-img object-cover"
                style={{ objectPosition: project.position }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/10 to-transparent" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-7">
              <span className="font-display text-3xl leading-none text-text-light/85 sm:text-4xl">
                {project.id}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <p className="label-caps mb-2 text-solar">{project.location}</p>
              <h3 className="font-display text-2xl leading-tight text-text-light sm:text-3xl">
                {project.title}
              </h3>
              <p className="mt-1.5 text-sm text-text-light/70">{project.type}</p>
            </div>
          </article>
        ))}
        <div className="w-1 shrink-0 lg:w-8" aria-hidden="true" />
      </div>
    </section>
  );
}
