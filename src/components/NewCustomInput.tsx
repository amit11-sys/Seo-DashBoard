import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
}

const NewCustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, onKeyDown, ...props }, ref) => {
    return (
      <div  className={`${className ? className : "w-full flex items-center rounded-full gap-3 border border-input  px-3 py-1 shadow-sm bg-transparent"}`} >
        {icon && <div className="text-xl text-muted-foreground">{icon}</div>}
     <input
  onKeyDown={onKeyDown}
  type={type}
  className={cn(
    "flex h-9 w-full bg-white focus:bg-white text-base px-1 py-1 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground text-foreground rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    className
  )}
  ref={ref}
  {...props}
/>
      </div>
    );
  }
);

NewCustomInput.displayName = "Input";

export { NewCustomInput };
