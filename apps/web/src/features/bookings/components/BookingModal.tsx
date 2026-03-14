'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import axiosInstance from '@/lib/axios';
import { useBookingMutation } from '../hooks/use-bookings';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData: {
    roomId?: string;
    roomTypeId?: string;
    roomName?: string;
    checkIn?: Date;
    checkOut?: Date;
  } | null;
}

const TEST_PROPERTY_ID = 'clouq2m1q00003b6w5z8s6xy9';

export function BookingModal({ isOpen, onClose, onSuccess, initialData }: BookingModalProps) {
  const { createBooking, addPayment } = useBookingMutation();
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<any[]>([]);

  // Form State
  const [guestId, setGuestId] = useState<string>('');
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [source, setSource] = useState<string>('walk-in');

  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [roomPrice, setRoomPrice] = useState<number>(500000);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [nights, setNights] = useState<number>(1);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Alert Dialog State
  const [isConfirming, setIsConfirming] = useState(false);

  // Fetch guests when modal opens
  useEffect(() => {
    if (isOpen) {
      axiosInstance.get('/guests?limit=50')
        .then((res: any) => setGuests(Array.isArray(res.data) ? res.data : res.data.data || []))
        .catch(err => console.error("Failed to load guests", err));
    }
  }, [isOpen]);

  // Pre-fill dates from timeline drag
  useEffect(() => {
    if (initialData?.checkIn) {
      setCheckIn(format(initialData.checkIn, "yyyy-MM-dd'T'14:00"));
    }
    if (initialData?.checkOut) {
      setCheckOut(format(initialData.checkOut, "yyyy-MM-dd'T'12:00"));
    }
  }, [initialData]);

  // Dynamic price calculation
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn).getTime();
      const end = new Date(checkOut).getTime();
      if (!isNaN(start) && !isNaN(end)) {
        let calcNights = Math.ceil((end - start) / (1000 * 3600 * 24));
        calcNights = Math.max(1, calcNights);
        setNights(calcNights);
        setTotalAmount(calcNights * roomPrice);
      }
    }
  }, [checkIn, checkOut, roomPrice]);

  const validateAndConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewGuest && !newGuestName.trim()) {
      toast.error("Vui lòng nhập tên khách hàng");
      return;
    }
    if (!isNewGuest && !guestId) {
      toast.error("Vui lòng chọn khách hàng");
      return;
    }
    setIsConfirming(true);
  };

  const handleConfirmSubmit = async () => {
    setIsConfirming(false);
    setLoading(true);
    try {
      let finalGuestId = guestId;

      // 1. Create new guest if needed
      if (isNewGuest && newGuestName) {
        const guestRes: any = await axiosInstance.post('/guests', {
          name: newGuestName,
          phone: newGuestPhone,
          propertyId: TEST_PROPERTY_ID
        });
        finalGuestId = guestRes.data?.id;
      }

      if (!finalGuestId) {
        toast.error("Vui lòng chọn hoặc tạo khách hàng mới");
        setLoading(false);
        return;
      }

      const payload = {
        guestId: finalGuestId,
        propertyId: TEST_PROPERTY_ID,
        source: source,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        totalAmount: totalAmount,
        rooms: initialData?.roomTypeId ? [{
          roomTypeId: initialData.roomTypeId,
          roomId: initialData.roomId,
          priceAtBooking: roomPrice,
          checkIn: new Date(checkIn).toISOString(),
          checkOut: new Date(checkOut).toISOString()
        }] : []
      };

      const bookRes: any = await createBooking(payload);
      const bookingId = bookRes.data?.id;

      // 2. Create initial payment if paidAmount > 0
      if (paidAmount > 0 && bookingId) {
        await addPayment({
          bookingId,
          data: {
            amount: paidAmount,
            paymentMethod: 'CASH',
            notes: 'Khách thanh toán trước/đặt cọc'
          }
        });
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle>Tạo Đặt phòng Mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={validateAndConfirm} className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Khách hàng *</Label>
                <Button type="button" variant="link" className="h-auto p-0 text-xs text-blue-400" onClick={() => setIsNewGuest(!isNewGuest)}>
                  {isNewGuest ? 'Chọn khách đã có' : '+ Tạo khách mới'}
                </Button>
              </div>

              {isNewGuest ? (
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Tên khách hàng" value={newGuestName} onChange={e => setNewGuestName(e.target.value)} required className="bg-zinc-900 border-zinc-800" />
                  <Input placeholder="Số điện thoại" value={newGuestPhone} onChange={e => setNewGuestPhone(e.target.value)} className="bg-zinc-900 border-zinc-800" />
                </div>
              ) : (
                <Select value={guestId} onValueChange={setGuestId} required>
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-800">
                    <SelectValue placeholder="Chọn khách hàng..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    {guests.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name} - {g.phone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phòng được chọn</Label>
                <Input readOnly value={initialData?.roomName || 'Chưa chọn'} className="bg-zinc-900 border-zinc-800 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <Label>Nguồn khách</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    <SelectValue placeholder="Chọn nguồn..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    <SelectItem value="walk-in">Khách lẻ (Walk-in)</SelectItem>
                    <SelectItem value="booking.com">Booking.com</SelectItem>
                    <SelectItem value="agoda">Agoda</SelectItem>
                    <SelectItem value="traveloka">Traveloka</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="zalo">Zalo</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nhận phòng *</Label>
                <Input type="datetime-local" value={checkIn} onChange={e => setCheckIn(e.target.value)} required className="bg-zinc-900 border-zinc-800 [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <Label>Trả phòng *</Label>
                <Input type="datetime-local" value={checkOut} onChange={e => setCheckOut(e.target.value)} required className="bg-zinc-900 border-zinc-800 [color-scheme:dark]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Đơn giá phòng/đêm (VND)</Label>
                <Input type="number" value={roomPrice || ''} onChange={e => setRoomPrice(Number(e.target.value))} required className="bg-zinc-900 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label>Tổng tiền phòng ({nights} đêm)</Label>
                <Input readOnly type="text" value={totalAmount.toLocaleString('vi-VN')} className="bg-zinc-900 border-zinc-800 font-bold text-blue-400 cursor-not-allowed opacity-80" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trả trước / Cọc (VND)</Label>
                <Input type="number" value={paidAmount || ''} onChange={e => setPaidAmount(Number(e.target.value))} min="0" className="bg-zinc-900 border-zinc-700 focus:border-orange-500 text-orange-400 font-bold" />
              </div>
              <div className="space-y-2">
                <Label>Còn lại (VND)</Label>
                <Input readOnly type="text" value={Math.max(0, totalAmount - paidAmount).toLocaleString('vi-VN')} className="bg-zinc-900 border-zinc-800 font-bold text-zinc-400 cursor-not-allowed opacity-80" />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-zinc-800">
              <Button type="button" variant="outline" onClick={onClose} className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 mr-2">
                Hủy
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Đang lưu...' : 'Tạo Đặt phòng'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận Đặt phòng?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Bạn sắp tạo một đặt phòng mới{isNewGuest ? ' và lưu thông tin khách hàng mới' : ''}. Bạn có tự tin thông tin đã chính xác?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-zinc-800 text-white hover:bg-zinc-800 hover:text-white">Thoát</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
