import * as React from "react"

import { cn } from "@/libs/utils"
import { INPUT_BASE_CLASSES } from "./input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        INPUT_BASE_CLASSES,
        "min-h-16 p-3",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
