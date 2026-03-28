"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastOptions = Omit<ToastItem, "id">;

type ToastContextValue = {
  toast: (options: ToastOptions) => void;
  close: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const variantStyles: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const variant = options.variant ?? "info";
    setToasts((prev) => [{ id, ...options, variant }, ...prev]);
    return id;
  }, []);

  const close = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toastItem) => toastItem.id !== id));
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toastItem) =>
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toastItem.id));
      }, 4000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts]);

  const value = useMemo(() => ({ toast, close }), [toast, close]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(380px,calc(100%-1rem))] flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-start justify-between gap-4 rounded-lg border p-3 shadow-lg",
              variantStyles[item.variant]
            )}
          >
            <div>
              <p className="font-semibold">{item.title}</p>
              {item.description && <p className="text-sm opacity-90">{item.description}</p>}
            </div>
            <button
              onClick={() => close(item.id)}
              className="rounded px-2 py-1 text-xs font-medium opacity-80 transition hover:opacity-100"
              aria-label="Dismiss toast"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
