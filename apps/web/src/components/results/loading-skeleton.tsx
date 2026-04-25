"use client";

import { motion } from "framer-motion";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-xl overflow-hidden"
        >
          {/* Gradient bar skeleton */}
          <div className="h-1 shimmer" />
          <div className="p-5 space-y-3">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white/5 shimmer" />
                <div className="w-24 h-4 rounded bg-white/5 shimmer" />
              </div>
              <div className="w-20 h-5 rounded-full bg-white/5 shimmer" />
            </div>
            {/* Content skeleton */}
            <div className="space-y-2">
              <div className="w-full h-3 rounded bg-white/5 shimmer" />
              <div className="w-5/6 h-3 rounded bg-white/5 shimmer" />
              <div className="w-4/6 h-3 rounded bg-white/5 shimmer" />
              <div className="w-full h-3 rounded bg-white/5 shimmer" />
              <div className="w-3/4 h-3 rounded bg-white/5 shimmer" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
