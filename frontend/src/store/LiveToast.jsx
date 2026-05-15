import { useEffect } from 'react'

import { AlertTriangle } from 'lucide-react'

import { useToastStore } from '../store/toastStore'

export default function LiveToast() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  useEffect(() => {
    if (!toasts.length) return

    const timers = toasts.map((toast) =>
      setTimeout(() => {
        removeToast(toast.id)
      }, 5000)
    )

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [toasts, removeToast])

  return (
    <div
      className="
        fixed
        top-6
        right-6
        z-[99999]
        space-y-4
      "
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="
            w-[340px]
            rounded-2xl
            border
            border-red-500/30
            bg-[#131d35]
            shadow-2xl
            shadow-red-500/10
            p-5
            animate-pulse
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                p-3
                rounded-xl
                bg-red-500/10
                text-red-400
              "
            >
              <AlertTriangle size={24} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">
                  {toast.title}
                </h3>

                <span
                  className="
                    text-xs
                    px-2
                    py-1
                    rounded-full
                    bg-red-500/10
                    text-red-400
                  "
                >
                  LIVE
                </span>
              </div>

              <p className="text-slate-400 text-sm mt-2">
                {toast.location}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Real-time emergency event
                </span>

                <span className="text-red-400 text-sm font-semibold">
                  {toast.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
