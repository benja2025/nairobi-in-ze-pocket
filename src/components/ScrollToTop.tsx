import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Remonter en haut de la page"
          title="Remonter en haut"
          className="fixed bottom-20 right-4 sm:right-8 z-40 p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-amber-400 border border-amber-500/30 shadow-xl shadow-amber-500/10 backdrop-blur-md transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="relative">
            <ArrowUp className="w-5 h-5 text-amber-400 group-hover:-translate-y-0.5 transition-transform duration-200" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full bg-amber-400 opacity-60 group-hover:w-3 group-hover:opacity-100 transition-all duration-200" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
