/**
 * LAYER 5: PRESENTATION - MOTION DESIGN SYSTEM
 * Consistent Framer Motion variants, easing curves, and reduced-motion compliance.
 */

import { useReducedMotion, Variants } from 'framer-motion';

export const springTransition = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 30,
};

export const smoothTransition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const fadeInUpVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const fadeInScaleVariant: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const floatingSurfaceVariant: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

/**
 * Hook to check if user requested reduced motion
 */
export function useMotionSafe() {
  const shouldReduceMotion = useReducedMotion();
  return {
    shouldReduceMotion,
    containerVariants: shouldReduceMotion ? undefined : staggerContainer,
    itemVariants: shouldReduceMotion ? undefined : fadeInUpVariant,
    floatingVariants: shouldReduceMotion ? undefined : floatingSurfaceVariant,
  };
}

