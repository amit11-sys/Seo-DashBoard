
import * as React from "react";
import { cn } from "@/lib/utils";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  errorMessage?:string;
   keywords?:string[];
   disabled?:boolean
   defaultValue?:string;
   
}

const NewCustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className,errorMessage,defaultValue, disabled, type = "text", icon, showPasswordToggle = false, onKeyDown,keywords, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPasswordField = type === "password" && showPasswordToggle;

    return (
      <>
      
      <div className={`${className ? className : "w-full flex items-center bg-transparent rounded-full gap-3 border border-input  px-3 py-1 shadow-sm "} ${errorMessage ? "border-red-500" : "border-black"}`}>
        {icon && <div className="text-xl text-muted-foreground">{icon}</div>}

        <input
          onKeyDown={onKeyDown}
          disabled={disabled}
          
  defaultValue={defaultValue} // fallback default
          type={isPasswordField && showPassword ? "text" : type}
          className={cn(
            `flex h-9 w-full bg-white focus:bg-transparent text-base px-1 py-1 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground text-foreground rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-transparent`,
            className
          )}
          ref={ref}
          {...props}
        />
       

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-xl text-muted-foreground focus:outline-none"
          >
            {showPassword ? <HiEyeOff /> : <HiEye />}
          </button>
        )}

      </div>
        {errorMessage && (
        <p className="text-red-500 text-sm ml-3">{errorMessage}</p>
      )}
      </>
      
    );
  }
);

NewCustomInput.displayName = "NewCustomInput";

export { NewCustomInput };





