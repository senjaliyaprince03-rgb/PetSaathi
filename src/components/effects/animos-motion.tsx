"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import type { ReactNode, MouseEvent } from "react";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/* 1. TEXT REVEAL (Animos Kinetic Spring Text Stagger)                        */
/* -------------------------------------------------------------------------- */

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 45,
      rotateX: shouldReduceMotion ? 0 : -40,
      scale: shouldReduceMotion ? 1 : 0.88,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        mass: 0.5,
      },
    },
  };

  return (
    <div className="perspective-1000">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        className={cn("inline-flex flex-wrap gap-x-[0.28em] gap-y-[0.1em]", className)}
      >
        {words.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            variants={wordVariants}
            className="inline-block transform-gpu"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. MAGNETIC BUTTON (Animos Cursor Pull Micro-Interaction)                  */
/* -------------------------------------------------------------------------- */

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className = "", strength = 0.45 }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 16, mass: 0.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: shouldReduceMotion ? 0 : springX,
        y: shouldReduceMotion ? 0 : springY,
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={cn("inline-block transform-gpu cursor-pointer", className)}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. ANIMOS CARD (3D Tilt + Interactive Radial Spotlight Glare)             */
/* -------------------------------------------------------------------------- */

interface AnimosCardProps {
  children: ReactNode;
  className?: string;
  glare?: boolean;
}

export function AnimosCard({ children, className = "", glare = true }: AnimosCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 380, damping: 22 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["16deg", "-16deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-16deg", "16deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    if (glare) {
      setGlarePos({
        x: (mouseX / width) * 100,
        y: (mouseY / height) * 100,
        opacity: 0.45,
      });
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: shouldReduceMotion ? 0 : rotateX,
        rotateY: shouldReduceMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("relative overflow-hidden rounded-4xl transition-all duration-300 shadow-lifted hover:shadow-soft", className)}
    >
      <div style={{ transform: "translateZ(35px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>

      {glare && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-4xl"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45), transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. SCROLL STAGGER CONTAINER & ITEM (Instant Smooth Viewport Reveal)        */
/* -------------------------------------------------------------------------- */

interface ScrollStaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function ScrollStaggerContainer({ children, className = "", staggerDelay = 0.12 }: ScrollStaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      animate={shouldReduceMotion ? "visible" : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function ScrollStaggerItem({ children, className = "" }: ScrollStaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 50,
      scale: shouldReduceMotion ? 1 : 0.94,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 22,
        mass: 0.6,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={cn("transform-gpu", className)}>
      {children}
    </motion.div>
  );
}
