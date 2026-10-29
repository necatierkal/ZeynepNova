import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const generatedId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={generatedId}
            className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700"
          >
            {label}
          </label>
        )}
        <input
          id={generatedId}
          type={type}
          ref={ref}
          className={cn(
            "w-full h-11 px-3.5 text-sm rounded-lg border bg-white transition-colors placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-sand-100 disabled:cursor-not-allowed",
            error
              ? "border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-rose-900"
              : "border-sand-300 focus:border-gold-600 focus:ring-gold-200/50 text-charcoal-900",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${generatedId}-error` : helperText ? `${generatedId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${generatedId}-error`} className="text-xs text-rose-600 mt-1 font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${generatedId}-helper`} className="text-xs text-charcoal-500 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
