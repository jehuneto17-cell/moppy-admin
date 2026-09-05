"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex h-[38px] items-center gap-2 rounded-md border px-3.5 text-sm font-medium text-ink transition-colors ${open ? "border-brand" : "border-border"}`}
      >
        <span className="font-normal text-faint">{label}:</span>
        <span>{value}</span>
        <ChevronDown size={16} strokeWidth={2} className="text-faint" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute top-[42px] left-0 z-20 min-w-[190px] overflow-hidden rounded-md border border-border-strong bg-white p-1 shadow-lg"
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`block w-full rounded px-3 py-2.5 text-left text-sm ${value === opt ? "bg-brand-tint font-medium" : "font-normal"} text-ink`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
