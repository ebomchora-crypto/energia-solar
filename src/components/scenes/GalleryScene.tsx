"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { GALLERY_PROJECTS } from "@/lib/images";

export default function GalleryScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    registerGsap();
    if (reducedMotion || !isDesktop) return;
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;

      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          const getDistance = () => track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${getDistance()}`,
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, isDesktop]);

  return (
    <section
      id="projetos"
      ref={sectionRef}
      className="relative overflow-hidden bg-bg-dark"
    >
      <div className="lg:h-screen">
        <div className="px-6 pt-24 pb-10 md:px-14 lg:px-20 lg:pt-28">
          <p className="label-caps mb-4 text-solar">Projetos</p>
          <h2 className="font-display text-display-md max-w-2xl text-balance text-text-light">
            Instalações que transformam consumo em resultado.
          </h2>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar flex gap-5 overflow-x-auto px-6 pb-16 snap-x snap-mandatory md:gap-7 md:px-14 lg:h-[calc(100%-180px)] lg:snap-none lg:overflow-visible lg:px-20"
        >
          {GALLERY_PROJECTS.map((project) => (
            <article
              key={project.id}
              className="group relative h-[62vh] w-[85vw] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-[60vw] lg:h-full lg:w-[44vw]"
            >
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(min-width: 1024px) 44vw, 85vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/10 to-transparent" />

              <span className="font-display absolute right-6 top-6 text-4xl text-text-light/30">
                {project.id}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="label-caps mb-2 text-solar">{project.location}</p>
                <h3 className="font-display text-2xl text-text-light sm:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-text-light/70">{project.type}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
