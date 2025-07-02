import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const variantStyle = {
  success:
    "bg-green-50 text-green-950 ring-1 ring-inset ring-green-200 dark:bg-green-900/30 dark:text-green-50 dark:ring-green-700",
  error:
    "bg-rose-50 text-rose-950 ring-1 ring-inset ring-rose-200 dark:bg-rose-900/30 dark:text-rose-50 dark:ring-rose-700",
  warning:
    "bg-amber-50 text-amber-950 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/30 dark:text-amber-50 dark:ring-amber-700",
  info: "bg-blue-50 text-blue-950 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-50 dark:ring-blue-700",
};

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: AlertTriangle,
};

/**
 * @param {{
 *   variant: 'success'|'error'|'warning'|'info',
 *   message: string,
 *   open: boolean,
 *   onClose?: () => void,
 *   duration?: number
 * }} props
 */
export default function Alert({
  variant = "success",
  message,
  open,
  onClose,
  duration = 5000,
}) {
  // Auto‑dismiss after `duration` ms whenever the alert appears
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  const Icon = icons[variant] ?? CheckCircle2;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -24, opacity: 0, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className={cn(
            "fixed right-4 top-4 z-50 flex justify-center pointer-events-auto w-fit items-center gap-3 rounded-xl px-4 py-3 shadow-xl backdrop-blur",
            variantStyle[variant]
          )}
        >
          {/* icon */}
          <Icon className="h-7 w-7 shrink-0" />

          {/* message */}
          <p className="text-lg font-medium leading-snug">{message}</p>

          {/* manual close button */}
          {onClose && (
            <button
              aria-label="Close alert"
              onClick={onClose}
              className="ml-2 rounded-full p-1 hover:bg-black/10 focus:outline-none dark:hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </motion.div>
      )}/**
      * Merge Tailwind class names conditionally.
      * This helper ships with shadcn UI scaffolding.
      */
    </AnimatePresence>
  );
}
