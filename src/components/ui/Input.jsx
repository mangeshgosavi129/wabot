import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({ label, error, className, id, ...props }, ref) => {
    return (
        <div className="space-y-1">
            {label && <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>}
            <input
                id={id}
                ref={ref}
                className={twMerge(clsx(
                    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-50 transition-shadow",
                    error && "border-red-500 focus:ring-red-500",
                    className
                ))}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';
