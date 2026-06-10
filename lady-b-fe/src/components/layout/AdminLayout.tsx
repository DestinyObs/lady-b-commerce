import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Palette, Users, Tag,
  Star, Mail, MessageSquare, Building2, Newspaper, Archive,
  Settings, ClipboardList, ChevronLeft, Menu, LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/auth.store';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Custom Orders', href: '/admin/custom-orders', icon: Palette },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Collections', href: '/admin/collections', icon: Archive },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { label: 'Contact', href: '/admin/contact-messages', icon: MessageSquare },
  { label: 'Wholesale', href: '/admin/wholesale', icon: Building2 },
  { label: 'Press', href: '/admin/press', icon: Newspaper },
  { label: 'Inventory', href: '/admin/inventory', icon: Archive },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex bg-charcoal-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex-shrink-0 bg-charcoal-900 flex flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-ivory/10">
          {!collapsed && (
            <Link to="/admin/dashboard">
              <span className="font-serif text-ivory font-light tracking-luxury text-sm uppercase">Lady B</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-ivory/40 hover:text-ivory transition-colors p-1"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-2.5 text-xs tracking-wide font-body transition-colors duration-200',
                  isActive
                    ? 'bg-ivory/10 text-ivory'
                    : 'text-ivory/50 hover:text-ivory hover:bg-ivory/5',
                  collapsed && 'justify-center px-2',
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className={cn('p-4 border-t border-ivory/10', collapsed && 'px-2')}>
          {!collapsed && user && (
            <div className="mb-3">
              <p className="text-ivory text-xs font-body truncate">{user.firstName} {user.lastName}</p>
              <p className="text-ivory/40 text-2xs font-body truncate">{user.role}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Link to="/" className={cn('text-ivory/40 hover:text-ivory transition-colors p-1', collapsed && 'mx-auto')}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
            {!collapsed && (
              <button onClick={logout} className="flex items-center gap-2 text-ivory/40 hover:text-ivory transition-colors text-xs font-body">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
