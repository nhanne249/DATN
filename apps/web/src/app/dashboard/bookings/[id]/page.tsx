'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import {
    ArrowLeft, User, Phone, MapPin, Calendar, Clock, CreditCard, Tag,
    CheckCircle2, AlertCircle, LogIn, LogOut, Banknote, XCircle, ConciergeBell, Package
} from 'lucide-react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import { ServiceUsageModal } from '@/features/bookings/components/ServiceUsageModal';
import { useAuthStore } from '@/store/use-auth-store';

export default function BookingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { activePropertyId } = useAuthStore();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Payment dialog
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [paymentNote, setPaymentNote] = useState('');

    // Cancel dialog
    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // Service usage modal
    const [serviceModalOpen, setServiceModalOpen] = useState(false);

    // Minibar
    const [minibar, setMinibar] = useState<{ totalAmount: number; transactions: any[] } | null>(null);

    const fetchBooking = async () => {
        try {
            const [bookingRes, minibarRes] = await Promise.all([
                axiosInstance.get(`/bookings/${params.id}`),
                axiosInstance.get(`/bookings/${params.id}/minibar`),
            ]);
            setBooking(bookingRes.data);
            setMinibar(minibarRes.data);
        } catch {
            toast.error('Không thể tải thông tin đặt phòng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) fetchBooking();
    }, [params.id]);

    const handleCheckIn = async () => {
        setActionLoading(true);
        try {
            await axiosInstance.patch(`/bookings/${booking.id}`, { status: 'CHECKED_IN' });
            toast.success('Khách đã nhận phòng!');
            fetchBooking();
        } catch (e: any) {
            toast.error(e.message || 'Không thể cập nhật trạng thái');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setActionLoading(true);
        try {
            await axiosInstance.patch(`/bookings/${booking.id}`, { status: 'CHECKED_OUT' });
            toast.success('Khách đã trả phòng!');
            fetchBooking();
        } catch (e: any) {
            toast.error(e.message || 'Không thể cập nhật trạng thái');
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirm = async () => {
        setActionLoading(true);
        try {
            await axiosInstance.patch(`/bookings/${booking.id}`, { status: 'CONFIRMED' });
            toast.success('Đã xác nhận đặt phòng!');
            fetchBooking();
        } catch (e: any) {
            toast.error(e.message || 'Không thể xác nhận');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddPayment = async () => {
        if (!paymentAmount || Number(paymentAmount) <= 0) {
            toast.error('Vui lòng nhập số tiền hợp lệ');
            return;
        }
        setActionLoading(true);
        try {
            await axiosInstance.post(`/bookings/${booking.id}/payments`, {
                amount: Number(paymentAmount),
                paymentMethod,
                notes: paymentNote || undefined,
            });
            toast.success('Ghi nhận thanh toán thành công!');
            setPaymentOpen(false);
            setPaymentAmount('');
            setPaymentNote('');
            fetchBooking();
        } catch (e: any) {
            toast.error(e.message || 'Không thể ghi nhận thanh toán');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error('Vui lòng nhập lý do hủy');
            return;
        }
        setActionLoading(true);
        try {
            await axiosInstance.post(`/bookings/${booking.id}/cancel`, { reason: cancelReason });
            toast.success('Đã hủy đặt phòng');
            setCancelOpen(false);
            setCancelReason('');
            fetchBooking();
        } catch (e: any) {
            toast.error(e.message || 'Không thể hủy đặt phòng');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return { bg: '#3B82F620', text: '#3B82F6', border: '#3B82F640', label: 'Chờ xác nhận' };
            case 'CONFIRMED': return { bg: '#8B5CF620', text: '#8B5CF6', border: '#8B5CF640', label: 'Đã xác nhận' };
            case 'CHECKED_IN': return { bg: '#10B98120', text: '#10B981', border: '#10B98140', label: 'Đang lưu trú' };
            case 'CHECKED_OUT': return { bg: '#6B728020', text: '#9CA3AF', border: '#4B5563', label: 'Đã trả phòng' };
            case 'CANCELLED': return { bg: '#EF444420', text: '#EF4444', border: '#EF444440', label: 'Đã hủy' };
            case 'NO_SHOW': return { bg: '#F9731620', text: '#F97316', border: '#F9731640', label: 'Không đến' };
            default: return { bg: '#3F3F46', text: '#fff', border: '#52525B', label: status };
        }
    };

    const getPaymentStr = (status: string) => {
        switch (status) {
            case 'UNPAID': return { label: 'Chưa thanh toán', color: 'text-red-400' };
            case 'PARTIAL': return { label: 'Đã cọc / Một phần', color: 'text-amber-400' };
            case 'PAID': return { label: 'Đã thanh toán đủ', color: 'text-emerald-400' };
            default: return { label: status, color: 'text-gray-500' };
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

    if (!booking) return (
        <div className="p-8 text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl text-gray-900 font-bold mb-2">Không tìm thấy đơn đặt phòng</h2>
            <Button variant="outline" className="border-gray-200 text-gray-600 mt-4" onClick={() => router.push('/dashboard/bookings')}>Quay lại danh sách</Button>
        </div>
    );

    const { guest, bookingRooms, payments, serviceUsages } = booking;
    const statusInfo = getStatusColor(booking.status);
    const paymentInfo = getPaymentStr(booking.paymentStatus);
    const nights = Math.max(1, differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn)));
    const serviceTotal = serviceUsages?.reduce((a: number, b: any) => a + (b.quantity * b.unitPrice || b.amount || 0), 0) || 0;
    const minibarTotal = minibar?.totalAmount ?? 0;
    const remaining = Math.max(0, booking.totalAmount - booking.paidAmount);

    const canConfirm = booking.status === 'PENDING';
    const canCheckIn = booking.status === 'CONFIRMED';
    const canCheckOut = booking.status === 'CHECKED_IN';
    const canPay = !['CANCELLED', 'NO_SHOW'].includes(booking.status) && remaining > 0;
    const canCancel = !['CANCELLED', 'CHECKED_OUT', 'NO_SHOW'].includes(booking.status);
    const canAddService = ['CONFIRMED', 'CHECKED_IN'].includes(booking.status);

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/bookings')} className="text-gray-500 hover:text-blue-700 hover:bg-gray-100 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Chi tiết Đặt phòng</h2>
                            <Badge style={{ backgroundColor: statusInfo.bg, color: statusInfo.text, borderColor: statusInfo.border }}>
                                {statusInfo.label}
                            </Badge>
                        </div>
                        <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm flex-wrap">
                            <Tag className="w-4 h-4" />
                            <span className="font-mono font-semibold text-gray-600">{booking.bookingCode}</span>
                            <span className="text-gray-400">|</span>
                            <Clock className="w-4 h-4" />
                            Tạo lúc {format(new Date(booking.createdAt), 'HH:mm - dd/MM/yyyy')}
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    {canConfirm && (
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white" onClick={handleConfirm} disabled={actionLoading}>
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Xác nhận
                        </Button>
                    )}
                    {canCheckIn && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCheckIn} disabled={actionLoading}>
                            <LogIn className="w-4 h-4 mr-1.5" /> Nhận phòng
                        </Button>
                    )}
                    {canCheckOut && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCheckOut} disabled={actionLoading}>
                            <LogOut className="w-4 h-4 mr-1.5" /> Trả phòng
                        </Button>
                    )}
                    {canPay && (
                        <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10" onClick={() => setPaymentOpen(true)}>
                            <Banknote className="w-4 h-4 mr-1.5" /> Ghi thu
                        </Button>
                    )}
                    {canAddService && (
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100" onClick={() => setServiceModalOpen(true)}>
                            <ConciergeBell className="w-4 h-4 mr-1.5" /> Thêm dịch vụ
                        </Button>
                    )}
                    {canCancel && (
                        <Button size="sm" variant="outline" className="border-red-800 text-red-400 hover:bg-red-900/20" onClick={() => setCancelOpen(true)}>
                            <XCircle className="w-4 h-4 mr-1.5" /> Hủy phòng
                        </Button>
                    )}
                </div>
            </div>

            {booking.status === 'CANCELLED' && booking.cancellationReason && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-semibold text-red-300">Đơn đã bị hủy</p>
                        <p className="text-sm mt-1">Lý do: {booking.cancellationReason}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: stay + services */}
                <div className="space-y-6 md:col-span-2">
                    <Card className="bg-gray-50 border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-200/50">
                            <CardTitle className="text-gray-900 text-lg">Hành trình lưu trú</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Nhận phòng</p>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-400" />
                                    {format(new Date(booking.checkIn), 'HH:mm, dd/MM/yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Trả phòng</p>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-rose-400" />
                                    {format(new Date(booking.checkOut), 'HH:mm, dd/MM/yyyy')}
                                </p>
                            </div>
                            <div className="col-span-2 pt-2">
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Phòng đã phân bổ</p>
                                {bookingRooms?.length > 0 ? bookingRooms.map((br: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200 mb-2">
                                        <div>
                                            <p className="text-gray-700 font-medium">{br.roomType?.name}</p>
                                            <p className="text-sm text-gray-400">Phòng: <span className="text-amber-400 font-semibold">{br.room?.roomNumber || 'Chưa gán'}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-600 text-sm">{br.price?.toLocaleString('vi-VN')}đ / đêm</p>
                                            <p className="text-gray-400 text-xs">{nights} đêm</p>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-400 italic text-sm">Chưa có thông tin phòng</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-200/50">
                            <CardTitle className="text-gray-900 text-lg flex justify-between items-center">
                                Dịch vụ sử dụng
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600">{serviceUsages?.length || 0} mục</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="divide-y divide-zinc-800 text-sm">
                                {serviceUsages?.length > 0 ? serviceUsages.map((svc: any) => (
                                    <li key={svc.id} className="p-4 flex justify-between items-center hover:bg-gray-100/30 transition-colors">
                                        <div>
                                            <p className="text-gray-900 font-medium">{svc.service?.name || svc.customName || 'Dịch vụ lẻ'}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {format(new Date(svc.createdAt), 'HH:mm dd/MM')}
                                                {svc.note && ` — ${svc.note}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-600">{svc.quantity} × {(svc.unitPrice || 0).toLocaleString('vi-VN')}đ</p>
                                            <p className="text-emerald-400 font-bold">{(svc.quantity * (svc.unitPrice || 0)).toLocaleString('vi-VN')}đ</p>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="p-6 text-center text-gray-400">Khách chưa sử dụng dịch vụ phụ trợ nào.</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Minibar consumption */}
                    <Card className="bg-gray-50 border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-200/50">
                            <CardTitle className="text-gray-900 text-lg flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-amber-500" />
                                    Minibar tiêu thụ
                                </span>
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                    {minibar?.transactions?.length || 0} mục
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="divide-y divide-zinc-800 text-sm">
                                {minibar?.transactions?.length ? minibar.transactions.map((tx: any) => (
                                    <li key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-100/30 transition-colors">
                                        <div>
                                            <p className="text-gray-900 font-medium">{tx.item?.name || 'Sản phẩm minibar'}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {tx.roomNumber && <span className="text-amber-500 font-medium">Phòng {tx.roomNumber} · </span>}
                                                {format(new Date(tx.createdAt), 'HH:mm dd/MM')}
                                                {tx.note && ` — ${tx.note}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-600">{tx.quantity} × {(tx.unitPrice || 0).toLocaleString('vi-VN')}đ</p>
                                            <p className="text-amber-500 font-bold">{(tx.totalPrice || 0).toLocaleString('vi-VN')}đ</p>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="p-6 text-center text-gray-400">Không có tiêu thụ minibar.</li>
                                )}
                            </ul>
                            {(minibar?.totalAmount ?? 0) > 0 && (
                                <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-amber-50/50">
                                    <span className="text-sm font-semibold text-gray-600">Tổng minibar</span>
                                    <span className="text-amber-600 font-bold">{minibarTotal.toLocaleString('vi-VN')}đ</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right: guest + payment */}
                <div className="space-y-6">
                    <Card className="bg-gray-50 border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-200/50">
                            <CardTitle className="text-gray-900 text-lg">Khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg shrink-0">
                                    {(guest?.name || 'W')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-bold">{guest?.name || 'Khách lẻ'}</p>
                                    <p className="text-xs text-gray-400">Nguồn: <span className="text-gray-600 uppercase">{booking.source || 'walk-in'}</span></p>
                                </div>
                            </div>
                            <Separator className="bg-gray-100" />
                            <div className="space-y-3 text-sm">
                                <div className="flex gap-2 items-center text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                    {guest?.phone || 'Chưa cập nhật SĐT'}
                                </div>
                                <div className="flex gap-2 items-center text-gray-600">
                                    <CreditCard className="w-4 h-4 text-gray-400 shrink-0" />
                                    {guest?.idNumber || 'Chưa cập nhật CCCD'}
                                </div>
                                <div className="flex gap-2 items-center text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                    {guest?.nationality || 'Chưa có quốc tịch'}
                                </div>
                                <div className="flex gap-2 items-center text-gray-600">
                                    <User className="w-4 h-4 text-gray-400 shrink-0" />
                                    {booking.adults} người lớn{booking.children > 0 ? `, ${booking.children} trẻ em` : ''}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border-gray-200">
                        <CardHeader className="pb-3 border-b border-gray-200/50">
                            <CardTitle className="text-gray-900 text-lg">Tóm tắt thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Trạng thái</span>
                                    <span className={`font-semibold ${paymentInfo.color}`}>{paymentInfo.label}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tiền phòng ({nights} đêm)</span>
                                    <span className="text-gray-600">{(booking.totalAmount - serviceTotal).toLocaleString('vi-VN')}đ</span>
                                </div>
                                {serviceTotal > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Dịch vụ / phụ thu</span>
                                        <span className="text-gray-600">{serviceTotal.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                )}
                                {minibarTotal > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Minibar</span>
                                        <span className="text-gray-600">{minibarTotal.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                )}
                            </div>
                            <Separator className="bg-gray-100" />
                            <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                                <span className="text-gray-600 uppercase text-xs font-bold">Tổng cộng</span>
                                <span className="text-rose-400 font-bold text-lg">{booking.totalAmount?.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <span className="text-gray-500 text-sm">Đã thu</span>
                                <span className="text-emerald-400 font-medium">{booking.paidAmount?.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="flex justify-between items-center px-1 pb-1">
                                <span className="text-gray-500 text-sm font-semibold">Còn lại</span>
                                <span className={`font-bold ${remaining > 0 ? 'text-rose-300' : 'text-gray-400'}`}>
                                    {remaining.toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {payments?.length > 0 && (
                        <Card className="bg-gray-50 border-gray-200">
                            <CardHeader className="pb-3 border-b border-gray-200/50">
                                <CardTitle className="text-gray-900 text-base">Lịch sử thu tiền</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ul className="divide-y divide-zinc-800 text-sm">
                                    {payments.map((p: any) => (
                                        <li key={p.id} className="p-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                    {p.amount?.toLocaleString('vi-VN')}đ
                                                </span>
                                                <span className="text-xs text-gray-400">{format(new Date(p.paidAt), 'dd/MM/yyyy HH:mm')}</span>
                                            </div>
                                            <div className="flex justify-between mt-1 text-xs">
                                                <span className="text-gray-400 uppercase">{p.method || p.paymentMethod}</span>
                                                <span className="text-gray-500 truncate max-w-[120px]">{p.notes || p.note || '—'}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Payment dialog */}
            <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
                <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Ghi nhận thanh toán</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-sm flex justify-between">
                            <span className="text-gray-500">Còn cần thu</span>
                            <span className="text-rose-400 font-bold">{remaining.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="space-y-2">
                            <Label>Số tiền (VND) <span className="text-red-400">*</span></Label>
                            <Input
                                type="number"
                                min="1"
                                placeholder="0"
                                value={paymentAmount}
                                onChange={e => setPaymentAmount(e.target.value)}
                                className="bg-gray-50 border-gray-200 text-gray-900 font-bold text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phương thức thanh toán</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-50 border-gray-200 text-gray-700">
                                    <SelectItem value="CASH">Tiền mặt</SelectItem>
                                    <SelectItem value="TRANSFER">Chuyển khoản</SelectItem>
                                    <SelectItem value="CARD">Thẻ ngân hàng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Ghi chú</Label>
                            <Input
                                placeholder="VD: Khách thanh toán phần còn lại..."
                                value={paymentNote}
                                onChange={e => setPaymentNote(e.target.value)}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="border-gray-200 text-gray-600" onClick={() => setPaymentOpen(false)}>Hủy</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAddPayment} disabled={actionLoading}>
                            Xác nhận thu tiền
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel dialog */}
            <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-400">Hủy đặt phòng</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-gray-500 text-sm">Hành động này không thể hoàn tác. Đơn đặt phòng <span className="font-mono text-gray-900 font-semibold">{booking.bookingCode}</span> sẽ bị hủy.</p>
                        <div className="space-y-2">
                            <Label>Lý do hủy <span className="text-red-400">*</span></Label>
                            <Input
                                placeholder="VD: Khách yêu cầu hủy, thay đổi kế hoạch..."
                                value={cancelReason}
                                onChange={e => setCancelReason(e.target.value)}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="border-gray-200 text-gray-600" onClick={() => setCancelOpen(false)}>Giữ lại</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCancel} disabled={actionLoading || !cancelReason.trim()}>
                            Xác nhận hủy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Service usage modal */}
            <ServiceUsageModal
                isOpen={serviceModalOpen}
                onClose={() => { setServiceModalOpen(false); fetchBooking(); }}
                booking={booking}
                propertyId={activePropertyId || ''}
            />
        </div>
    );
}
