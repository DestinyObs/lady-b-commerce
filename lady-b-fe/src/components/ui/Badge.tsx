import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  variant?: 'default' | 'luxury' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', size = 'md', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-charcoal-100 text-charcoal-800',
    luxury: 'bg-gold-champagne/20 text-cocoa border border-gold-champagne/30',
    success: 'bg-green-50 text-green-800 border border-green-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
    outline: 'border border-charcoal-200 text-charcoal-600 bg-transparent',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-2xs tracking-wider',
    md: 'px-3 py-1 text-xs tracking-wider',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-body font-medium uppercase',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
