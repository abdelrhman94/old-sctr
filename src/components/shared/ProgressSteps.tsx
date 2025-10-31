// components/shared/ProgressSteps.tsx
"use client";

import { cn } from "@/libs/utils";
import { motion } from "framer-motion";

type Props = {
  /** 1-based current step as you're using now (1..total). */
  current: number;
  /** Total number of steps (>=1). */
  total: number;
  /** Called when a step is clicked. Provide to enable jumping. */
  onStepClick?: (stepIndex1Based: number) => void;
  /** Disable clicking future steps (default: false = allow jumping anywhere). */
  lockFuture?: boolean;
};

export default function ProgressSteps({
  current,
  total,
  onStepClick,
  lockFuture = false
}: Props) {
  const currentZero = Math.max(0, Math.min(total - 1, current - 1)); // normalize

  return (
    <div className=" flex items-center w-full select-none" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, index) => {
        const label = index + 1;               // shown to user
        const isDone = index < currentZero;    // fully complete
        const isActive = index === currentZero;

        const isClickable = !!onStepClick && (!lockFuture || index <= currentZero);

        return (
          <div key={index} className="flex items-center w-full last:w-auto">
            {/* Step circle */}
            <motion.button
              type="button"
              whileHover={{ scale: isClickable ? 1.05 : 1 }}
              whileTap={{ scale: isClickable ? 0.97 : 1 }}
              onClick={isClickable ? () => onStepClick(label) : undefined}
              onKeyDown={(e) => {
                if (!isClickable) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onStepClick(label);
                }
              }}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Go to step ${label}`}
              disabled={!isClickable}
              className={cn(
                "relative grid place-items-center size-8 rounded-full border text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer",
                isDone || isActive
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-slate-500 border-slate-300",
                !isClickable && "cursor-default"
              )}
            >
              {/* Active glow */}
              {isActive && (
                <motion.span
                  layoutId="activeStepGlow"
                  className="absolute -inset-1 rounded-full bg-green-600/15 "
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Number */}
              <motion.span
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="relative z-10"
              >
                {label}
              </motion.span>
            </motion.button>

            {/* Connector */}
            {index < total - 1 && (
              <div className="mx-3 h-[2px] flex-1 bg-slate-300 overflow-hidden rounded">
                <motion.div
                  // fill the connector when the left step is done or active
                  animate={{ width: isDone || isActive ? "100%" : "0%" }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="h-full bg-green-600"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
