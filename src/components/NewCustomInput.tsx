// import * as React from "react";
// import { cn } from "@/lib/utils";

// interface InputProps extends React.ComponentProps<"input"> {
//   icon?: React.ReactNode;
// }

// const NewCustomInput = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type = "text", icon, onKeyDown, ...props }, ref) => {
//     return (
//       <div  className={`${className ? className : "w-full flex items-center bg-transparent rounded-full gap-3 border border-input  px-3 py-1 shadow-sm "}`} >
//         {icon && <div className="text-xl text-muted-foreground">{icon}</div>}
//      <input
//   onKeyDown={onKeyDown}
//   type={type}
//   className={cn(
//     "flex h-9 w-full bg-white focus:bg-transparent text-base px-1 py-1 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground text-foreground rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-transparent",
//     className
//   )}
//   ref={ref}
//   {...props}
// />
//       </div>
//     );
//   }
// );

// NewCustomInput.displayName = "Input";

// export { NewCustomInput };


import * as React from "react";
import { cn } from "@/lib/utils";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const NewCustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, showPasswordToggle = false, onKeyDown, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPasswordField = type === "password" && showPasswordToggle;

    return (
      <div className={`${className ? className : "w-full flex items-center bg-transparent rounded-full gap-3 border border-input  px-3 py-1 shadow-sm "}`}>
        {icon && <div className="text-xl text-muted-foreground">{icon}</div>}

        <input
          onKeyDown={onKeyDown}
          type={isPasswordField && showPassword ? "text" : type}
          className={cn(
            "flex h-9 w-full bg-white focus:bg-transparent text-base px-1 py-1 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground text-foreground rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-transparent",
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
    );
  }
);

NewCustomInput.displayName = "NewCustomInput";

export { NewCustomInput };
