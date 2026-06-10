import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Save, Globe, Megaphone, Store, Shield, Bell } from 'lucide-react';
import { api } from '../../lib/axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Checkbox, Toggle } from '../../components/ui/Checkbox';

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  supportEmail: string;
  supportPhone: string;
  announcementBarEnabled: boolean;
  announcementBarText: string;
  announcementBarLink: string;
  maintenanceMode: boolean;
  orderEmailsEnabled: boolean;
  reviewEmailsEnabled: boolean;
  newsletterEmailsEnabled: boolean;
  freeShippingThreshold: number;
  taxRate: number;
  currencyCode: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  pinterestUrl: string;
}

const TABS = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'announcement', label: 'Announcement', icon: Megaphone },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'commerce', label: 'Commerce', icon: Globe },
  { id: 'social', label: 'Social', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function AdminSettings() {
  useEffect(() => { document.title = 'Settings | Lady B Admin'; }, []);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const qc = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get('/admin/settings').then((r) => r.data.data),
  });

  useEffect(() => {
    if (settingsData) setSettings(settingsData);
  }, [settingsData]);

  const save = useMutation({
    mutationFn: (payload: Partial<SiteSettings>) => api.patch('/admin/settings', payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-settings'] }); toast.success('Settings saved'); },
    onError: () => toast.error('Failed to save settings'),
  });

  const set = (key: keyof SiteSettings, value: string | boolean | number) => setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif font-light text-2xl text-charcoal-900">Site Settings</h1>
        <Button variant="primary" size="sm" onClick={() => save.mutate(settings)} isLoading={save.isPending}>
          <Save className="h-4 w-4" /> Save All
        </Button>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 flex-wrap mb-8 border-b border-charcoal-100">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-wide uppercase font-body transition-colors border-b-2 -mb-px ${activeTab === id ? 'border-charcoal-900 text-charcoal-900' : 'border-transparent text-charcoal-400 hover:text-charcoal-700'}`}
          >
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {activeTab === 'general' && (
          <>
            <Input label="Site Name" value={settings.siteName || ''} onChange={(e) => set('siteName', e.target.value)} />
            <Input label="Tagline" value={settings.siteTagline || ''} onChange={(e) => set('siteTagline', e.target.value)} />
            <Input label="Support Email" type="email" value={settings.supportEmail || ''} onChange={(e) => set('supportEmail', e.target.value)} />
            <Input label="Support Phone" type="tel" value={settings.supportPhone || ''} onChange={(e) => set('supportPhone', e.target.value)} />
            <div className="flex items-center justify-between py-4 border-t border-charcoal-100">
              <div>
                <p className="text-sm font-body font-medium text-charcoal-900">Maintenance Mode</p>
                <p className="text-xs text-charcoal-400 font-body">Shows a maintenance page to all non-admin visitors.</p>
              </div>
              <Toggle
                checked={settings.maintenanceMode || false}
                onChange={() => set('maintenanceMode', !settings.maintenanceMode)}
                aria-label="Toggle maintenance mode"
              />
            </div>
          </>
        )}

        {activeTab === 'announcement' && (
          <>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-body font-medium text-charcoal-900">Enable Announcement Bar</p>
                <p className="text-xs text-charcoal-400 font-body">Shows a full-width banner at the top of every page.</p>
              </div>
              <Toggle
                checked={settings.announcementBarEnabled || false}
                onChange={() => set('announcementBarEnabled', !settings.announcementBarEnabled)}
                aria-label="Toggle announcement bar"
              />
            </div>
            <Input
              label="Announcement Text"
              value={settings.announcementBarText || ''}
              onChange={(e) => set('announcementBarText', e.target.value)}
              placeholder="Free shipping on orders over $250 · Shop now"
              disabled={!settings.announcementBarEnabled}
            />
            <Input
              label="Announcement Link (optional)"
              value={settings.announcementBarLink || ''}
              onChange={(e) => set('announcementBarLink', e.target.value)}
              placeholder="/shop"
              disabled={!settings.announcementBarEnabled}
            />
          </>
        )}

        {activeTab === 'notifications' && (
          <>
            {[
              { key: 'orderEmailsEnabled' as keyof SiteSettings, label: 'Order Confirmation Emails', desc: 'Send email receipts when customers place orders.' },
              { key: 'reviewEmailsEnabled' as keyof SiteSettings, label: 'Review Request Emails', desc: 'Ask customers to leave a review after delivery.' },
              { key: 'newsletterEmailsEnabled' as keyof SiteSettings, label: 'Newsletter Enabled', desc: 'Allow customers to subscribe via the footer form.' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-4 border-b border-charcoal-100">
                <div>
                  <p className="text-sm font-body font-medium text-charcoal-900">{label}</p>
                  <p className="text-xs text-charcoal-400 font-body">{desc}</p>
                </div>
                <Toggle
                  checked={(settings[key] as boolean) || false}
                  onChange={() => set(key, !settings[key])}
                  aria-label={`Toggle ${label}`}
                />
              </div>
            ))}
          </>
        )}

        {activeTab === 'commerce' && (
          <>
            <Input
              label="Free Shipping Threshold (USD)"
              type="number"
              step="0.01"
              value={settings.freeShippingThreshold || ''}
              onChange={(e) => set('freeShippingThreshold', parseFloat(e.target.value))}
              hint="Orders above this amount qualify for free standard shipping"
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.01"
              value={settings.taxRate || ''}
              onChange={(e) => set('taxRate', parseFloat(e.target.value))}
            />
            <Input
              label="Currency Code"
              value={settings.currencyCode || 'USD'}
              onChange={(e) => set('currencyCode', e.target.value)}
              hint="ISO 4217 code (e.g. USD, GBP, EUR)"
            />
          </>
        )}

        {activeTab === 'social' && (
          <>
            <Input label="Instagram URL" value={settings.instagramUrl || ''} onChange={(e) => set('instagramUrl', e.target.value)} placeholder="https://instagram.com/ladybdesigns" />
            <Input label="TikTok URL" value={settings.tiktokUrl || ''} onChange={(e) => set('tiktokUrl', e.target.value)} />
            <Input label="Facebook URL" value={settings.facebookUrl || ''} onChange={(e) => set('facebookUrl', e.target.value)} />
            <Input label="Pinterest URL" value={settings.pinterestUrl || ''} onChange={(e) => set('pinterestUrl', e.target.value)} />
          </>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 text-sm font-body text-amber-700">
              Security settings like API keys and credentials should be managed through environment variables, not through this UI.
            </div>
            <div className="text-sm text-charcoal-500 font-body space-y-2">
              <p>Platform-level security settings:</p>
              <ul className="list-disc list-inside space-y-1 text-charcoal-600">
                <li>JWT secrets and Stripe keys → <code className="bg-charcoal-50 px-1">.env</code> file</li>
                <li>Database credentials → <code className="bg-charcoal-50 px-1">.env</code> file</li>
                <li>CORS and rate limiting → server configuration</li>
                <li>SSL/HTTPS → infrastructure level</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
