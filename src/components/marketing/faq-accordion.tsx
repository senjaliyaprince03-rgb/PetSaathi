"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export function FaqAccordionItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={cn("group rounded-3xl border border-indigo/10 bg-paper/85 p-5 transition-shadow duration-300", isOpen && "shadow-lifted")}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-display text-xl font-semibold outline-none"
      >
        <span>{question}</span>
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo/[0.07] text-indigo transition-transform duration-300", isOpen && "rotate-45")}>+</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="mt-4 pr-9 text-sm leading-7 text-ink/80">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
