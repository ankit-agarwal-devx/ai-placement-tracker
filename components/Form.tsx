import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function Form({
  className,
  ...props
}: ComponentProps<"form">) {
  return <form className={cn("space-y-5", className)} {...props} />
}

export function FormField({
  className,
  ...props
}: ComponentProps<"div">) {
  return <div className={cn("grid gap-2", className)} {...props} />
}

export function FormLabel({
  className,
  ...props
}: ComponentProps<"label">) {
  return (
    <label
      className={cn("text-sm font-medium text-primary", className)}
      {...props}
    />
  )
}

export function FormTextarea({
  className,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-lg border border-primary/15 bg-card px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-secondary focus-visible:ring-3 focus-visible:ring-secondary/25",
        className
      )}
      {...props}
    />
  )
}

export function FormMessage({
  className,
  tone = "muted",
  ...props
}: ComponentProps<"p"> & {
  tone?: "muted" | "success" | "error"
}) {
  return (
    <p
      aria-live="polite"
      className={cn(
        "text-sm",
        tone === "muted" && "text-muted-foreground",
        tone === "success" && "text-secondary-foreground",
        tone === "error" && "text-destructive",
        className
      )}
      {...props}
    />
  )
}

export function FormActions({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    />
  )
}

export function FieldError({
  errors,
  id,
}: {
  errors?: string[]
  id?: string
}) {
  if (!errors?.length) {
    return null
  }

  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {errors[0]}
    </p>
  )
}
