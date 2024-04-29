import { ComponentProps } from "react";
import { cn } from "../../app/utils/cn";
import { Spinner } from "./Spinner";

interface ButtonProps extends  ComponentProps<'button'> {
  isPending?: boolean;
}

export function Button({ className, isPending, disabled, children, ...props}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isPending}
      className={cn(
        'bg-teal-900 hover:bg-teal-800 disabled:bg-gray-100 disabled:cursor-not-allowed px-6 h-12 rounded-2xl font-medium text-white disabled:text-gray-400 transition-all flex items-center justify-center',
        className,
      )}
    >
      {!isPending && children}
       {isPending && <Spinner className="w-6 h-6" />}
    </button>
  );
}
