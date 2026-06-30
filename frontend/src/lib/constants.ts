export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } },
}
