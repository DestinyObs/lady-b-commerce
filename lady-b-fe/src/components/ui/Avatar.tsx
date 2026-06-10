import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizes: Record<AvatarSize, { wrapper: string; text: string; icon: string }> = {
  xs: { wrapper: 'h-6 w-6', text: 'text-2xs', icon: 'h-3 w-3' },
  sm: { wrapper: 'h-8 w-8', text: 'text-xs', icon: 'h-4 w-4' },
  md: { wrapper: 'h-10 w-10', text: 'text-sm', icon: 'h-4 w-4' },
  lg: { wrapper: 'h-14 w-14', text: 'text-base', icon: 'h-5 w-5' },
  xl: { wrapper: 'h-20 w-20', text: 'text-xl', icon: 'h-7 w-7' },
};

function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const s = sizes[size];
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'relative flex-shrink-0 overflow-hidden bg-charcoal-100 flex items-center justify-center',
        s.wrapper,
        className,
      )}
      aria-label={alt || name}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : initials ? (
        <span className={cn('font-body font-medium text-charcoal-600 select-none', s.text)}>
          {initials}
        </span>
      ) : (
        <User className={cn('text-charcoal-400', s.icon)} />
      )}
    </div>
  );
}
