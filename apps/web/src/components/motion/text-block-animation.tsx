"use client";

import * as React from "react";
import { motion, useInView, Variants } from "framer-motion";

interface TextBlockAnimationProps {
  text: string;
  className?: string;
  wordClassName?: string;
  variant?: "mask" | "block-wipe" | "fade-blur";
  staggerDelay?: number;
  delay?: number;
  accentColor?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

export function TextBlockAnimation({
  text,
  className = "",
  wordClassName = "",
  variant = "mask",
  staggerDelay = 0.04,
  delay = 0.1,
  accentColor = "#FF6B35",
  as = "div",
}: TextBlockAnimationProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  const words = text.split(" ");

  // Mask reveal variants (slides up from behind overflow-hidden mask)
  const maskContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const maskWordVariants: Variants = {
    hidden: {
      y: "115%",
      opacity: 0,
      rotateX: 18,
    },
    visible: {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom smooth cubic bezier
      },
    },
  };

  // Fade Blur variants
  const blurWordVariants: Variants = {
    hidden: {
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Block wipe variants (block sweeps across the text to reveal it)
  const wipeBlockVariants: Variants = {
    hidden: {
      left: "0%",
      right: "100%",
    },
    visible: {
      left: ["0%", "0%", "100%"],
      right: ["100%", "0%", "0%"],
      transition: {
        duration: 0.9,
        ease: [0.77, 0, 0.175, 1],
      },
    },
  };

  const wipeTextVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.45,
        duration: 0.2,
      },
    },
  };

  const Component = as;

  if (variant === "block-wipe") {
    return (
      <div ref={containerRef} className={`relative inline-block overflow-hidden ${className}`}>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={wipeTextVariants}
          className={wordClassName}
        >
          {text}
        </motion.div>
        <motion.span
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={wipeBlockVariants}
          style={{ backgroundColor: accentColor }}
          className="absolute inset-y-0 z-10 pointer-events-none"
        />
      </div>
    );
  }

  return (
    <Component className={className}>
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={maskContainerVariants}
        className="inline-flex flex-wrap gap-x-[0.28em] gap-y-1"
      >
        {words.map((word, index) => (
          <span key={index} className="inline-block overflow-hidden pb-1">
            <motion.span
              variants={variant === "fade-blur" ? blurWordVariants : maskWordVariants}
              className={`inline-block origin-bottom ${wordClassName}`}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </Component>
  );
}
