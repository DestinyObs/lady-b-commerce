import React from 'react';
import { cn } from '../../lib/utils';

// ─── Checkbox ─────────────────────────────────────────────────────────────────

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  error?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, description, className, id, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn(
              'peer h-4 w-4 appearance-none border border-charcoal-300 bg-white',
              'checked:bg-charcoal-900 checked:border-charcoal-900',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-900 focus-visible:ring-offset-1',
              'transition-colors duration-150 cursor-pointer',
              error && 'border-red-500',
              className,
            )}
            aria-invalid={!!error}
            {...props}
          />
          <svg
            className="pointer-events-none absolute inset-0 hidden peer-checked:block text-ivory"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="M3.5 8L6.5 11L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {(label || description) && (
          <div className="min-w-0">
            {label && (
              <label htmlFor={inputId} className="text-sm text-charcoal-900 font-body cursor-pointer select-none leading-snug">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-charcoal-400 font-body mt-0.5">{description}</p>
            )}
            {error && (
              <p className="text-xs text-red-600 font-body mt-1">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';

// ─── Radio ────────────────────────────────────────────────────────────────────

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, error, className, id, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            className={cn(
              'peer h-4 w-4 appearance-none rounded-full border border-charcoal-300 bg-white',
              'checked:border-charcoal-900',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-900 focus-visible:ring-offset-1',
              'transition-colors duration-150 cursor-pointer',
              error && 'border-red-500',
              className,
            )}
            aria-invalid={!!error}
            {...props}
          />
          <div className="pointer-events-none absolute inset-0 hidden peer-checked:flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-charcoal-900" />
          </div>
        </div>
        {(label || description) && (
          <div className="min-w-0">
            {label && (
              <label htmlFor={inputId} className="text-sm text-charcoal-900 font-body cursor-pointer select-none leading-snug">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-charcoal-400 font-body mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  },
);
Radio.displayName = 'Radio';

// ─── Toggle / Switch ──────────────────────────────────────────────────────────

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            className={cn('sr-only peer', className)}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              'block h-5 w-9 cursor-pointer rounded-full bg-charcoal-200 transition-colors duration-200',
              'peer-checked:bg-charcoal-900',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-charcoal-900 peer-focus-visible:ring-offset-1',
              'after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:duration-200',
              'peer-checked:after:translate-x-4',
            )}
          />
        </div>
        {(label || description) && (
          <div className="min-w-0">
            {label && (
              <label htmlFor={inputId} className="text-sm text-charcoal-900 font-body cursor-pointer select-none">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-charcoal-400 font-body">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  },
);
Toggle.displayName = 'Toggle';
