'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, SlidersHorizontal, Plus, MoreHorizontal, ConciergeBell } from 'lucide-react';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useBookings } from '@/features/bookings/hooks/use-bookings';
import { ServiceUsageModal } from '@/features/bookings/components/ServiceUsageModal';
import { BookingModal } from '@/features/bookings/components/BookingModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/use-auth-store';

export default function BookingsPage() {
  const router = useRouter();
  const { activePropertyId: propertyId } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedBookingForService, setSelectedBookingForService] = useState<any>(null);

  const { data: bookings = [], isLoading } = useBookings(propertyId || '');

  const filteredBookings = bookings.filter((b: any) => {
    const matchesSearch = b.bookingCode?.toLowerCase().includes(search.toLowerCase()) || 
                         b.guest?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                         b.guest?.name?.toLowerCase().includes(search.toLowerCase()) ||
                         b.code?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === '' || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return { bg: '#3B82F620', text: '#3B82F6', border: '#3B82F640', label: 'Mới' };
      case 'CONFIRMED': return { bg: '#8B5CF620', text: '#8B5CF6', border: '#8B5CF640', label: 'Đã xác nhận' };
      case 'CHECKED_IN': return { bg: '#10B98120', text: '#10B981', border: '#10B98140', label: 'Đang lưu trú' };
      case 'CHECKED_OUT': return { bg: '#6B728020', text: '#9CA3AF', border: '#4B5563', label: 'Đã trả phòng' };
      case 'PENDING': return { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B40', label: 'Chờ xác nhận' };
      case 'CANCELLED': return { bg: '#EF444420', text: '#EF4444', border: '#EF444440', label: 'Đã hủy' };
      case 'NO_SHOW': return { bg: '#6B728020', text: '#9CA3AF', border: '#4B5563', label: 'Không đến' };
      default: return { bg: '#3F3F46', text: '#fff', border: '#52525B', label: status };
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'UNPAID': return <Badge variant="outline" className="text-red-400 border-red-400/30">Chưa thanh toán</Badge>;
      case 'PARTIAL': return <Badge variant="outline" className="text-amber-400 border-amber-400/30">Lệch toán</Badge>;
      case 'PAID': return <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">Đã thanh toán</Badge>;
      default: return null;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Đặt phòng</h2>
          <p className="text-gray-500 mt-1">Quản lý tất cả danh sách đặt phòng và lưu trú tại cơ sở.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsBookingModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tạo đặt phòng
          </Button>
        </div>
      </div>

      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 w-full sm:max-w-xs">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm mã ĐP, tên khách..."
                  className="w-full bg-white border-gray-200 pl-9 text-gray-900"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
              {['', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW'].map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  className={statusFilter === status ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-transparent text-gray-500 border-gray-200'}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === '' ? 'Tất cả' : getStatusColor(status).label}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="bg-transparent border-gray-200 text-gray-600 ml-auto sm:ml-2">
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Bộ lọc
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-white/50">
              <TableRow className="border-gray-200 hover:bg-transparent">
                <TableHead className="text-gray-500 font-medium w-[100px]">Mã ĐP</TableHead>
                <TableHead className="text-gray-500 font-medium">Khách hàng</TableHead>
                <TableHead className="text-gray-500 font-medium">Lịch trình</TableHead>
                <TableHead className="text-gray-500 font-medium hidden md:table-cell">Phòng</TableHead>
                <TableHead className="text-gray-500 font-medium text-right">Tổng tiền</TableHead>
                <TableHead className="text-gray-500 font-medium text-center text-[10px] md:text-sm">Thanh toán</TableHead>
                <TableHead className="text-gray-500 font-medium text-center w-[130px]">Trạng thái</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-gray-200">
                    <TableCell colSpan={8}>
                      <Skeleton className="h-12 w-full bg-gray-100" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredBookings.length === 0 ? (
                <TableRow className="border-gray-200">
                  <TableCell colSpan={8} className="h-32 text-center text-gray-400">Không tìm thấy đặt phòng nào</TableCell>
                </TableRow>
              ) : filteredBookings.map((booking: any) => {
                const statusInfo = getStatusColor(booking.status);
                return (
                  <TableRow key={booking.id} className="border-gray-200 hover:bg-gray-100/50 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}>
                    <TableCell className="font-medium text-gray-900">{booking.bookingCode || booking.code}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">{booking.guest?.fullName || booking.guest?.name}</span>
                        <span className="text-xs text-gray-400">{booking.source || 'Walk-in'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="text-gray-600">{format(new Date(booking.checkIn), 'dd/MM/yyyy')}</span>
                        <span className="text-gray-400">➜ {format(new Date(booking.checkOut), 'dd/MM/yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col">
                        {booking.bookingRooms?.[0] ? (
                          <>
                            <span className="text-gray-600 text-sm">{booking.bookingRooms[0].roomType?.name}</span>
                            <span className="text-xs text-gray-400">Phòng: {booking.bookingRooms[0].room?.roomNumber || 'Chưa xếp'}</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Chưa phân phòng</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-900">
                      {booking.totalAmount?.toLocaleString('vi-VN')} ₫
                    </TableCell>
                    <TableCell className="text-center">
                      {getPaymentBadge(booking.paymentStatus || 'UNPAID')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge style={{ backgroundColor: statusInfo.bg, color: statusInfo.text, borderColor: statusInfo.border }}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-700" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-50 border-gray-200 text-gray-600">
                          <DropdownMenuItem className="focus:bg-gray-100 focus:text-gray-900 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedBookingForService(booking); setIsServiceModalOpen(true); }}>
                            <ConciergeBell className="mr-2 h-4 w-4" /> Thêm Dịch vụ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent >
      </Card >

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        initialData={null}
      />

      <ServiceUsageModal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)} 
        booking={selectedBookingForService}
        propertyId={propertyId || ''}
      />
    </div>
  );
}
