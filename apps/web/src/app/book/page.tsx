'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Calendar as CalendarIcon,
    Users,
    Building,
    Check,
    ArrowRight,
    Loader2,
    CheckCircle2,
    Phone,
    Mail,
    User,
    MessageSquare,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format, addDays, differenceInCalendarDays } from 'date-fns';
import { vi } from 'date-fns/locale';

interface AvailableRoomType {
    id: string;
    name: string;
    description?: string;
    basePrice: number;
    weekendPrice?: number;
    maxAdults: number;
    maxChildren: number;
    amenities: string[];
    photos: string[];
    availableCount: number;
}

interface BookingFormData {
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    notes: string;
}

const FALLBACK_ROOM_IMAGE = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80';

function BookingPage() {
    const searchParams = useSearchParams();
    const propertySlug = searchParams.get('property') || 'default';

    const [date, setDate] = useState<{ from: Date; to: Date | undefined }>({
        from: new Date(),
        to: addDays(new Date(), 2),
    });
    const [guests, setGuests] = useState({ adults: 2, children: 0 });
    const [rooms, setRooms] = useState<AvailableRoomType[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [selectedRoom, setSelectedRoom] = useState<AvailableRoomType | null>(null);
    const [bookingForm, setBookingForm] = useState<BookingFormData>({
        guestName: '',
        guestPhone: '',
        guestEmail: '',
        notes: '',
    });
    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingResult, setBookingResult] = useState<{ code: string } | null>(null);

    const nights =
        date.from && date.to
            ? Math.max(1, differenceInCalendarDays(date.to, date.from))
            : 1;

    const handleSearch = async () => {
        if (!date.from || !date.to) {
            setSearchError('Vui lòng chọn ngày nhận và trả phòng.');
            return;
        }
        setIsSearching(true);
        setSearchError(null);
        setHasSearched(false);
        try {
            const checkIn = format(date.from, 'yyyy-MM-dd');
            const checkOut = format(date.to, 'yyyy-MM-dd');
            const res = await fetch(
                `/api/public/${propertySlug}/availability?checkIn=${checkIn}&checkOut=${checkOut}`,
            );
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json?.message || 'Không thể tải dữ liệu phòng.');
            }
            const data: AvailableRoomType[] = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
            setRooms(data);
            setHasSearched(true);
        } catch (err: unknown) {
            setSearchError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectRoom = (room: AvailableRoomType) => {
        setSelectedRoom(room);
        setBookingError(null);
        setBookingResult(null);
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRoom || !date.from || !date.to) return;
        if (!bookingForm.guestName.trim() || !bookingForm.guestPhone.trim()) {
            setBookingError('Vui lòng nhập họ tên và số điện thoại.');
            return;
        }
        setIsBooking(true);
        setBookingError(null);
        try {
            const checkIn = format(date.from, 'yyyy-MM-dd');
            const checkOut = format(date.to, 'yyyy-MM-dd');
            const payload = {
                guestName: bookingForm.guestName.trim(),
                guestPhone: bookingForm.guestPhone.trim(),
                ...(bookingForm.guestEmail.trim() ? { guestEmail: bookingForm.guestEmail.trim() } : {}),
                ...(bookingForm.notes.trim() ? { notes: bookingForm.notes.trim() } : {}),
                roomTypeId: selectedRoom.id,
                checkIn,
                checkOut,
                adults: guests.adults,
                children: guests.children,
            };
            const res = await fetch(`/api/public/${propertySlug}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json?.message || 'Đặt phòng thất bại.');
            }
            const data = json?.data ?? json;
            setBookingResult({ code: data.code });
        } catch (err: unknown) {
            setBookingError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsBooking(false);
        }
    };

    const handleCloseDialog = () => {
        setSelectedRoom(null);
        setBookingForm({ guestName: '', guestPhone: '', guestEmail: '', notes: '' });
        setBookingError(null);
        setBookingResult(null);
    };

    const handleNewSearch = () => {
        setBookingResult(null);
        handleCloseDialog();
        handleSearch();
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-sans">
            {/* Navbar */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building className="h-6 w-6 text-blue-600" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            GoHost Hotel
                        </span>
                    </div>
                    <nav className="hidden md:flex flex-1 justify-center space-x-8 text-sm font-medium text-gray-400">
                        <a href="#" className="hover:text-blue-600 transition-colors">Trang chủ</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Loại phòng</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Dịch vụ</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Liên hệ</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="hidden sm:flex" asChild>
                            <a href="/dashboard">Cổng Nhân Viên</a>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-c6a4d14b8fc4?w=1920&q=80"
                        alt="Luxury Hotel"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 drop-shadow-md">
                        Nghỉ Dưỡng Đẳng Cấp
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto drop-shadow">
                        Trải nghiệm không gian sang trọng, dịch vụ hoàn hảo tại GoHost Hotel.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white p-3 md:p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3">
                        {/* Date Picker */}
                        <div className="flex-1">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full h-14 justify-start text-left font-normal bg-zinc-50 border-zinc-200 hover:bg-zinc-100 rounded-xl px-4"
                                    >
                                        <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider leading-none">
                                                Ngày Nhận - Trả
                                            </span>
                                            <span className="text-zinc-900 leading-none">
                                                {date?.from ? (
                                                    date.to ? (
                                                        <>
                                                            {format(date.from, 'dd/MM/yyyy')} -{' '}
                                                            {format(date.to, 'dd/MM/yyyy')}
                                                        </>
                                                    ) : (
                                                        format(date.from, 'dd/MM/yyyy')
                                                    )
                                                ) : (
                                                    <span>Chọn ngày</span>
                                                )}
                                            </span>
                                        </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date as never}
                                        onSelect={setDate as never}
                                        numberOfMonths={2}
                                        locale={vi}
                                        disabled={(day) =>
                                            day < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Guests Picker */}
                        <div className="flex-1 md:max-w-[280px]">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full h-14 justify-start text-left font-normal bg-zinc-50 border-zinc-200 hover:bg-zinc-100 rounded-xl px-4"
                                    >
                                        <Users className="mr-3 h-5 w-5 text-gray-400" />
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider leading-none">
                                                Số lượng khách
                                            </span>
                                            <span className="text-zinc-900 leading-none">
                                                {guests.adults} Người lớn
                                                {guests.children > 0 && `, ${guests.children} Trẻ em`}
                                            </span>
                                        </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Người lớn</span>
                                            <div className="flex gap-3 items-center">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        setGuests((prev) => ({
                                                            ...prev,
                                                            adults: Math.max(1, prev.adults - 1),
                                                        }))
                                                    }
                                                >
                                                    -
                                                </Button>
                                                <span>{guests.adults}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        setGuests((prev) => ({
                                                            ...prev,
                                                            adults: prev.adults + 1,
                                                        }))
                                                    }
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Trẻ em</span>
                                            <div className="flex gap-3 items-center">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        setGuests((prev) => ({
                                                            ...prev,
                                                            children: Math.max(0, prev.children - 1),
                                                        }))
                                                    }
                                                >
                                                    -
                                                </Button>
                                                <span>{guests.children}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        setGuests((prev) => ({
                                                            ...prev,
                                                            children: prev.children + 1,
                                                        }))
                                                    }
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Search Button */}
                        <Button
                            className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold shadow-lg shadow-blue-600/20"
                            onClick={handleSearch}
                            disabled={isSearching || !date.from || !date.to}
                        >
                            {isSearching ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Đang tìm...
                                </>
                            ) : (
                                'TÌM PHÒNG'
                            )}
                        </Button>
                    </div>

                    {searchError && (
                        <p className="mt-3 text-red-300 text-sm font-medium">{searchError}</p>
                    )}
                </div>
            </div>

            {/* Room Results */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {isSearching ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                        <p className="text-gray-500 text-lg">Đang tìm phòng trống...</p>
                    </div>
                ) : hasSearched ? (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900">
                                {rooms.length > 0
                                    ? `${rooms.length} loại phòng còn trống`
                                    : 'Không có phòng trống'}
                            </h2>
                            <p className="text-gray-400 hidden md:block">
                                {format(date.from, 'dd/MM/yyyy', { locale: vi })} →{' '}
                                {date.to && format(date.to, 'dd/MM/yyyy', { locale: vi })} •{' '}
                                {nights} đêm • {guests.adults} người lớn
                                {guests.children > 0 && `, ${guests.children} trẻ em`}
                            </p>
                        </div>

                        {rooms.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-400 text-lg mb-6">
                                    Rất tiếc, không còn phòng trống cho ngày bạn chọn.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setHasSearched(false)}
                                >
                                    Chọn ngày khác
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {rooms.map((room) => {
                                    const photo =
                                        Array.isArray(room.photos) && room.photos.length > 0
                                            ? room.photos[0]
                                            : FALLBACK_ROOM_IMAGE;
                                    const amenities: string[] = Array.isArray(room.amenities)
                                        ? room.amenities
                                        : [];
                                    const totalPrice = room.basePrice * nights;

                                    return (
                                        <Card
                                            key={room.id}
                                            className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-2xl"
                                        >
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={photo}
                                                    alt={room.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            FALLBACK_ROOM_IMAGE;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <div className="absolute top-4 right-4">
                                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-xs">
                                                        Còn {room.availableCount} phòng
                                                    </Badge>
                                                </div>
                                                <div className="absolute bottom-4 left-4 text-white">
                                                    <h3 className="text-2xl font-bold">{room.name}</h3>
                                                    <p className="text-sm opacity-90 mt-1">
                                                        Tối đa {room.maxAdults} người lớn
                                                        {room.maxChildren > 0 &&
                                                            `, ${room.maxChildren} trẻ em`}
                                                    </p>
                                                </div>
                                            </div>

                                            <CardContent className="p-6 bg-white">
                                                {amenities.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {amenities.slice(0, 3).map((am) => (
                                                            <span
                                                                key={am}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-100 text-gray-500 text-xs font-medium"
                                                            >
                                                                <Check className="h-3 w-3 text-emerald-500" />
                                                                {am}
                                                            </span>
                                                        ))}
                                                        {amenities.length > 3 && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded bg-zinc-100 text-gray-400 text-xs font-medium">
                                                                +{amenities.length - 3} nữa
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-end justify-between mt-auto">
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                                                            Giá mỗi đêm từ
                                                        </p>
                                                        <span className="text-2xl font-bold text-zinc-900">
                                                            {room.basePrice.toLocaleString('vi-VN')}₫
                                                        </span>
                                                        {nights > 1 && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                Tổng {nights} đêm:{' '}
                                                                <span className="font-semibold text-blue-600">
                                                                    {totalPrice.toLocaleString('vi-VN')}₫
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 group"
                                                        onClick={() => handleSelectRoom(room)}
                                                    >
                                                        Chọn phòng
                                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <CalendarIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">
                            Chọn ngày nhận và trả phòng rồi nhấn <strong>TÌM PHÒNG</strong> để xem phòng trống.
                        </p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 text-gray-500 py-12 mt-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Building className="h-6 w-6 text-gray-400" />
                        <span className="text-xl font-bold text-gray-800">GoHost Hotel</span>
                    </div>
                    <p className="text-sm">© 2026 GoHost. All rights reserved.</p>
                </div>
            </footer>

            {/* Booking Dialog */}
            <Dialog open={!!selectedRoom} onOpenChange={(open) => !open && handleCloseDialog()}>
                <DialogContent className="sm:max-w-md">
                    {bookingResult ? (
                        /* Success Screen */
                        <div className="text-center py-4">
                            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                            <DialogHeader>
                                <DialogTitle className="text-xl text-center">Đặt phòng thành công!</DialogTitle>
                                <DialogDescription className="text-center mt-2">
                                    Yêu cầu của bạn đã được ghi nhận.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-sm text-gray-500 mb-1">Mã đặt phòng của bạn</p>
                                <p className="text-3xl font-bold text-blue-600 tracking-widest">
                                    {bookingResult.code}
                                </p>
                            </div>
                            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800 text-left space-y-1">
                                <p className="font-semibold">Bước tiếp theo:</p>
                                <p>• Lễ tân sẽ liên hệ xác nhận đặt phòng với bạn.</p>
                                <p>• Nếu cần đặt cọc, lễ tân sẽ hướng dẫn chi tiết.</p>
                                <p>• Vui lòng giữ mã đặt phòng để tra cứu.</p>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={handleCloseDialog}>
                                    Đóng
                                </Button>
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleNewSearch}>
                                    Đặt phòng khác
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* Booking Form */
                        <form onSubmit={handleBookingSubmit}>
                            <DialogHeader>
                                <DialogTitle>Thông tin đặt phòng</DialogTitle>
                                <DialogDescription>
                                    {selectedRoom?.name} •{' '}
                                    {date.from && format(date.from, 'dd/MM/yyyy')} →{' '}
                                    {date.to && format(date.to, 'dd/MM/yyyy')} • {nights} đêm
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-5 space-y-4">
                                <div className="p-3 bg-zinc-50 rounded-lg text-sm text-zinc-600">
                                    Tổng tiền dự kiến:{' '}
                                    <span className="font-bold text-zinc-900 text-base">
                                        {selectedRoom
                                            ? (selectedRoom.basePrice * nights).toLocaleString('vi-VN')
                                            : 0}
                                        ₫
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="guestName" className="flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5" /> Họ và tên <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="guestName"
                                        placeholder="Nguyễn Văn A"
                                        value={bookingForm.guestName}
                                        onChange={(e) =>
                                            setBookingForm((f) => ({ ...f, guestName: e.target.value }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="guestPhone" className="flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5" /> Số điện thoại <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="guestPhone"
                                        placeholder="0912 345 678"
                                        type="tel"
                                        value={bookingForm.guestPhone}
                                        onChange={(e) =>
                                            setBookingForm((f) => ({ ...f, guestPhone: e.target.value }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="guestEmail" className="flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5" /> Email
                                    </Label>
                                    <Input
                                        id="guestEmail"
                                        placeholder="example@email.com"
                                        type="email"
                                        value={bookingForm.guestEmail}
                                        onChange={(e) =>
                                            setBookingForm((f) => ({ ...f, guestEmail: e.target.value }))
                                        }
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="notes" className="flex items-center gap-1.5">
                                        <MessageSquare className="h-3.5 w-3.5" /> Ghi chú
                                    </Label>
                                    <Input
                                        id="notes"
                                        placeholder="Yêu cầu đặc biệt, giờ đến dự kiến..."
                                        value={bookingForm.notes}
                                        onChange={(e) =>
                                            setBookingForm((f) => ({ ...f, notes: e.target.value }))
                                        }
                                    />
                                </div>

                                {bookingError && (
                                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-700">
                                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        {bookingError}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleCloseDialog}
                                        disabled={isBooking}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                        disabled={isBooking}
                                    >
                                        {isBooking ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang gửi...
                                            </>
                                        ) : (
                                            'Xác nhận đặt phòng'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function BookingEnginePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>}>
            <BookingPage />
        </Suspense>
    );
}
