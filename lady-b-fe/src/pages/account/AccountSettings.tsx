import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Bell, Moon, Sun, Monitor } from 'lucide-react';
import { api } from '../../lib/axios';
import { AccountShell } from '../../components/account/AccountShell';
import { Toggle } from '../../components/ui/Checkbox';
import { Button } from '../../components/ui/Button';

type Theme = 'light' | 'dark' | 'system';

interface NotifSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
  wishlistRestocks: boolean;
  commissionUpdates: boolean;
  newsletter: boolean;
}

const NOTIFICATION_OPTIONS: { key: keyof NotifSettings; label: string; description: string }[] = [
  { key: 'orderUpdates', label: 'Order Updates', description: 'Shipping, delivery, and status changes for your orders.' },
  { key: 'commissionUpdates', label: 'Commission Updates', description: 'Progress updates on your bespoke commissions.' },
  { key: 'wishlistRestocks', label: 'Wishlist Restocks', description: 'Notification when wishlisted items are back in stock.' },
  { key: 'newArrivals', label: 'New Arrivals', description: 'Be first to know about new pieces and collections.' },
  { key: 'promotions', label: 'Promotions & Offers', description: 'Exclusive discounts and limited-time offers.' },
  { key: 'newsletter', label: 'Newsletter', description: 'Monthly journal, styling tips, and behind-the-scenes.' },
];

const THEMES: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }
  localStorage.setItem('theme', theme);
}

export default function AccountSettings() {
  useEffect(() => { document.title = 'Settings | Lady B Designs'; }, []);

  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [notifs, setNotifs] = useState<NotifSettings>({
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    wishlistRestocks: true,
    commissionUpdates: true,
    newsletter: false,
  });

  const { data: settingsData } = useQuery({
    queryKey: ['account-settings'],
    queryFn: () => api.get('/account/settings').then((r) => r.data.data),
  });

  useEffect(() => {
    if (settingsData?.notifications) setNotifs(settingsData.notifications);
    if (settingsData?.theme) { setTheme(settingsData.theme); applyTheme(settingsData.theme); }
  }, [settingsData]);

  const saveSettings = useMutation({
    mutationFn: (payload: { notifications: NotifSettings; theme: Theme }) =>
      api.patch('/account/settings', payload).then((r) => r.data),
    onSuccess: () => toast.success('Settings saved'),
    onError: () => toast.error('Failed to save settings'),
  });

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
  };

  const handleToggle = (key: keyof NotifSettings) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    saveSettings.mutate({ notifications: notifs, theme });
  };

  return (
    <AccountShell title="Settings" breadcrumb="Settings">
      <div className="space-y-10">

        {/* Appearance */}
        <div>
          <h2 className="label-luxury mb-1">Appearance</h2>
          <p className="text-xs text-charcoal-400 font-body mb-5">Choose how Lady B Designs looks to you.</p>
          <div className="flex gap-3 flex-wrap">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={`flex items-center gap-2.5 px-5 py-3.5 border text-sm font-body transition-all ${
                  theme === value
                    ? 'border-charcoal-900 bg-charcoal-900 text-ivory'
                    : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-500'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
          <p className="text-2xs text-charcoal-300 font-body mt-3">
            Dark mode support is coming soon. System mode matches your OS preference.
          </p>
        </div>

        {/* Notifications */}
        <div className="border-t border-charcoal-100 pt-8">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-4 w-4 text-charcoal-400" />
            <h2 className="label-luxury">Email Notifications</h2>
          </div>
          <p className="text-xs text-charcoal-400 font-body mb-6">
            Control which emails Lady B Designs sends to your inbox.
          </p>
          <div className="space-y-0 divide-y divide-charcoal-100">
            {NOTIFICATION_OPTIONS.map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between py-4 gap-4">
                <div>
                  <p className="text-sm font-body font-medium text-charcoal-900">{label}</p>
                  <p className="text-xs text-charcoal-400 font-body mt-0.5">{description}</p>
                </div>
                <Toggle
                  checked={notifs[key]}
                  onChange={() => handleToggle(key)}
                  aria-label={`Toggle ${label}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex gap-3 border-t border-charcoal-100 pt-6">
          <Button variant="primary" size="sm" onClick={handleSave} isLoading={saveSettings.isPending}>
            Save Preferences
          </Button>
        </div>
      </div>
    </AccountShell>
  );
}
