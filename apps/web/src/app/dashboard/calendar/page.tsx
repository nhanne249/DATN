'use client';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Layers, Plus } from 'lucide-react';
import { format, addDays, subDays, startOfDay, differenceInDays, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BookingModal } from '@/features/bookings/components/BookingModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useAuthStore } from '@/store/use-auth-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useBookings, useBookingMutation } from '@/features/bookings/hooks/use-bookings';
import { useRoomTypes } from '@/features/rooms/hooks/use-rooms';
import { useServices } from '@/features/bookings/hooks/use-services';
import { bookingService } from '@/features/bookings/services/booking.service';
import { settingsService } from '@/features/settings/services/settings.service';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CalendarPage() {
    const { activePropertyId: propertyId } = useAuthStore();
    const [startDate, setStartDate] = useState(startOfDay(new Date()));
    const daysToShow = 14;
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    // Hooks
    const { data: roomTypesRaw = [], isLoading: loadingTypes } = useRoomTypes(propertyId || '');
    const { data: bookingsRaw = [], isLoading: loadingBookings } = useBookings(propertyId || '', {
        startDate: startDate.toISOString(),
        endDate: addDays(startDate, daysToShow).toISOString(),
        limit: 100
    });
    const { data: availableServices = [] } = useServices(propertyId || '');
    const { updateBooking } = useBookingMutation();

    // Local computed state for legacy compatibility
    const roomTypes = useMemo(() => {
        const virtualRooms: any[] = [];
        const bookings = Array.isArray(bookingsRaw) ? bookingsRaw : [];
        
        bookings.forEach((b: any) => {
            if (!b.bookingRooms?.length) {
                const vRoomId = `unassigned_${b.id}`;
                virtualRooms.push({
                    id: vRoomId,
                    roomNumber: `Đơn ${b.code || b.bookingCode}`,
                    floor: '-',
                    isVirtual: true
                });
            }
        });

        if (virtualRooms.length === 0) {
            virtualRooms.push({ id: null, roomNumber: 'Trống', floor: '-' });
        }

        return [{
            id: 'unassigned',
            name: 'Đơn chờ xếp phòng',
            rooms: virtualRooms
        }, ...roomTypesRaw];
    }, [roomTypesRaw, bookingsRaw]);

    const bookings = useMemo(() => {
        const arrBookings = Array.isArray(bookingsRaw) ? bookingsRaw : [];
        return arrBookings.map((b: any) => {
            const hasNoRoom = !b.bookingRooms?.length;
            if (hasNoRoom) {
                return { ...b, bookingRooms: [{ roomId: `unassigned_${b.id}` }] };
            }
            // Remap any booking-room without an assigned roomId to the virtual slot
            const newBookingRooms = b.bookingRooms.map((br: any) =>
                br.roomId ? br : { ...br, roomId: `unassigned_${b.id}` }
            );
            return { ...b, bookingRooms: newBookingRooms };
        });
    }, [bookingsRaw]);

    const loading = loadingTypes || loadingBookings;

    // Drag-to-book State
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ roomId: string, roomTypeId: string, roomName: string, date: Date } | null>(null);
    const [dragCurrent, setDragCurrent] = useState<Date | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<any>(null);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [editBookingData, setEditBookingData] = useState<any>({});
    const [isEditingBooking, setIsEditingBooking] = useState(false);

    // Services State
    const [bookingServices, setBookingServices] = useState<any[]>([]);
    const [newService, setNewService] = useState({ serviceId: '', quantity: 1, unitPrice: 0, customName: '' });
    const [serviceToRemove, setServiceToRemove] = useState<{ id: string; amount: number } | null>(null);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // Compute date range
    const dates = useMemo(() => {
        return Array.from({ length: daysToShow }).map((_, i) => addDays(startDate, i));
    }, [startDate, daysToShow]);

    // Global drag cancel
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setDragStart(null);
                setDragCurrent(null);
            }
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isDragging]);

    // Drag Handlers
    const handleCellMouseDown = (room: any, type: any, date: Date, e: React.MouseEvent) => {
        if (room.id === null) return;
        e.preventDefault(); // prevent text selection
        setIsDragging(true);
        setDragStart({ roomId: room.id, roomTypeId: type.id, roomName: `${type.name} - ${room.roomNumber}`, date });
        setDragCurrent(date);
    };

    const handleCellMouseEnter = (room: any, date: Date) => {
        if (room.id === null) return;
        if (isDragging && dragStart?.roomId === room.id) {
            setDragCurrent(date);
        }
    };

    const handleCellMouseUp = (room: any, type: any, date: Date) => {
        if (room.id === null) {
            setIsDragging(false);
            setDragStart(null);
            setDragCurrent(null);
            return;
        }
        if (isDragging && dragStart) {
            if (dragStart.roomId === room.id) {
                const sDate = dragStart.date <= date ? dragStart.date : date;
                const eDate = dragStart.date <= date ? date : dragStart.date;

                setModalData({
                    roomId: room.id,
                    roomTypeId: type.id,
                    roomName: `${type.name} - ${room.roomNumber}`,
                    checkIn: sDate,
                    checkOut: addDays(eDate, 1) // default checkout next day
                });
                setIsModalOpen(true);
            }
            setIsDragging(false);
            setDragStart(null);
            setDragCurrent(null);
        }
    };

    const refreshData = () => {
        // Query invalidation will handle this automatically when using hooks,
        // but for legacy callers, we can just trigger a re-fetch if needed.
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-blue-500/20 border-blue-500/30 text-blue-600';
            case 'CONFIRMED': return 'bg-purple-500/20 border-purple-500/30 text-purple-600';
            case 'CHECKED_IN': return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-600';
            case 'CHECKED_OUT': return 'bg-zinc-500/20 border-zinc-500/30 text-gray-500';
            case 'CANCELLED': return 'bg-red-500/20 border-red-500/30 text-red-400';
            case 'NO_SHOW': return 'bg-orange-500/20 border-orange-500/30 text-orange-500';
            default: return 'bg-blue-500/20 border-blue-500/30 text-blue-600';
        }
    };

    const handlePrevious = () => setStartDate(subDays(startDate, 7));
    const handleNext = () => setStartDate(addDays(startDate, 7));
    const handleToday = () => setStartDate(startOfDay(new Date()));

    const handleSelectBooking = (booking: any) => {
        setIsEditingBooking(false);
        const bookingDate = new Date(booking.checkIn);
        setEditBookingData({
            checkIn: format(bookingDate, "yyyy-MM-dd'T'HH:mm"),
            checkOut: format(new Date(booking.checkOut), "yyyy-MM-dd'T'HH:mm"),
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            totalAmount: booking.totalAmount,
            roomId: booking.bookingRooms?.[0]?.roomId || ''
        });

        // Use standardized service
        bookingService.getServiceUsages(booking.id)
            .then((res: any) => {
                setBookingServices(Array.isArray(res.data) ? res.data : []);
            })
            .catch(console.error);
        setSelectedBooking(booking);
    };

    const { cancelBooking, createTask } = useBookingMutation();

    const handleSaveBookingEdit = async (actionStatus?: string, actionPayment?: string) => {
        try {
            const payload: any = {
                status: actionStatus || editBookingData.status,
                paymentStatus: actionPayment || editBookingData.paymentStatus,
                checkIn: new Date(editBookingData.checkIn).toISOString(),
                checkOut: new Date(editBookingData.checkOut).toISOString(),
                totalAmount: Number(editBookingData.totalAmount)
            };

            if (editBookingData.roomId) {
                payload.roomId = editBookingData.roomId;
            }

            await updateBooking({ id: selectedBooking.id, data: payload });
            setSelectedBooking(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCheckout = async () => {
        if (!selectedBooking) return;

        try {
            const now = new Date();
            const checkInDate = new Date(selectedBooking.checkIn);

            let calcNights = Math.ceil((now.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
            calcNights = Math.max(1, calcNights);

            const origCheckOut = new Date(selectedBooking.checkOut);
            const origNights = Math.max(1, differenceInDays(origCheckOut, checkInDate));
            const servicesSum = bookingServices.reduce((a: number, b: any) => a + (b.amount || 0), 0);
            const origRoomTotal = Math.max(0, Number(selectedBooking.totalAmount || 0) - servicesSum);
            const roomRate = origRoomTotal / origNights;

            const newTotal = (roomRate * calcNights) + servicesSum;

            const payload = {
                status: 'CHECKED_OUT',
                checkOut: now.toISOString(),
                totalAmount: newTotal
            };

            await updateBooking({ id: selectedBooking.id, data: payload });
            setSelectedBooking(null);
            toast.info(`Hệ thống chốt số đêm thực tế là ${calcNights} đêm.`);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelBooking = () => {
        if (!selectedBooking) return;
        setCancelReason('');
        setShowCancelDialog(true);
    };

    const confirmCancelBooking = async () => {
        if (!selectedBooking) return;
        try {
            await cancelBooking({ id: selectedBooking.id, reason: cancelReason || 'Không có lý do' });
            setShowCancelDialog(false);
            setSelectedBooking(null);
        } catch (error) {
            console.error(error);
        }
    };

    const getDefaultTemplate = (type: string): string => {
        if (type === 'invoice') {
            return [
                '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333;">',
                '<div style="text-align: center; margin-bottom: 30px;">',
                '<h1 style="color: #1a56db; margin: 0;">HÓA ĐƠN THANH TOÁN</h1>',
                '<p>Ngày in: {{printDate}}</p></div>',
                '<div style="display:flex;justify-content:space-between;margin-bottom:30px;border-bottom:1px solid #eee;padding-bottom:20px;">',
                '<div><h3>Thông tin Khách sạn</h3><p><strong>Tên:</strong> {{propertyName}}</p><p><strong>Hotline:</strong> {{propertyPhone}}</p><p><strong>Địa chỉ:</strong> {{propertyAddress}}</p></div>',
                '<div style="text-align:right"><h3>Thông tin Khách hàng</h3><p><strong>Tên khách:</strong> {{guestName}}</p><p><strong>SĐT:</strong> {{guestPhone}}</p><p><strong>Mã ĐP:</strong> {{bookingCode}}</p></div>',
                '</div>',
                '<table style="width:100%;border-collapse:collapse;margin-bottom:30px">',
                '<thead><tr style="background:#f8fafc">',
                '<th style="padding:12px;border:1px solid #e2e8f0">Hạng mục</th>',
                '<th style="padding:12px;border:1px solid #e2e8f0;text-align:center">SL</th>',
                '<th style="padding:12px;border:1px solid #e2e8f0;text-align:right">Đơn giá</th>',
                '<th style="padding:12px;border:1px solid #e2e8f0;text-align:right">Thành tiền</th>',
                '</tr></thead><tbody>',
                '<tr><td style="padding:12px;border:1px solid #e2e8f0">Tiền phòng ({{roomName}})</td>',
                '<td style="padding:12px;border:1px solid #e2e8f0;text-align:center">{{nights}} đêm</td>',
                '<td style="padding:12px;border:1px solid #e2e8f0;text-align:right">{{roomPrice}} đ</td>',
                '<td style="padding:12px;border:1px solid #e2e8f0;text-align:right">{{roomTotal}} đ</td></tr>',
                '{{servicesList}}</tbody>',
                '<tfoot><tr style="background:#f8fafc;font-weight:bold">',
                '<td colspan="3" style="padding:12px;border:1px solid #e2e8f0;text-align:right">TỔNG CỘNG:</td>',
                '<td style="padding:12px;border:1px solid #e2e8f0;text-align:right;color:#ea580c">{{grandTotal}} đ</td></tr>',
                '<tr><td colspan="3" style="padding:12px;border:1px solid #e2e8f0;text-align:right">Đã thanh toán:</td>',
                '<td style="padding:12px;border:1px solid #e2e8f0;text-align:right">{{paidAmount}} đ</td></tr>',
                '<tr style="background:#f8fafc;font-weight:bold"><td colspan="3" style="padding:12px;border:1px solid #e2e8f0;text-align:right">CÒN LẠI:</td>',
                '<td style="padding:12px;border:1px solid #e2e8f0;text-align:right;color:#b91c1c">{{balanceDue}} đ</td></tr>',
                '</tfoot></table>',
                '<div style="display:flex;justify-content:space-between;margin-top:50px">',
                '<div style="text-align:center;width:50%"><p><strong>Khách hàng</strong></p><p style="font-style:italic;color:#666;font-size:12px">(Ký &amp; ghi rõ họ tên)</p></div>',
                '<div style="text-align:center;width:50%"><p><strong>Lễ tân</strong></p><p style="font-style:italic;color:#666;font-size:12px">(Ký &amp; ghi rõ họ tên)</p></div>',
                '</div>',
                '<div style="text-align:center;margin-top:80px;font-size:12px;color:#888"><p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p></div>',
                '</div>'
            ].join('\n');
        }
        return [
            '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333;">',
            '<div style="text-align: center; margin-bottom: 30px;">',
            '<h1 style="color: #10b981; margin: 0;">PHIẾU XÁC NHẬN ĐẶT CỌC</h1>',
            '<p>Ngày in: {{printDate}}</p></div>',
            '<div style="border:2px dashed #10b981;padding:20px;border-radius:8px;margin-bottom:30px;background:#f0fdf4">',
            '<h2 style="text-align:center;margin-top:0;color:#047857">SỐ TIỀN CỌC: {{paidAmount}} VND</h2>',
            '</div>',
            '<div style="display:flex;justify-content:space-between;margin-bottom:30px">',
            '<div style="width:48%"><h3>Thông tin Khách sạn</h3><p><strong>Tên:</strong> {{propertyName}}</p><p><strong>Hotline:</strong> {{propertyPhone}}</p></div>',
            '<div style="width:48%"><h3>Thông tin Khách hàng</h3><p><strong>Tên khách:</strong> {{guestName}}</p><p><strong>SĐT:</strong> {{guestPhone}}</p></div>',
            '</div>',
            '<h3>Chi tiết Đặt phòng (Mã: {{bookingCode}})</h3>',
            '<table style="width:100%;border-collapse:collapse;margin-bottom:30px"><tbody>',
            '<tr><td style="padding:10px;border-bottom:1px solid #eee"><strong>Phòng:</strong></td><td style="padding:10px;border-bottom:1px solid #eee">{{roomName}}</td></tr>',
            '<tr><td style="padding:10px;border-bottom:1px solid #eee"><strong>Nhận phòng:</strong></td><td style="padding:10px;border-bottom:1px solid #eee">{{checkInDate}} ({{checkInTime}})</td></tr>',
            '<tr><td style="padding:10px;border-bottom:1px solid #eee"><strong>Trả phòng:</strong></td><td style="padding:10px;border-bottom:1px solid #eee">{{checkOutDate}} ({{checkOutTime}})</td></tr>',
            '<tr><td style="padding:10px;border-bottom:1px solid #eee"><strong>Tổng tiền:</strong></td><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold">{{grandTotal}} VND</td></tr>',
            '<tr><td style="padding:10px;border-bottom:1px solid #eee;color:#b91c1c"><strong>Còn phải thu:</strong></td><td style="padding:10px;border-bottom:1px solid #eee;font-weight:bold;color:#b91c1c">{{balanceDue}} VND</td></tr>',
            '</tbody></table>',
            '<div style="display:flex;justify-content:space-between;margin-top:50px">',
            '<div style="text-align:center;width:50%"><p><strong>Khách hàng</strong></p><p style="font-style:italic;color:#666;font-size:12px">(Ký &amp; ghi rõ họ tên)</p></div>',
            '<div style="text-align:center;width:50%"><p><strong>Đại diện Khách sạn</strong></p><p style="font-style:italic;color:#666;font-size:12px">(Ký &amp; ghi rõ họ tên)</p></div>',
            '</div></div>'
        ].join('\n');
    };

    const handlePrint = async (type: string) => {
        try {
            const res = await settingsService.getPrintTemplate(type, propertyId || '');
            let content = getDefaultTemplate(type);

            if (res.status === 200 && res.data && res.data.content) {
                content = res.data.content;
            }

            const today = new Date();
            const formatVND = (val: number) => val.toLocaleString('vi-VN');

            content = content.replace(/{{printDate}}/g, format(today, 'dd/MM/yyyy HH:mm'));
            content = content.replace(/{{propertyName}}/g, "GoHost Clone System");
            content = content.replace(/{{propertyPhone}}/g, "0123.456.789");
            content = content.replace(/{{propertyAddress}}/g, "Hanoi, Vietnam");

            content = content.replace(/{{guestName}}/g, selectedBooking.guest?.name || 'Khách vãng lai');
            content = content.replace(/{{guestPhone}}/g, selectedBooking.guest?.phone || '...');
            content = content.replace(/{{bookingCode}}/g, selectedBooking.code);

            const roomName = selectedBooking.room?.roomNumber || '...';
            content = content.replace(/{{roomName}}/g, roomName);
            content = content.replace(/{{checkInDate}}/g, format(new Date(selectedBooking.checkIn), 'dd/MM/yyyy'));
            content = content.replace(/{{checkInTime}}/g, format(new Date(selectedBooking.checkIn), 'HH:mm'));
            content = content.replace(/{{checkOutDate}}/g, format(new Date(selectedBooking.checkOut), 'dd/MM/yyyy'));
            content = content.replace(/{{checkOutTime}}/g, format(new Date(selectedBooking.checkOut), 'HH:mm'));

            const nights = Math.max(1, differenceInDays(new Date(selectedBooking.checkOut), new Date(selectedBooking.checkIn)));
            content = content.replace(/{{nights}}/g, nights.toString());

            const roomTotal = Math.max(0, Number(selectedBooking.totalAmount || 0) - bookingServices.reduce((a, b) => a + b.amount, 0));
            content = content.replace(/{{roomPrice}}/g, formatVND(roomTotal / nights));
            content = content.replace(/{{roomTotal}}/g, formatVND(roomTotal));

            let servicesHtml = '';
            for (const s of bookingServices) {
                servicesHtml += `
            <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0;">${s.service?.name}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: center;">${s.quantity}</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">${formatVND(s.unitPrice)} đ</td>
                <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: right;">${formatVND(s.amount)} đ</td>
            </tr>`;
            }
            content = content.replace(/{{servicesList}}/g, servicesHtml);

            const total = Number(selectedBooking.totalAmount || 0);
            const paid = selectedBooking.paymentStatus === 'PAID' ? total : 0;
            const balance = total - paid;

            content = content.replace(/{{grandTotal}}/g, formatVND(total));
            content = content.replace(/{{paidAmount}}/g, formatVND(paid));
            content = content.replace(/{{paidAmountText}}/g, paid > 0 ? "... đồng" : "Không có");
            content = content.replace(/{{balanceDue}}/g, formatVND(balance));

            const printWindow = window.open('', '', 'width=800,height=800');
            if (printWindow) {
                printWindow.document.write(content);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tải mẫu in");
        }
    };

    const handleAddServiceUsage = async () => {
        if (!newService.serviceId) {
            toast.error("Vui lòng chọn một dịch vụ");
            return;
        }

        let serviceIdToUse = newService.serviceId;
        const amount = newService.unitPrice * newService.quantity;

        try {
            // Use standardized addServiceUsage from bookingService
            const res = await bookingService.addServiceUsage(selectedBooking.id, {
                serviceName: availableServices.find((s: any) => s.id === serviceIdToUse)?.name || 'Dịch vụ',
                quantity: newService.quantity,
                priceAtBooking: newService.unitPrice
            });

            if (res.status === 201 || res.status === 200) {
                // Update local list
                const usagesRes = await bookingService.getServiceUsages(selectedBooking.id);
                setBookingServices(Array.isArray(usagesRes.data) ? usagesRes.data : []);
                setNewService({ serviceId: '', quantity: 1, unitPrice: 0, customName: '' });
                
                // Update booking total
                await updateBooking({
                    id: selectedBooking.id,
                    data: { totalAmount: Number(editBookingData.totalAmount) + amount }
                });
                setEditBookingData({ ...editBookingData, totalAmount: Number(editBookingData.totalAmount) + amount });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveServiceUsage = async (usageId: string, usageAmount: number) => {
        try {
            const res = await bookingService.deleteServiceUsage(usageId);

            if (res.status === 200 || res.status === 204) {
                await updateBooking({
                    id: selectedBooking.id,
                    data: { totalAmount: Number(editBookingData.totalAmount) - usageAmount }
                });

                setEditBookingData({ ...editBookingData, totalAmount: Number(editBookingData.totalAmount) - usageAmount });
                setBookingServices(bookingServices.filter(s => s.id !== usageId));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateServiceQuantity = async (usageId: string, newQuantity: number, unitPrice: number, oldAmount: number) => {
        if (newQuantity < 1) return;
        const newAmount = newQuantity * unitPrice;
        const diffAmount = newAmount - oldAmount;

        try {
            const res = await bookingService.updateServiceUsage(usageId, { quantity: newQuantity });

            if (res.status === 200) {
                await updateBooking({
                    id: selectedBooking.id,
                    data: { totalAmount: Number(editBookingData.totalAmount) + diffAmount }
                });
                
                setEditBookingData({ ...editBookingData, totalAmount: Number(editBookingData.totalAmount) + diffAmount });
                setBookingServices(bookingServices.map(s => s.id === usageId ? { ...s, quantity: newQuantity, amount: newAmount } : s));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRequestCleaning = async () => {
        if (!selectedBooking || !selectedBooking.bookingRooms?.length) return;
        const roomId = selectedBooking.bookingRooms[0].roomId;
        try {
            const payload = {
                title: 'Dọn sơ',
                type: 'HOUSEKEEPING',
                status: 'PENDING',
                roomId: roomId,
                bookingId: selectedBooking.id,
                propertyId: propertyId,
                description: `Yêu cầu dọn sơ phòng ${selectedBooking.bookingRooms[0].room?.roomNumber || roomId} đang có khách lưu trú.`
            };
            await createTask(payload);
            setSelectedBooking(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Lịch phòng</h1>
                    <p className="text-sm text-gray-500">Timeline kéo thả và quản lý phòng trực quan.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100" onClick={handleToday}>
                        Hôm nay
                    </Button>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md">
                        <Button variant="ghost" size="icon" onClick={handlePrevious} className="h-9 w-9 text-gray-500 hover:text-blue-700 rounded-none border-r border-gray-200">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" className="px-4 text-sm font-medium text-gray-900 flex items-center gap-2 w-[240px] justify-center hover:bg-gray-100 rounded-none h-9">
                                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                                    {format(startDate, 'dd/MM/yyyy')} - {format(addDays(startDate, daysToShow - 1), 'dd/MM/yyyy')}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white border-gray-200 text-gray-800" align="center">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) => {
                                        if (date) {
                                            setStartDate(startOfDay(date));
                                            setIsDatePickerOpen(false);
                                        }
                                    }}
                                    initialFocus
                                    className="bg-white text-gray-800"
                                />
                            </PopoverContent>
                        </Popover>
                        <Button variant="ghost" size="icon" onClick={handleNext} className="h-9 w-9 text-gray-500 hover:text-blue-700 rounded-none border-l border-gray-200">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="flex-1 bg-white border-gray-200 overflow-hidden flex flex-col items-stretch">
                <CardContent className="p-0 flex-1 flex flex-col relative h-full">
                    {loading && (
                        <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-gray-500">Đang tải dữ liệu lịch...</span>
                        </div>
                    )}

                    {/* Outer Scroll Container */}
                    <div className="flex-1 overflow-auto flex flex-col relative custom-scrollbar">
                        <div className="flex flex-col min-w-max relative flex-1">
                            {/* Header: Dates */}
                            <div className="flex border-b border-gray-200 w-full sticky top-0 z-40 bg-white">
                                {/* Corner cell */}
                                <div className="w-48 flex-shrink-0 border-r border-gray-200 p-3 bg-gray-50 flex items-center justify-between sticky left-0 z-50">
                                    <span className="text-sm font-medium text-gray-500">Phòng</span>
                                    <Filter className="h-4 w-4 text-gray-400" />
                                </div>
                                {/* Dates row */}
                                <div className="flex-1 flex">
                                    {dates.map((date, i) => (
                                        <div key={i} className={`flex-1 min-w-[80px] flex flex-col items-center justify-center p-2 border-r border-gray-200 ${isSameDay(date, new Date()) ? 'bg-blue-500/10' : ''}`}>
                                            <span className="text-xs font-medium text-gray-400 uppercase">{format(date, 'eee', { locale: vi })}</span>
                                            <span className={`text-lg font-bold ${isSameDay(date, new Date()) ? 'text-blue-400' : 'text-gray-700'}`}>
                                                {format(date, 'dd')}
                                            </span>
                                            <span className="text-xs text-gray-400 truncate max-w-full">{format(date, 'MM/yyyy')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline Grid Body */}
                            <div className="flex-1 flex relative">
                                {/* Y-Axis: Rooms */}
                                <div className="w-48 flex-shrink-0 border-r border-gray-200 bg-white sticky left-0 z-30">
                                    {roomTypes.map(type => (
                                        <div key={type.id}>
                                            <div className="p-2 h-[38px] bg-gray-100/50 border-b border-gray-200 flex items-center gap-2">
                                                <Layers className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                <span className="text-xs font-medium text-gray-600 truncate" title={type.name}>{type.name}</span>
                                            </div>
                                            {type.rooms?.map((room: any) => {
                                                const statusLabel: Record<string, string> = {
                                                    CLEANING: 'Dọn phòng',
                                                    MAINTENANCE: 'Bảo trì',
                                                    BLOCKED: 'Tạm khóa',
                                                    OCCUPIED: 'Có khách',
                                                };
                                                const statusBadge: Record<string, string> = {
                                                    CLEANING: 'bg-yellow-100 text-yellow-700',
                                                    MAINTENANCE: 'bg-red-100 text-red-700',
                                                    BLOCKED: 'bg-gray-200 text-gray-500',
                                                    OCCUPIED: 'bg-blue-100 text-blue-700',
                                                };
                                                return (
                                                    <div key={room.id} className="h-16 border-b border-gray-200 p-3 flex flex-col justify-center relative group">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-sm font-medium text-gray-900">{room.roomNumber}</span>
                                                            {room.status && room.status !== 'AVAILABLE' && (
                                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusBadge[room.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                                                    {statusLabel[room.status] ?? room.status}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-gray-400">{room.floor ? `Tầng ${room.floor}` : ''}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>

                                {/* Grid & Bookings */}
                                <div className="flex-1 relative overflow-hidden flex flex-col">
                                    {/* Grid Lines Overlay */}
                                    <div className="absolute inset-0 flex pointer-events-none z-0">
                                        {dates.map((date, i) => (
                                            <div key={i} className={`flex-1 min-w-[80px] border-r border-gray-200/50 ${isSameDay(date, new Date()) ? 'bg-blue-500/5' : ''}`}></div>
                                        ))}
                                    </div>

                                    {/* Room Rows & Booking Render*/}
                                    {roomTypes.map(type => (
                                        <div key={type.id} className="relative z-10 flex flex-col">
                                            {/* Type Header Row Spacer */}
                                            <div className="h-[38px] border-b border-gray-200/50 bg-gray-50/10 w-full flex">
                                                {/* Grey out the row corresponding to the category header */}
                                            </div>

                                            {/* Actual Room Rows */}
                                            {type.rooms?.map((room: any) => {
                                                // Find bookings for this room
                                                const roomBookings = bookings.filter(b => b.bookingRooms?.some((br: any) => br.roomId === room.id));

                                                const isDateBooked = (date: Date) =>
                                                    roomBookings.some(b => {
                                                        const ci = new Date(b.checkIn);
                                                        const co = new Date(b.checkOut);
                                                        return ci <= date && date < co && !['CANCELLED', 'NO_SHOW'].includes(b.status);
                                                    });

                                                const cellBg = (date: Date) => {
                                                    if (isDateBooked(date)) return '';
                                                    if (room.status === 'CLEANING') return 'bg-yellow-50';
                                                    if (room.status === 'MAINTENANCE') return 'bg-red-50';
                                                    if (room.status === 'BLOCKED') return 'bg-gray-100';
                                                    return '';
                                                };

                                                // Calculate drag overlay bounds if active on this room
                                                let dragStyle = {};
                                                let showDrag = false;
                                                if (isDragging && dragStart && dragStart.roomId === room.id && dragCurrent) {
                                                    const sDate = dragStart.date <= dragCurrent ? dragStart.date : dragCurrent;
                                                    const eDate = dragStart.date <= dragCurrent ? dragCurrent : dragStart.date;

                                                    const msPerDay = 1000 * 60 * 60 * 24;
                                                    const startOffsetDays = (sDate.getTime() - startDate.getTime()) / msPerDay;
                                                    // Make drag visual range include +1 day for visual clarity when dragging entire cells
                                                    const durationDays = (eDate.getTime() - sDate.getTime()) / msPerDay + 1;

                                                    const drawStartDay = Math.max(0, startOffsetDays);
                                                    const drawEndDay = Math.min(daysToShow, startOffsetDays + durationDays);
                                                    const drawWidth = drawEndDay - drawStartDay;

                                                    const leftPercent = (drawStartDay / daysToShow) * 100;
                                                    const widthPercent = (drawWidth / daysToShow) * 100;

                                                    if (drawWidth > 0) {
                                                        showDrag = true;
                                                        dragStyle = {
                                                            left: `${leftPercent}%`,
                                                            width: `calc(${widthPercent}%)`
                                                        };
                                                    }
                                                }

                                                return (
                                                    <div key={room.id} className="h-16 border-b border-gray-200 flex w-full relative transition-colors select-none">
                                                        {/* Rendering bookings as absolute blocks */}
                                                        {roomBookings.map(booking => {
                                                            const checkIn = new Date(booking.checkIn);
                                                            const checkOut = new Date(booking.checkOut);

                                                            // Calculate if booking overlaps the current view
                                                            if (checkOut <= startDate || checkIn >= addDays(startDate, daysToShow)) return null;

                                                            const msPerDay = 1000 * 60 * 60 * 24;
                                                            // Fractional days since timeline start
                                                            const startOffsetDays = (checkIn.getTime() - startDate.getTime()) / msPerDay;
                                                            const durationDays = (checkOut.getTime() - checkIn.getTime()) / msPerDay;

                                                            // Clamp to view limits
                                                            const drawStartDay = Math.max(0, startOffsetDays);
                                                            const drawEndDay = Math.min(daysToShow, startOffsetDays + durationDays);
                                                            const drawWidth = Math.max(0, drawEndDay - drawStartDay);

                                                            const leftPercent = (drawStartDay / daysToShow) * 100;
                                                            const widthPercent = (drawWidth / daysToShow) * 100;

                                                            return (
                                                                <div
                                                                    key={booking.id}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSelectBooking(booking);
                                                                    }}
                                                                    className={`absolute top-2 bottom-2 rounded-md border p-1.5 overflow-hidden flex flex-col cursor-pointer shadow-sm transition-all z-20 ${getStatusColor(booking.status)} hover:brightness-110`}
                                                                    style={{
                                                                        left: `${leftPercent}%`,
                                                                        width: `calc(${widthPercent}%)`, // Exact exact fractional width
                                                                    }}
                                                                >
                                                                    <div className="flex justify-between items-center whitespace-nowrap">
                                                                        <span className="text-xs font-bold truncate max-w-full">{booking.guest?.name || 'Walk-in'}</span>
                                                                        <span className="text-[10px] opacity-70 ml-1 flex-shrink-0">{booking.nights}N</span>
                                                                    </div>
                                                                    <span className="text-[10px] truncate opacity-80 mt-auto">{booking.code}</span>
                                                                </div>
                                                            );
                                                        })}

                                                        {/* Drag Selection Overlay */}
                                                        {showDrag && (
                                                            <div
                                                                className="absolute top-1 bottom-1 bg-blue-500/30 border-2 border-dashed border-blue-400/50 rounded pointer-events-none z-10 opacity-70"
                                                                style={dragStyle}
                                                            />
                                                        )}

                                                        {/* Empty Cells for interaction (Add Booking) */}
                                                        {dates.map((date, i) => (
                                                            <div
                                                                key={i}
                                                                className={`flex-1 min-w-[80px] h-full flex items-center justify-center cursor-crosshair transition-all z-10 border-r border-transparent hover:bg-gray-100/40 ${cellBg(date)}`}
                                                                onMouseDown={(e) => handleCellMouseDown(room, type, date, e)}
                                                                onMouseEnter={() => handleCellMouseEnter(room, date)}
                                                                onMouseUp={() => handleCellMouseUp(room, type, date)}
                                                            />
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    refreshData();
                }}
                initialData={modalData}
            />

            {/* View/Edit Details Dialog */}
            {
                selectedBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}>
                        <Card className="w-full max-w-4xl bg-white border-gray-200 p-6 flex flex-col gap-4 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                <h2 className="text-lg font-bold text-gray-900">Quản lý Đặt phòng</h2>
                                <button onClick={() => setSelectedBooking(null)} className="text-gray-500 hover:text-blue-700">&times;</button>
                            </div>

                            <Tabs defaultValue="info" className="w-full text-sm">
                                <TabsList className="grid w-full grid-cols-2 bg-gray-50 mb-4 h-9 p-1">
                                    <TabsTrigger value="info" className="text-xs data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500">Thông tin chung</TabsTrigger>
                                    <TabsTrigger value="services" className="text-xs data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-500">Dịch vụ bổ sung</TabsTrigger>
                                </TabsList>
                                <TabsContent value="info" className="mt-0 focus-visible:outline-none">
                                    <fieldset disabled={!isEditingBooking} className="border-none p-0 m-0 min-w-0 w-full space-y-4">
                                        <div className="text-gray-600 space-y-2 mb-4 bg-gray-50 p-4 rounded-md border border-gray-200 relative overflow-hidden">
                                            {selectedBooking.source !== 'walk-in' && selectedBooking.status === 'PENDING' && (
                                                <div className="absolute top-0 right-0 bg-orange-500/20 text-orange-400 text-xs px-3 py-1 font-semibold rounded-bl-lg border-b border-l border-orange-500/30">
                                                    CẦN XÁC NHẬN
                                                </div>
                                            )}
                                            <p><strong className="text-gray-500 w-32 inline-block">Mã Booking:</strong> <span className="text-gray-900 font-bold">{selectedBooking.code}</span></p>
                                            <p><strong className="text-gray-500 w-32 inline-block">Khách hàng:</strong> <span className="text-blue-400 font-medium">{selectedBooking.guest?.name || 'Walk-in'} ({selectedBooking.guest?.phone || 'Chưa cập nhật'})</span></p>
                                            <p><strong className="text-gray-500 w-32 inline-block">Nguồn:</strong> <span className="uppercase text-gray-900 font-medium">{selectedBooking.source === 'walk-in' ? 'Khách lẻ / Trực tiếp' : selectedBooking.source}</span></p>
                                            <p><strong className="text-gray-500 w-32 inline-block">TG Tạo đơn:</strong> <span className="text-gray-600">{format(new Date(selectedBooking.createdAt || new Date()), "HH:mm - dd/MM/yyyy")}</span></p>
                                            {selectedBooking.status === 'CANCELLED' && selectedBooking.cancellationReason && (
                                                <p><strong className="text-red-400 w-32 inline-block">Lý do hủy:</strong> <span className="text-red-300 font-medium italic">{selectedBooking.cancellationReason}</span></p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs text-gray-400 uppercase mb-1">Nhận phòng</label>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-gray-900 [color-scheme:light]"
                                                    value={editBookingData.checkIn}
                                                    onChange={e => setEditBookingData({ ...editBookingData, checkIn: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 uppercase mb-1">Trả phòng</label>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-gray-900 [color-scheme:light]"
                                                    value={editBookingData.checkOut}
                                                    onChange={e => setEditBookingData({ ...editBookingData, checkOut: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs text-gray-400 uppercase mb-1">Phòng xếp (Gán phòng)</label>
                                                <select
                                                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-gray-900"
                                                    value={editBookingData.roomId || ''}
                                                    onChange={e => setEditBookingData({ ...editBookingData, roomId: e.target.value })}
                                                >
                                                    <option value="">-- Chưa xếp phòng --</option>
                                                    {roomTypes.filter((t: any) => t.id !== 'unassigned').map((type: any) => (
                                                        <optgroup key={type.id} label={type.name}>
                                                            {type.rooms?.map((room: any) => (
                                                                <option key={room.id} value={room.id}>{room.roomNumber}</option>
                                                            ))}
                                                        </optgroup>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 uppercase mb-1">Trạng thái</label>
                                                <select
                                                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-gray-900"
                                                    value={editBookingData.status}
                                                    onChange={e => setEditBookingData({ ...editBookingData, status: e.target.value })}
                                                >
                                                    <option value="PENDING">Chờ xác nhận</option>
                                                    <option value="CONFIRMED">Đã xác nhận</option>
                                                    <option value="CHECKED_IN">Đang lưu trú</option>
                                                    <option value="CHECKED_OUT">Đã trả phòng</option>
                                                    <option value="CANCELLED">Đã hủy</option>
                                                    <option value="NO_SHOW">Không đến</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 uppercase mb-1">Thanh toán</label>
                                                <select
                                                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-gray-900"
                                                    value={editBookingData.paymentStatus}
                                                    onChange={e => setEditBookingData({ ...editBookingData, paymentStatus: e.target.value })}
                                                >
                                                    <option value="PENDING">Chưa thanh toán</option>
                                                    <option value="PARTIAL">Một phần</option>
                                                    <option value="PAID">Đã thanh toán</option>
                                                    <option value="REFUNDED">Hoàn tiền</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase mb-1">Cơ cấu Doanh thu</label>
                                            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm flex flex-col gap-2">
                                                <div className="flex justify-between items-center text-gray-500">
                                                    <span>Tiền phòng:</span>
                                                    <span className="text-gray-700">{(Number(editBookingData.totalAmount || 0) - bookingServices.reduce((a, b) => a + b.amount, 0)).toLocaleString('vi-VN')} VND</span>
                                                </div>
                                                <div className="flex justify-between items-center text-gray-500">
                                                    <span>Tiền dịch vụ:</span>
                                                    <span className="text-gray-700">{bookingServices.reduce((a, b) => a + b.amount, 0).toLocaleString('vi-VN')} VND</span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-1">
                                                    <span className="text-gray-600 uppercase text-xs">Tổng thu khách (VND):</span>
                                                    <input
                                                        type="number"
                                                        className="w-32 bg-white border border-gray-300 focus:border-orange-500 rounded p-1 text-right text-gray-900 font-bold text-orange-400 outline-none"
                                                        value={editBookingData.totalAmount}
                                                        onChange={e => setEditBookingData({ ...editBookingData, totalAmount: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </TabsContent>

                                <TabsContent value="services" className="mt-0 focus-visible:outline-none">
                                    <fieldset disabled={!isEditingBooking} className="border-none p-0 m-0 min-w-0 w-full space-y-4">
                                        <div className="flex gap-2 flex-wrap mb-2">
                                            <select
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded p-2 text-gray-900 text-sm min-w-40"
                                                value={newService.serviceId}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (val === 'NEW_SERVICE') {
                                                        setNewService(prev => ({ ...prev, serviceId: val, unitPrice: 0, customName: '' }));
                                                    } else {
                                                        const srv = availableServices.find((s: any) => s.id === val);
                                                        setNewService(prev => ({ ...prev, serviceId: val, unitPrice: srv ? srv.price : 0, customName: '' }));
                                                    }
                                                }}
                                            >
                                                <option value="">-- Chọn dịch vụ --</option>
                                                {availableServices.map((s: any) => (
                                                    <option key={s.id} value={s.id}>{s.name} ({s.price.toLocaleString()} VND)</option>
                                                ))}
                                                <option value="NEW_SERVICE">+ Tạo dịch vụ tùy chỉnh</option>
                                            </select>

                                            {newService.serviceId === 'NEW_SERVICE' && (
                                                <input
                                                    type="text"
                                                    className="w-full sm:w-auto flex-1 bg-gray-50 border border-gray-200 rounded p-2 text-gray-900 text-sm"
                                                    value={newService.customName}
                                                    onChange={e => setNewService({ ...newService, customName: e.target.value })}
                                                    placeholder="Tên dịch vụ mới"
                                                />
                                            )}

                                            <input
                                                type="number"
                                                min="0"
                                                className="w-28 bg-gray-50 border border-gray-200 rounded p-2 text-right text-gray-900 text-sm"
                                                value={newService.unitPrice}
                                                onChange={e => setNewService({ ...newService, unitPrice: Number(e.target.value) })}
                                                placeholder="Đơn giá"
                                            />
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-16 bg-gray-50 border border-gray-200 rounded p-2 text-center text-gray-900 text-sm"
                                                value={newService.quantity}
                                                onChange={e => setNewService({ ...newService, quantity: Number(e.target.value) })}
                                                placeholder="SL"
                                            />
                                            <Button onClick={handleAddServiceUsage} className="bg-blue-600 hover:bg-blue-700 text-white px-3 flex-shrink-0"><Plus className="w-4 h-4" /></Button>
                                        </div>
                                        <div className="border border-gray-200 rounded overflow-hidden">
                                            <table className="w-full text-sm text-left text-gray-600">
                                                <thead className="bg-gray-50 text-xs text-gray-500">
                                                    <tr>
                                                        <th className="px-3 py-2 font-medium">Dịch vụ</th>
                                                        <th className="px-3 py-2 font-medium text-center">SL</th>
                                                        <th className="px-3 py-2 font-medium text-right">Tổng (VND)</th>
                                                        <th className="px-3 py-2"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bookingServices.length > 0 ? bookingServices.map(usage => (
                                                        <tr key={usage.id} className="border-b border-gray-200/50 bg-white/50 hover:bg-gray-50">
                                                            <td className="px-3 py-2 text-gray-900">{usage.service?.name}
                                                                {usage.unitPrice !== usage.service?.price && <span className="text-xs text-gray-400 block">({usage.unitPrice.toLocaleString()} đ/sp)</span>}
                                                            </td>
                                                            <td className="px-3 py-2 text-center">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    className="w-16 bg-white border border-gray-200 rounded p-1 text-center text-gray-900 text-xs outline-none focus:border-zinc-500"
                                                                    value={usage.quantity}
                                                                    onChange={e => handleUpdateServiceQuantity(usage.id, Number(e.target.value), usage.unitPrice, usage.amount)}
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 text-right">{usage.amount.toLocaleString()}</td>
                                                            <td className="px-3 py-2 text-right">
                                                                <button className="text-gray-400 hover:text-red-400" onClick={() => setServiceToRemove({ id: usage.id, amount: usage.amount })}>&times;</button>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={4} className="px-3 py-6 text-center text-gray-400 text-xs">Chưa có dịch vụ nào</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex flex-col gap-1 text-right pt-3 border-t border-gray-200">
                                            <div className="text-xs text-gray-500">Tiền phòng: <span className="text-gray-700">{(Number(editBookingData.totalAmount || 0) - bookingServices.reduce((a, b) => a + b.amount, 0)).toLocaleString('vi-VN')}</span> VND</div>
                                            <div className="text-xs text-gray-500">Tiền dịch vụ: <span className="text-gray-700">{bookingServices.reduce((a, b) => a + b.amount, 0).toLocaleString('vi-VN')}</span> VND</div>
                                            <div className="text-sm pt-2 mt-1 border-t border-gray-200/50">
                                                <span className="text-gray-500 uppercase mr-2 text-xs">Tổng thu khách:</span>
                                                <span className="font-bold text-orange-400">{Number(editBookingData.totalAmount || 0).toLocaleString('vi-VN')} VND</span>
                                            </div>
                                        </div>
                                    </fieldset>
                                </TabsContent>
                            </Tabs>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-gray-200 mt-2">
                                <Button variant="outline" className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-blue-700" onClick={() => setSelectedBooking(null)}>Đóng</Button>

                                <div className="flex flex-wrap gap-2 items-center">
                                    {!isEditingBooking ? (
                                        <>
                                            <Button variant="outline" className="bg-gray-50 border-teal-900/50 text-teal-400 hover:bg-teal-900/20" onClick={() => handlePrint('invoice')}>
                                                In Hóa đơn
                                            </Button>

                                            <Button variant="outline" className="bg-gray-50 border-teal-900/50 text-teal-400 hover:bg-teal-900/20" onClick={() => handlePrint('deposit')}>
                                                In Phiếu đặt cọc
                                            </Button>

                                            <Button variant="outline" className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-blue-700" onClick={(e) => { e.preventDefault(); setIsEditingBooking(true); }}>
                                                Chỉnh sửa
                                            </Button>

                                            {(editBookingData.status === 'CHECKED_IN') && (
                                                <Button variant="outline" className="bg-gray-50 text-violet-400 border-violet-900/50 hover:bg-violet-900/20" onClick={() => handleRequestCleaning()}>
                                                    Yêu cầu Dọn phòng
                                                </Button>
                                            )}

                                            {(editBookingData.status === 'PENDING' || editBookingData.status === 'CONFIRMED') && (
                                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleSaveBookingEdit('CHECKED_IN')}>
                                                    Check-in
                                                </Button>
                                            )}

                                            {editBookingData.paymentStatus !== 'PAID' && editBookingData.status !== 'CANCELLED' && (
                                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleSaveBookingEdit(undefined, 'PAID')}>
                                                    Xác nhận thu tiền
                                                </Button>
                                            )}

                                            {editBookingData.status === 'CHECKED_IN' && (
                                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCheckout}>
                                                    Check-out trả phòng
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="outline" className="bg-gray-50 border-red-900/50 text-red-400 hover:bg-red-900/20" onClick={() => handleCancelBooking()}>
                                                Hủy đơn
                                            </Button>
                                            <Button variant="outline" className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-blue-700" onClick={() => setIsEditingBooking(false)}>Hủy</Button>
                                            <Button variant="secondary" className="bg-gray-100 text-gray-900 hover:bg-gray-200" onClick={() => handleSaveBookingEdit()}>Lưu thay đổi</Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                )
            }

            {/* Service Removal Alert Dialog */}
            <AlertDialog open={!!serviceToRemove} onOpenChange={(open) => !open && setServiceToRemove(null)}>
                <AlertDialogContent className="bg-white border-gray-200 text-gray-900">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa dịch vụ</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500">
                            Bạn có chắc chắn muốn xóa dịch vụ này khỏi Đặt phòng? Việc này không thể hoàn tác và doanh thu sẽ tự động được cập nhật.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100 hover:text-blue-700">Thoát</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                            if (serviceToRemove) {
                                handleRemoveServiceUsage(serviceToRemove.id, serviceToRemove.amount);
                                setServiceToRemove(null);
                            }
                        }}>
                            Xác nhận xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Booking Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={(open) => { if (!open) setShowCancelDialog(false); }}>
                <DialogContent className="bg-gray-50 border-gray-200 text-gray-900 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">Hủy đặt phòng</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-2">
                        <p className="text-sm text-gray-500">Nhập lý do hủy phòng (tùy chọn):</p>
                        <Input
                            placeholder="VD: Khách yêu cầu hủy, sự cố..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="bg-white border-gray-200 text-gray-900"
                            onKeyDown={(e) => e.key === 'Enter' && confirmCancelBooking()}
                        />
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100" onClick={() => setShowCancelDialog(false)}>
                            Thoát
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmCancelBooking}>
                            Xác nhận hủy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
