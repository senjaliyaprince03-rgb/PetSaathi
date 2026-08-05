"use client";

import { motion, useReducedMotion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.996, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -8, filter: "blur(2px)" }}
      transition={{ duration: reduceMotion ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
