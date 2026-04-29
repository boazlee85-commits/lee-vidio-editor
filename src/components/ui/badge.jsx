import * as React from "react"

import { cn } from "@/lib/utils"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
      variant === "default" &&
        "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80",
      variant === "secondary" &&
        "border-transparent bg-gray-200 text-gray-900 hover:bg-gray-200/80",
      variant === "destructive" &&
        "border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80",
      variant === "outline" &&
        "text-gray-950",
      className
    )}
    {...props}
  />
))
Badge.displayName = "Badge"

export { Badge }
