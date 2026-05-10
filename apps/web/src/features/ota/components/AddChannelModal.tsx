import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateOtaChannelDto } from '../types';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOtaChannelDto) => void;
  propertyId: string;
  isPending?: boolean;
}

const CHANNEL_TYPES = [
  { label: 'Channex (Global Channel Manager)', value: 'channex' },
  { label: 'Booking.com', value: 'booking_com' },
  { label: 'Agoda', value: 'agoda' },
  { label: 'Traveloka', value: 'traveloka' },
  { label: 'Expedia', value: 'expedia' },
];

export function AddChannelModal({
  isOpen,
  onClose,
  onSubmit,
  propertyId,
  isPending,
}: AddChannelModalProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<CreateOtaChannelDto>({
    defaultValues: { name: '', type: '', propertyId, isActive: true },
  });
  const [channexApiKey, setChannexApiKey] = useState('');
  const [channexPropertyId, setChannexPropertyId] = useState('');
  const [channexWebhookSecret, setChannexWebhookSecret] = useState('');
  const [channexSandbox, setChannexSandbox] = useState(true);

  const selectedType = watch('type');

  const onFormSubmit = (data: CreateOtaChannelDto) => {
    const credentials: Record<string, unknown> =
      data.type === 'channex'
        ? {
            apiKey: channexApiKey.trim(),
            channexPropertyId: channexPropertyId.trim(),
            webhookSecret: channexWebhookSecret.trim() || undefined,
            sandbox: channexSandbox,
          }
        : {};

    onSubmit({ ...data, propertyId, credentials });
    reset({ name: '', type: '', propertyId, isActive: true });
    setChannexApiKey('');
    setChannexPropertyId('');
    setChannexWebhookSecret('');
    setChannexSandbox(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-50 border-gray-200 text-white sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Kết nối kênh OTA mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Loại kênh</Label>
            <Select
              onValueChange={(value) => {
                setValue('type', value);
                const label = CHANNEL_TYPES.find((t) => t.value === value)?.label;
                if (label) setValue('name', label);
              }}
            >
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="Chọn kênh muốn kết nối" />
              </SelectTrigger>
              <SelectContent className="bg-gray-50 border-gray-200">
                {CHANNEL_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tên hiển thị</Label>
            <Input
              {...register('name')}
              placeholder="Ví dụ: Channex - Khách sạn A"
              className="bg-white border-gray-200"
            />
          </div>

          {/* Channex-specific credential fields */}
          {selectedType === 'channex' && (
            <div className="space-y-3 p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Channex Credentials</p>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">API Key *</Label>
                <Input
                  type="password"
                  placeholder="Lấy từ app.channex.io → Profile → API Keys"
                  value={channexApiKey}
                  onChange={(e) => setChannexApiKey(e.target.value)}
                  className="bg-white border-gray-200 font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Channex Property ID *</Label>
                <Input
                  placeholder="UUID của property trên Channex"
                  value={channexPropertyId}
                  onChange={(e) => setChannexPropertyId(e.target.value)}
                  className="bg-white border-gray-200 font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Webhook Secret (tùy chọn)</Label>
                <Input
                  type="password"
                  placeholder="Dùng để verify webhook signature"
                  value={channexWebhookSecret}
                  onChange={(e) => setChannexWebhookSecret(e.target.value)}
                  className="bg-white border-gray-200 font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sandbox"
                  checked={channexSandbox}
                  onChange={(e) => setChannexSandbox(e.target.checked)}
                  className="accent-blue-500"
                />
                <label htmlFor="sandbox" className="text-xs text-gray-500 cursor-pointer">
                  Dùng Sandbox (<span className="font-mono text-gray-600">app.sandbox.channex.io</span>) — miễn phí
                </label>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                Webhook URL cần đăng ký trên Channex:<br />
                <span className="font-mono text-gray-500 select-all">
                  {typeof window !== 'undefined' ? window.location.origin.replace('3001', '3000') : 'http://localhost:3000'}/api/ota/webhook
                </span>
              </p>
            </div>
          )}

          {selectedType && selectedType !== 'channex' && (
            <div className="p-3 rounded-lg border border-gray-200 bg-gray-100">
              <p className="text-xs text-gray-400">
                Kết nối {CHANNEL_TYPES.find((t) => t.value === selectedType)?.label} thông qua Channex là cách được khuyến nghị. Sau khi kết nối, thiết lập map phòng để bắt đầu đẩy giá và nhận đặt phòng tự động.
              </p>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>Hủy</Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isPending || (selectedType === 'channex' && (!channexApiKey.trim() || !channexPropertyId.trim()))}
            >
              {isPending ? 'Đang kết nối...' : 'Kết nối ngay'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
