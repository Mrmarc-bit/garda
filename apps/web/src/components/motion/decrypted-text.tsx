"use client";

import * as React from "react";

const CHAR_SET = "0123456789ABCDEF!@#$%&*?/";

interface DecryptedTextProps {
  text: string;
  speed?: number; // ms per frame
  maxIterations?: number;
  className?: string;
  triggerOnHover?: boolean;
}

export function DecryptedText({
  text,
  speed = 40,
  maxIterations = 10,
  className = "",
  triggerOnHover = false,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = React.useState(text);
  const [isHovered, setIsHovered] = React.useState(false);
  const iterationRef = React.useRef(0);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const startAnimation = React.useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    iterationRef.current = 0;

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterationRef.current) {
              return text[index];
            }
            return CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
          })
          .join("");
      });

      iterationRef.current += 1 / (maxIterations / text.length || 1);

      if (iterationRef.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);
  }, [text, speed, maxIterations]);

  React.useEffect(() => {
    startAnimation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAnimation]);

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      setIsHovered(true);
      startAnimation();
    }
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className={`font-mono transition-colors ${className}`}
    >
      {displayText}
    </span>
  );
}
