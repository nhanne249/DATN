'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import axiosInstance from '@/lib/axios';
import { useBookingMutation } from '../hooks/use-bookings';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/use-auth-store';

export interface BookingModalInitialData {
  roomId?: string;
  roomTypeId?: string;
  roomName?: string;
  checkIn?: Date;
  checkOut?: Date;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: BookingModalInitialData | null;
}

const defaultForm = () => ({
  guestId: '',
  newGuestName: '',
  newGuestPhone: '',
  isNewGuest: false,
  source: 'walk-in',
  roomId: '',
  roomName: '',
  roomPrice: 0,
  checkIn: '',
  checkOut: '',
  adults: 1,
  children: 0,
  notes: '',
  paidAmount: 0,
});

export function BookingModal({ isOpen, onClose, onSuccess, initialData }: BookingModalProps) {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || '';
  const { createBooking, addPayment } = useBookingMutation();

  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [form, setForm] = useState(defaultForm());
  const [isConfirming, setIsConfirming] = useState(false);

  // Reset + pre-fill whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    const f = defaultForm();
    if (initialData?.roomId) {
      f.roomId = initialData.roomId;
      f.roomName = initialData.roomName ?? '';
    }
    if (initialData?.checkIn) f.checkIn = format(initialData.checkIn, "yyyy-MM-dd'T'14:00");
    if (initialData?.checkOut) f.checkOut = format(initialData.checkOut, "yyyy-MM-dd'T'12:00");
    setForm(f);
    setIsConfirming(false);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch guests + room types when open
  useEffect(() => {
    if (!isOpen || !propertyId) return;
    Promise.all([
      axiosInstance.get('/guests', { params: { propertyId, limit: 100 } }),
      axiosInstance.get('/rooms/types', { params: { propertyId } }),
    ])
      .then(([gRes, rRes]) => {
        setGuests(Array.isArray(gRes.data) ? gRes.data : gRes.data?.data ?? []);
        setRoomTypes(Array.isArray(rRes.data) ? rRes.data : []);
      })
      .catch(() => {});
  }, [isOpen, propertyId]);

  const allRooms = useMemo(
    () =>
      roomTypes.flatMap((t) =>
        (t.rooms ?? []).map((r: any) => ({
          ...r,
          typeName: t.name,
          typeId: t.id,
          basePrice: t.basePrice ?? 0,
        })),
      ),
    [roomTypes],
  );

  // Auto-fill price when pre-filled roomId is present and rooms have loaded
  useEffect(() => {
    if (!form.roomId || form.roomPrice > 0 || allRooms.length === 0) return;
    const room = allRooms.find((r) => r.id === form.roomId);
    if (room && room.basePrice > 0) setForm((f) => ({ ...f, roomPrice: room.basePrice }));
  }, [allRooms, form.roomId, form.roomPrice]);

  const nights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 1;
    const diff = Math.ceil(
      (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000,
    );
    return Math.max(1, diff);
  }, [form.checkIn, form.checkOut]);

  const totalAmount = nights * form.roomPrice;

  const set = <K extends keyof ReturnType<typeof defaultForm>>(
    key: K,
    val: ReturnType<typeof defaultForm>[K],
  ) => setForm((f) => ({ ...f, [key]: val }));

  const handleRoomSelect = (roomId: string) => {
    const room = allRooms.find((r) => r.id === roomId);
    if (!room) return;
    setForm((f) => ({
      ...f,
      roomId,
      roomName: `${room.typeName} - Phòng ${room.roomNumber}`,
      roomPrice: room.basePrice,
    }));
  };

  const validate = () => {
    if (!propertyId) { toast.error('Thiếu thông tin khách sạn'); return false; }
    if (!form.roomId) { toast.error('Vui lòng chọn phòng'); return false; }
    if (!form.checkIn || !form.checkOut) { toast.error('Vui lòng chọn ngày nhận và trả phòng'); return false; }
    if (new Date(form.checkIn) >= new Date(form.checkOut)) { toast.error('Ngày trả phòng phải sau ngày nhận phòng'); return false; }
    if (!form.isNewGuest && !form.guestId) { toast.error('Vui lòng chọn hoặc tạo khách hàng'); return false; }
    if (form.isNewGuest && !form.newGuestName.trim()) { toast.error('Vui lòng nhập tên khách hàng'); return false; }
    if (!form.roomPrice || form.roomPrice <= 0) { toast.error('Vui lòng nhập giá phòng/đêm'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    setIsConfirming(false);
    setLoading(true);
    try {
      // ── Step 1: resolve guest ID ──────────────────────────────────────────
      let finalGuestId = form.guestId;
      if (form.isNewGuest) {
        try {
          const res: any = await axiosInstance.post('/guests', {
            name: form.newGuestName.trim(),
            phone: form.newGuestPhone.trim() || undefined,
            propertyId,
          });
          finalGuestId = res.data?.id;
        } catch (gErr: any) {
          toast.error(gErr?.message ?? 'Không thể tạo khách hàng');
          return;
        }
      }
      if (!finalGuestId) { toast.error('Không xác định được khách hàng'); return; }

      // ── Step 2: create booking (mutation.onError handles error toast) ─────
      const bookRes: any = await createBooking({
        guestId: finalGuestId,
        propertyId,
        source: form.source,
        checkIn: new Date(form.checkIn).toISOString(),
        checkOut: new Date(form.checkOut).toISOString(),
        adults: form.adults,
        children: form.children,
        notes: form.notes.trim() || undefined,
        rooms: [{ roomId: form.roomId, priceAtBooking: form.roomPrice }],
      });

      // ── Step 3: optional deposit payment ─────────────────────────────────
      const bookingId = bookRes?.data?.id ?? bookRes?.id;
      if (form.paidAmount > 0 && bookingId) {
        try {
          await addPayment({
            bookingId,
            data: { amount: form.paidAmount, paymentMethod: 'CASH', notes: 'Đặt cọc / Thu trước' },
          });
        } catch {
          toast.error('Đặt phòng thành công nhưng không ghi được tiền cọc');
        }
      }

      onSuccess?.();
      onClose();
    } catch {
      // booking creation errors are already shown by mutation.onError
    } finally {
      setLoading(false);
    }
  };

  const hasPrefilledRoom = !!initialData?.roomId;
  const guestName = form.isNewGuest
    ? form.newGuestName
    : guests.find((g) => g.id === form.guestId)?.name ?? '';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[560px] bg-white border-gray-200 text-gray-800 max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {hasPrefilledRoom
                ? `Đặt phòng — ${initialData?.roomName}`
                : 'Tạo đặt phòng mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* ── Guest ── */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label>Khách hàng *</Label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => set('isNewGuest', !form.isNewGuest)}
                >
                  {form.isNewGuest ? 'Chọn khách đã có' : '+ Khách mới'}
                </button>
              </div>
              {form.isNewGuest ? (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Họ và tên *"
                    value={form.newGuestName}
                    onChange={(e) => set('newGuestName', e.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                  <Input
                    placeholder="Số điện thoại"
                    value={form.newGuestPhone}
                    onChange={(e) => set('newGuestPhone', e.target.value)}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              ) : (
                <Select value={form.guestId} onValueChange={(v) => set('guestId', v)}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Chọn khách hàng..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-800">
                    {guests.length === 0 ? (
                      <div className="py-3 text-center text-sm text-gray-400">
                        Chưa có khách. Bấm &ldquo;+ Khách mới&rdquo; để tạo.
                      </div>
                    ) : (
                      guests.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name}{g.phone ? ` — ${g.phone}` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* ── Room selector (only when not pre-filled) ── */}
            {!hasPrefilledRoom && (
              <div className="space-y-1.5">
                <Label>Phòng *</Label>
                <Select value={form.roomId} onValueChange={handleRoomSelect}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Chọn phòng..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-800 max-h-52">
                    {roomTypes.filter((t) => t.rooms?.length > 0).map((type) => (
                      <SelectGroup key={type.id}>
                        <SelectLabel className="text-xs text-gray-400 font-medium">{type.name}</SelectLabel>
                        {type.rooms.map((room: any) => (
                          <SelectItem key={room.id} value={room.id}>
                            Phòng {room.roomNumber}
                            {room.floor ? ` · Tầng ${room.floor}` : ''}
                            {type.basePrice
                              ? ` · ${Number(type.basePrice).toLocaleString('vi-VN')}đ/đêm`
                              : ''}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                    {allRooms.length === 0 && (
                      <div className="py-3 text-center text-sm text-gray-400">
                        Không có phòng. Vui lòng thêm phòng trước.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* ── Check-in / Check-out ── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Nhận phòng *</Label>
                <Input
                  type="datetime-local"
                  value={form.checkIn}
                  onChange={(e) => set('checkIn', e.target.value)}
                  className="bg-gray-50 border-gray-200 [color-scheme:light]"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Trả phòng *</Label>
                <Input
                  type="datetime-local"
                  value={form.checkOut}
                  onChange={(e) => set('checkOut', e.target.value)}
                  className="bg-gray-50 border-gray-200 [color-scheme:light]"
                />
              </div>
            </div>

            {/* ── Adults / Children / Source ── */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Người lớn</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.adults}
                  onChange={(e) => set('adults', Number(e.target.value))}
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Trẻ em</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.children}
                  onChange={(e) => set('children', Number(e.target.value))}
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Nguồn</Label>
                <Select value={form.source} onValueChange={(v) => set('source', v)}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-800">
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                    <SelectItem value="phone">Điện thoại</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="booking.com">Booking.com</SelectItem>
                    <SelectItem value="agoda">Agoda</SelectItem>
                    <SelectItem value="traveloka">Traveloka</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="zalo">Zalo</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── Pricing ── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Giá phòng / đêm (VND) *</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.roomPrice || ''}
                  onChange={(e) => set('roomPrice', Number(e.target.value))}
                  placeholder="0"
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tổng tiền ({nights} đêm)</Label>
                <Input
                  readOnly
                  value={totalAmount.toLocaleString('vi-VN')}
                  className="bg-gray-50 border-gray-200 font-semibold text-blue-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* ── Deposit ── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Thu cọc / trả trước (VND)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.paidAmount || ''}
                  onChange={(e) => set('paidAmount', Number(e.target.value))}
                  placeholder="0"
                  className="bg-gray-50 border-gray-200 font-semibold text-orange-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Còn lại</Label>
                <Input
                  readOnly
                  value={Math.max(0, totalAmount - form.paidAmount).toLocaleString('vi-VN')}
                  className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* ── Notes ── */}
            <div className="space-y-1.5">
              <Label>Ghi chú</Label>
              <Input
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Yêu cầu đặc biệt, lưu ý..."
                className="bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} disabled={loading} className="border-gray-200 text-gray-600">
              Hủy
            </Button>
            <Button
              onClick={() => validate() && setIsConfirming(true)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Tạo đặt phòng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog */}
      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent className="bg-white border-gray-200 text-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đặt phòng?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-1 text-gray-500 text-sm mt-1">
                <p>
                  <span className="text-gray-400">Phòng:</span>{' '}
                  <strong className="text-gray-800">{form.roomName || initialData?.roomName || '—'}</strong>
                </p>
                <p>
                  <span className="text-gray-400">Khách:</span>{' '}
                  <strong className="text-gray-800">{guestName || '—'}</strong>
                </p>
                {form.checkIn && form.checkOut && (
                  <p>
                    <span className="text-gray-400">Thời gian:</span>{' '}
                    {format(new Date(form.checkIn), 'HH:mm dd/MM/yyyy')}
                    {' → '}
                    {format(new Date(form.checkOut), 'HH:mm dd/MM/yyyy')}
                    {' '}
                    <span className="text-gray-400">({nights} đêm)</span>
                  </p>
                )}
                <p>
                  <span className="text-gray-400">Tổng tiền:</span>{' '}
                  <strong className="text-blue-600">{totalAmount.toLocaleString('vi-VN')} ₫</strong>
                </p>
                {form.paidAmount > 0 && (
                  <p>
                    <span className="text-gray-400">Đặt cọc:</span>{' '}
                    <strong className="text-orange-500">{form.paidAmount.toLocaleString('vi-VN')} ₫</strong>
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 text-gray-700">Thoát</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Đang lưu...' : 'Xác nhận tạo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
