import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumbs({ items, showHome = true, className }: BreadcrumbsProps) {
  const all: BreadcrumbItem[] = showHome ? [{ label: 'Home', href: '/' }, ...items] : items;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-xs text-charcoal-400 font-body', className)}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        {all.map((item, i) => {
          const isLast = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i === 0 && showHome && (
                <Home className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              )}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-charcoal-900 transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-charcoal-600' : 'text-charcoal-400'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3 w-3 flex-shrink-0 text-charcoal-300" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
