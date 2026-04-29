import * as React from "react"
import * as FormPrimitive from "react-hook-form"
import * as SlotPrimitive from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormPrimitive

const FormFieldContext = React.createContext()

const FormField = ({
  ...props
}) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <FormPrimitive.Controller {...props} />
  </FormFieldContext.Provider>
)

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = FormPrimitive.useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  return {
    name: fieldContext.name,
    ...fieldState,
  }
}

const FormItemContext = React.createContext()

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <FormItemContext.Provider value={{}}>
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  </FormItemContext.Provider>
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, invalid } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(invalid && "text-red-500", className)}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, invalid } = useFormField()

  return (
    <SlotPrimitive.Slot
      ref={ref}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
))
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-red-500", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
