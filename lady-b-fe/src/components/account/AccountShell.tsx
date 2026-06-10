import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, User, MapPin, Palette,
  Settings, CreditCard, LogOut, ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth.store';
import { Avatar } from '../ui/Avatar';

const NAV = [
  { label: 'Overview', href: '/account', icon: LayoutDashboard, end: true },
  { label: 'Orders', href: '/account/orders', icon: Package },
  { label: 'Profile', href: '/account/profile', icon: User },
  { label: 'Addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Custom Orders', href: '/account/custom-orders', icon: Palette },
  { label: 'Billing', href: '/account/billing', icon: CreditCard },
  { label: 'Settings', href: '/account/settings', icon: Settings },
];

interface AccountShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: string;
}

export function AccountShell({ children, title, breadcrumb }: AccountShellProps) {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-ivory pt-36 md:pt-44 pb-24">
      <div className="container-luxury">

        {/* Page heading */}
        {title && (
          <div className="mb-8 md:mb-12">
            <p className="text-xs text-charcoal-400 font-body tracking-wide uppercase mb-1">
              <Link to="/account" className="hover:text-charcoal-700 transition-colors">My Account</Link>
              {breadcrumb && (
                <>
                  <span className="mx-2 text-charcoal-200">/</span>
                  <span className="text-charcoal-600">{breadcrumb}</span>
                </>
              )}
            </p>
            <h1 className="font-serif font-light text-4xl md:text-5xl text-charcoal-900">{title}</h1>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* User card */}
            {user && (
              <div className="flex items-center gap-3 p-4 bg-charcoal-50 mb-6">
                <Avatar name={`${user.firstName} ${user.lastName}`} src={user.avatarUrl} size="md" />
                <div className="min-w-0">
                  <p className="font-body font-medium text-charcoal-900 text-sm truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-charcoal-400 font-body truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav aria-label="Account navigation">
              <ul className="space-y-0.5">
                {NAV.map(({ label, href, icon: Icon, end }) => (
                  <li key={href}>
                    <NavLink
                      to={href}
                      end={end}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between px-4 py-3 text-sm font-body transition-colors duration-150',
                          isActive
                            ? 'bg-charcoal-900 text-ivory'
                            : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-50',
                        )
                      }
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {label}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-charcoal-100 pt-4">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-body text-charcoal-400 hover:text-charcoal-900 transition-colors w-full"
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
