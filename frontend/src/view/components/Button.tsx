import { ComponentProps } from "react";
import { cn } from "../../app/utils/cn";
import { Spinner } from "./Spinner";

interface ButtonProps extends  ComponentProps<'button'> {
  isPending?: boolean;
  varient?: 'danger' | 'ghost';
}

export function Button({ className, isPending, disabled, children, varient, ...props}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isPending}
      className={cn(
        'bg-teal-900 hover:bg-teal-800 disabled:bg-gray-100 disabled:cursor-not-allowed px-6 h-12 rounded-2xl font-medium text-white disabled:text-gray-400 transition-all flex items-center justify-center',
        varient === 'danger' && 'bg-red-900 hover:bg-red-800',
        varient === 'ghost' && 'bg-transparent border border-gray-800 text-gray-800 hover:bg-gray-800/5',
        className,
      )}
    >
      {!isPending && children}
       {isPending && <Spinner className="w-6 h-6" />}
    </button>
  );
}
