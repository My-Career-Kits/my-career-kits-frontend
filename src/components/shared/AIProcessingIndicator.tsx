"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AIProcessingIndicatorProps {
  stages: string[];
  isVisible: boolean;
}

export default function AIProcessingIndicator({
  stages,
  isVisible,
}: AIProcessingIndicatorProps) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStage(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isVisible, stages.length]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-black/40 rounded-xl">
      <div className="flex flex-col items-center gap-6 p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-accent" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-lg text-text-primary font-medium"
          >
            {stages[currentStage]}
          </motion.p>
        </AnimatePresence>

        <div className="w-64 h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStage + 1) / stages.length) * 90}%` }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>

        <div className="flex gap-2">
          {stages.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i <= currentStage ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
