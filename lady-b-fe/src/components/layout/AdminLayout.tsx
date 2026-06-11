import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Palette, Users, Tag,
  Star, Mail, MessageSquare, Building2, Newspaper, Archive,
  Settings, ClipboardList, ChevronLeft, Menu, LogOut, X,
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

function Sidebar({
  collapsed,
  onCollapse,
  onClose,
  isMobile,
}: {
  collapsed: boolean;
  onCollapse: () => void;
  onClose: () => void;
  isMobile: boolean;
}) {
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={cn(
        'bg-charcoal-900 flex flex-col transition-all duration-300 flex-shrink-0',
        collapsed && !isMobile ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo + toggle */}
      <div className="flex items-center justify-between h-14 md:h-16 px-4 border-b border-ivory/10">
        {(!collapsed || isMobile) && (
          <Link to="/admin/dashboard" onClick={isMobile ? onClose : undefined}>
            <span className="font-serif text-ivory font-light tracking-luxury text-sm uppercase">Lady B</span>
          </Link>
        )}
        <button
          onClick={isMobile ? onClose : onCollapse}
          className="text-ivory/40 hover:text-ivory transition-colors p-1 ml-auto"
          aria-label={isMobile ? 'Close menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isMobile ? <X className="h-4 w-4" /> : collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 text-xs tracking-wide font-body transition-colors duration-200',
                isActive
                  ? 'bg-ivory/10 text-ivory'
                  : 'text-ivory/50 hover:text-ivory hover:bg-ivory/5',
                collapsed && !isMobile && 'justify-center px-2',
              )
            }
            title={collapsed && !isMobile ? label : undefined}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + sign out */}
      <div className={cn('p-4 border-t border-ivory/10', collapsed && !isMobile && 'px-2')}>
        {(!collapsed || isMobile) && user && (
          <div className="mb-3">
            <p className="text-ivory text-xs font-body truncate">{user.firstName} {user.lastName}</p>
            <p className="text-ivory/40 text-2xs font-body truncate">{user.role}</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            onClick={isMobile ? onClose : undefined}
            className={cn('text-ivory/40 hover:text-ivory transition-colors p-1', collapsed && !isMobile && 'mx-auto')}
            title="Back to store"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          {(!collapsed || isMobile) && (
            <button
              onClick={logout}
              className="flex items-center gap-2 text-ivory/40 hover:text-ivory transition-colors text-xs font-body"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-charcoal-50">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-charcoal-900/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar (overlay) */}
      {mobileOpen && (
        <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
          <Sidebar
            collapsed={false}
            onCollapse={() => {}}
            onClose={() => setMobileOpen(false)}
            isMobile
          />
        </div>
      )}

      {/* Desktop sidebar (in-flow) */}
      <div className="hidden lg:flex">
        <Sidebar
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          onClose={() => {}}
          isMobile={false}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-charcoal-900 text-ivory flex items-center h-14 px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-ivory/60 hover:text-ivory transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/admin/dashboard" className="font-serif text-ivory font-light tracking-luxury text-sm uppercase">
            Lady B Admin
          </Link>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
