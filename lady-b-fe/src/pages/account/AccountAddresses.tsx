import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Pencil, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/axios';
import { AccountShell } from '../../components/account/AccountShell';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'GH', label: 'Ghana' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SG', label: 'Singapore' },
  { value: 'OTHER', label: 'Other' },
];

const addressSchema = z.object({
  label: z.string().min(1, 'Label required (e.g. Home, Work)'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  phone: z.string().optional(),
  address1: z.string().min(3, 'Address required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  postalCode: z.string().min(3, 'Postal code required'),
  country: z.string().min(2, 'Country required'),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface Address extends AddressFormData {
  id: string;
}

function AddressForm({
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
}: {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  isPending: boolean;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 md:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Input label="Label" placeholder='e.g. "Home", "Office"' {...register('label')} error={errors.label?.message} />
        </div>
        <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
        <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
        <div className="sm:col-span-2">
          <Input label="Address Line 1" {...register('address1')} error={errors.address1?.message} />
        </div>
        <div className="sm:col-span-2">
          <Input label="Address Line 2 (optional)" {...register('address2')} />
        </div>
        <Input label="City" {...register('city')} error={errors.city?.message} />
        <Input label="State / Province" {...register('state')} error={errors.state?.message} />
        <Input label="Postal Code" {...register('postalCode')} error={errors.postalCode?.message} />
        <Select label="Country" options={COUNTRIES} {...register('country')} error={errors.country?.message} />
        <div className="sm:col-span-2">
          <Input label="Phone (optional)" type="tel" {...register('phone')} />
        </div>
        <div className="sm:col-span-2">
          <Checkbox label="Set as default address" {...register('isDefault')} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" size="sm" isLoading={isPending}>Save Address</Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default function AccountAddresses() {
  useEffect(() => { document.title = 'Addresses | Lady B Designs'; }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<Address[]>({
    queryKey: ['account-addresses'],
    queryFn: () => api.get('/account/addresses').then((r) => r.data.data),
  });

  const addresses: Address[] = data || [];

  const create = useMutation({
    mutationFn: (d: AddressFormData) => api.post('/account/addresses', d).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['account-addresses'] }); setModalOpen(false); toast.success('Address saved'); },
    onError: () => toast.error('Failed to save address'),
  });

  const update = useMutation({
    mutationFn: (d: AddressFormData) => api.patch(`/account/addresses/${editingAddress!.id}`, d).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['account-addresses'] }); setModalOpen(false); setEditingAddress(null); toast.success('Address updated'); },
    onError: () => toast.error('Failed to update address'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/account/addresses/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['account-addresses'] }); setDeleteTarget(null); toast.success('Address removed'); },
    onError: () => toast.error('Failed to remove address'),
  });

  const setDefault = useMutation({
    mutationFn: (id: string) => api.patch(`/account/addresses/${id}`, { isDefault: true }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['account-addresses'] }); toast.success('Default address updated'); },
  });

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <AccountShell title="Addresses" breadcrumb="Addresses">
      <div className="flex justify-end mb-6">
        <Button
          variant="primary"
          size="sm"
          onClick={() => { setEditingAddress(null); setModalOpen(true); }}
        >
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 bg-charcoal-50">
          <MapPin className="h-8 w-8 text-charcoal-200 mx-auto mb-4" />
          <p className="font-serif font-light text-xl text-charcoal-700 mb-2">No saved addresses</p>
          <p className="text-sm text-charcoal-400 font-body mb-5">Save addresses for faster checkout.</p>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`border p-5 relative ${addr.isDefault ? 'border-charcoal-900' : 'border-charcoal-200'}`}
              >
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-2xs tracking-wider uppercase font-body text-gold-champagne">
                    <Star className="h-3 w-3 fill-current" /> Default
                  </span>
                )}
                <p className="text-xs tracking-wide uppercase font-body text-charcoal-400 mb-2">{addr.label}</p>
                <div className="text-sm font-body text-charcoal-700 space-y-0.5 mb-4">
                  <p className="font-medium text-charcoal-900">{addr.firstName} {addr.lastName}</p>
                  <p>{addr.address1}</p>
                  {addr.address2 && <p>{addr.address2}</p>}
                  <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p>{addr.country}</p>
                  {addr.phone && <p className="text-charcoal-400">{addr.phone}</p>}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="flex items-center gap-1.5 text-xs font-body text-charcoal-500 hover:text-charcoal-900 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefault.mutate(addr.id)}
                      className="text-xs font-body text-charcoal-500 hover:text-charcoal-900 transition-colors"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(addr)}
                    className="text-xs font-body text-red-400 hover:text-red-600 transition-colors ml-auto"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal isOpen={modalOpen} onClose={handleClose} title={editingAddress ? 'Edit Address' : 'New Address'} size="md">
        <AddressForm
          defaultValues={editingAddress || undefined}
          onSubmit={(d) => editingAddress ? update.mutate(d) : create.mutate(d)}
          isPending={create.isPending || update.isPending}
          onCancel={handleClose}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
        title="Remove address?"
        description={`Remove "${deleteTarget?.label}"? This cannot be undone.`}
        confirmLabel="Remove"
        isLoading={remove.isPending}
      />
    </AccountShell>
  );
}
