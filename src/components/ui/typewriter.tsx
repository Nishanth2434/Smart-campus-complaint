import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
}

export function Typewriter({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const startTimer = setTimeout(() => {
      setStarted(true);
      setIsTyping(true);
      let i = 0;

      timer = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(timer);
          setIsTyping(false);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (timer) clearInterval(timer);
    };
  }, [text, speed, delay]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {cursor && (
        <span
          className={cn(
            "inline-block w-1.5 h-[0.9em] ml-1 bg-current align-middle",
            isTyping ? "animate-none" : "animate-pulse",
          )}
        />
      )}
      {/* Invisible text to prevent layout shifts */}
      <span
        className="invisible h-0 block overflow-hidden leading-none select-none"
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  );
}
