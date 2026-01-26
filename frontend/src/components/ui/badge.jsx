import * as React from "react"
import { cn } from "../../lib/utils"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-white/30 bg-[#0d559e]/90 text-white backdrop-blur-sm hover:bg-[#0d559e] shadow-md": variant === "default",
          "border-white/30 glass-light text-gray-700 hover:bg-white/90": variant === "secondary",
          "border-white/30 bg-red-600/90 text-white backdrop-blur-sm hover:bg-red-700 shadow-md": variant === "destructive",
          "border-white/30 glass-light text-foreground": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
