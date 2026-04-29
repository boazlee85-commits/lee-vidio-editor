import * as React from "react"

import { cn } from "@/lib/utils"

const AspectRatio = React.forwardRef(({ className, ratio = 16 / 9, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("overflow-hidden bg-gray-100", className)}
    style={{
      paddingBottom: `calc(100% / (${ratio}))`,
    }}
  >
    <div className="h-full">{props.children}</div>
  </div>
))
AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
