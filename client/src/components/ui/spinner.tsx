import { ForkKnifeIcon } from "lucide-react"
import { cn } from "@/utils/tailwind"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <ForkKnifeIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-loader", className)}
      {...props}
    />
  )
}

export { Spinner }
