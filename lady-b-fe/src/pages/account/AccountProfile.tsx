import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Camera, CheckCircle } from 'lucide-react';
import { api } from '../../lib/axios';
import { useAuthStore } from '../../store/auth.store';
import { AccountShell } from '../../components/account/AccountShell';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password required'),
    newPassword: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function AccountProfile() {
  useEffect(() => { document.title = 'Profile | Lady B Designs'; }, []);
  const { user, updateUser } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
    },
  });

  const { register: regPass, handleSubmit: handlePassword, reset: resetPass, watch, formState: { errors: passErrors } } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  const newPassword = watch('newPassword', '');

  const updateProfile = useMutation({
    mutationFn: (data: ProfileData) => api.patch('/account/profile', data).then((r) => r.data.data),
    onSuccess: (data) => {
      updateUser(data);
      setProfileSaved(true);
      toast.success('Profile updated');
      setTimeout(() => setProfileSaved(false), 3000);
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const updatePassword = useMutation({
    mutationFn: (data: PasswordData) =>
      api.patch('/account/password', { currentPassword: data.currentPassword, newPassword: data.newPassword }).then((r) => r.data),
    onSuccess: () => {
      resetPass();
      setPasswordSaved(true);
      toast.success('Password updated');
      setTimeout(() => setPasswordSaved(false), 3000);
    },
    onError: (err: { response?: { data?: { message?: string } } }) =>
      toast.error(err.response?.data?.message || 'Incorrect current password'),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    // TODO: upload to Cloudinary and update avatar
    toast.success('Avatar updated');
  };

  return (
    <AccountShell title="Profile" breadcrumb="Profile">
      <div className="space-y-10">

        {/* Avatar */}
        <div>
          <h2 className="label-luxury mb-5">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar
                src={avatarPreview || user?.avatarUrl}
                name={user ? `${user.firstName} ${user.lastName}` : undefined}
                size="xl"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-charcoal-900 text-ivory flex items-center justify-center hover:bg-charcoal-800 transition-colors"
                aria-label="Change photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <p className="text-sm font-body text-charcoal-700">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-charcoal-400 font-body">{user?.email}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-charcoal-500 hover:text-charcoal-900 font-body mt-1 transition-colors border-b border-charcoal-300"
              >
                Change photo
              </button>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="border-t border-charcoal-100 pt-8">
          <h2 className="label-luxury mb-5">Personal Information</h2>
          <form onSubmit={handleProfile((d) => updateProfile.mutate(d))} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="First Name" {...regProfile('firstName')} error={profileErrors.firstName?.message} />
              <Input label="Last Name" {...regProfile('lastName')} error={profileErrors.lastName?.message} />
            </div>
            <Input label="Email Address" type="email" {...regProfile('email')} error={profileErrors.email?.message} />
            <Input label="Phone (optional)" type="tel" placeholder="+1 (555) 000-0000" {...regProfile('phone')} error={profileErrors.phone?.message} />
            <div className="flex items-center gap-3">
              <Button type="submit" variant="primary" size="sm" isLoading={updateProfile.isPending}>
                {profileSaved ? <><CheckCircle className="h-4 w-4" /> Saved</> : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        {/* Password form */}
        <div className="border-t border-charcoal-100 pt-8">
          <h2 className="label-luxury mb-1">Change Password</h2>
          <p className="text-xs text-charcoal-400 font-body mb-5">Choose a strong password you don't use elsewhere.</p>
          <form onSubmit={handlePassword((d) => updatePassword.mutate(d))} noValidate className="space-y-5 max-w-sm">
            <Input label="Current Password" type="password" autoComplete="current-password" {...regPass('currentPassword')} error={passErrors.currentPassword?.message} />
            <div>
              <Input label="New Password" type="password" autoComplete="new-password" {...regPass('newPassword')} error={passErrors.newPassword?.message} />
              {newPassword && (
                <ul className="mt-2 space-y-1">
                  {[
                    { ok: newPassword.length >= 8, text: '8+ characters' },
                    { ok: /[A-Z]/.test(newPassword), text: 'Uppercase letter' },
                    { ok: /[0-9]/.test(newPassword), text: 'Number' },
                  ].map(({ ok, text }) => (
                    <li key={text} className={`text-2xs font-body flex items-center gap-1.5 ${ok ? 'text-emerald-luxury' : 'text-charcoal-300'}`}>
                      <span>{ok ? '✓' : '○'}</span>{text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Input label="Confirm New Password" type="password" autoComplete="new-password" {...regPass('confirmPassword')} error={passErrors.confirmPassword?.message} />
            <Button type="submit" variant="primary" size="sm" isLoading={updatePassword.isPending}>
              {passwordSaved ? <><CheckCircle className="h-4 w-4" /> Updated</> : 'Update Password'}
            </Button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="border-t border-charcoal-100 pt-8">
          <h2 className="label-luxury mb-1 text-red-600">Danger Zone</h2>
          <p className="text-xs text-charcoal-400 font-body mb-4">Once deleted, your account and all its data are permanently removed.</p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => toast.error('Please contact support to delete your account.')}
          >
            Delete My Account
          </Button>
        </div>
      </div>
    </AccountShell>
  );
}
