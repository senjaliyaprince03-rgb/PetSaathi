"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import styles from "./parallax-totem-background.module.css";

type TotemCard = {
  src: string;
  width: number;
  x: number;
  depth: number;
  rotateY: number;
  rotateZ: number;
};

// Uses imagery already present across PetSaathi's customer-facing website.
const LEFT_COLUMN: TotemCard[] = [
  { src: "/images/care-story-home-v1.webp", width: 92, x: 18, depth: -90, rotateY: 30, rotateZ: 1.5 },
  { src: "/images/sitter-woman-cinematic.png", width: 116, x: -16, depth: 170, rotateY: 20, rotateZ: -1 },
  { src: "/images/golden-retriever-3d.png", width: 82, x: 24, depth: -10, rotateY: 38, rotateZ: 2 },
  { src: "/images/care-story-grooming-v1.webp", width: 104, x: -22, depth: 110, rotateY: 26, rotateZ: -1.5 },
];

const RIGHT_COLUMN: TotemCard[] = [
  { src: "/images/care-story-walk-v1.webp", width: 108, x: -18, depth: 150, rotateY: -24, rotateZ: -1 },
  { src: "/images/sitter-man-cinematic.png", width: 84, x: 26, depth: -70, rotateY: -40, rotateZ: 1.5 },
  { src: "/images/dog-boarding-3d.png", width: 118, x: -20, depth: 210, rotateY: -18, rotateZ: -1.5 },
  { src: "/images/service-pet-sitting.jpg", width: 90, x: 22, depth: 20, rotateY: -34, rotateZ: 1 },
];

function TotemColumn({ cards, side, delay }: { cards: TotemCard[]; side: "left" | "right"; delay: number }) {
  return (
    <div className={`${styles.column} ${styles[side]}`}>
      <div className={styles.track} style={{ "--totem-delay": `${delay}s` } as CSSProperties}>
        {[0, 1].map((groupIndex) => (
          <div className={styles.group} key={groupIndex}>
            {cards.map((card) => (
              <div className={styles.slot} key={`${groupIndex}-${card.src}`}>
                <div
                  className={styles.card}
                  style={
                    {
                      "--card-width": `${card.width}%`,
                      "--card-x": `${card.x}%`,
                      "--card-depth": `${card.depth}px`,
                      "--card-rotate-y": `${card.rotateY}deg`,
                      "--card-rotate-z": `${card.rotateZ}deg`,
                    } as CSSProperties
                  }
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    className={styles.image}
                    fill
                    priority
                    sizes="(max-width: 768px) 52vw, 28vw"
                    src={card.src}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ParallaxTotemBackground() {
  return (
    <div aria-hidden="true" className={styles.root} data-testid="parallax-totem-background">
      <div className={styles.ambientGlow} />
      <div className={styles.stage}>
        <TotemColumn cards={LEFT_COLUMN} delay={-2.5} side="left" />
        <TotemColumn cards={RIGHT_COLUMN} delay={-7.5} side="right" />
      </div>
      <div className={styles.readabilityVeil} />
      <div className={styles.vignette} />
    </div>
  );
}
