import * as React from "react"
import * as OTPInput from "input-otp"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <OTPInput.OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const { char, hasFakeCaret, isActive } = OTPInput.useOTPInput()

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-10 w-10 text-center text-sm shadow-sm transition-all border border-gray-200 rounded-md data-[active=true]:border-gray-900 data-[active=true]:ring-1 data-[active=true]:ring-gray-950",
        isActive && "border-gray-900 ring-1 ring-gray-950",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-0.5 bg-gray-900 animation-caret" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    -
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
}
