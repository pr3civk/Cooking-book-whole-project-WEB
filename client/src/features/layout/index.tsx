import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router";

export function AnimatedLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }