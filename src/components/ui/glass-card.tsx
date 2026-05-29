import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  delay = 0,
  hover = false,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  hover?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      whileHover={hover ? { y: -4 } : undefined}
      className={cn(
        "rounded-3xl border border-white/40 bg-card/90 p-5 shadow-soft backdrop-blur-md",
        hover && "cursor-pointer transition-shadow hover:shadow-glow",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
