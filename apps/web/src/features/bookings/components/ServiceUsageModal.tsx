'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { useBookingMutation } from '../hooks/use-bookings';

interface ServiceUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  propertyId: string;
}

export function ServiceUsageModal({ isOpen, onClose, booking, propertyId }: ServiceUsageModalProps) {
  const { addServiceUsage } = useBookingMutation();
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [serviceForm, setServiceForm] = useState({ serviceId: '', quantity: 1, amount: 0 });

  useEffect(() => {
    if (isOpen && availableServices.length === 0) {
      axiosInstance.get(`/services?propertyId=${propertyId}&isActive=true`)
        .then((res: any) => setAvailableServices(res.data || []))
        .catch(err => console.error("Failed to load services", err));
    }
  }, [isOpen, propertyId]);

  const handleServiceSelect = (serviceId: string) => {
    const s = availableServices.find(x => x.id === serviceId);
    if (s) {
      setServiceForm(prev => ({ ...prev, serviceId, amount: s.price * prev.quantity }));
    }
  };

  const handleQuantityChange = (q: number) => {
    const qty = Math.max(1, q);
    const s = availableServices.find(x => x.id === serviceForm.serviceId);
    if (s) {
      setServiceForm(prev => ({ ...prev, quantity: qty, amount: s.price * qty }));
    } else {
      setServiceForm(prev => ({ ...prev, quantity: qty }));
    }
  };

  const handleAddService = async () => {
    if (!serviceForm.serviceId || !booking) return;
    try {
      const s = availableServices.find(x => x.id === serviceForm.serviceId);
      await addServiceUsage({
        bookingId: booking.id,
        data: {
          serviceName: s?.name || '',
          quantity: serviceForm.quantity,
          priceAtBooking: s?.price || 0,
          notes: ''
        }
      });
      onClose();
    } catch (error) {
      // toast handled in hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Thêm Dịch vụ / Phụ thu</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex justify-between items-center">
            <div>
              <span className="text-xs text-zinc-500 block uppercase">Đặt phòng</span>
              <span className="font-bold text-white">{booking?.bookingCode || booking?.code}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-500 block uppercase">Khách hàng</span>
              <span className="font-medium text-white">{booking?.guest?.name || booking?.guest?.fullName || 'Walk-in'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Chọn Dịch vụ <span className="text-rose-500">*</span></label>
            <UISelect value={serviceForm.serviceId} onValueChange={handleServiceSelect}>
              <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectValue placeholder="Chọn dịch vụ/phụ thu..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                {availableServices.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} - {s.price.toLocaleString('vi-VN')}₫/lần
                  </SelectItem>
                ))}
              </SelectContent>
            </UISelect>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Số lượng <span className="text-rose-500">*</span></label>
              <Input
                type="number"
                min="1"
                value={serviceForm.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Thành tiền (VND)</label>
              <Input
                readOnly
                value={serviceForm.amount.toLocaleString('vi-VN')}
                className="bg-zinc-900 border-zinc-800 font-bold text-emerald-400 cursor-not-allowed opacity-80"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-800" onClick={onClose}>Hủy</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!serviceForm.serviceId} onClick={handleAddService}>
            Lưu Dịch Vụ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
