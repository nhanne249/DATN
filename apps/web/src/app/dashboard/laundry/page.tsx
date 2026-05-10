'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, RefreshCw, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';
import axiosInstance from '@/lib/axios';
import { format } from 'date-fns';

const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang giặt',
    DONE: 'Hoàn thành',
    DELIVERED: 'Đã trả',
    CANCELLED: 'Đã huỷ',
};

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    DONE: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700',
};

const NEXT_STATUS: Record<string, string> = {
    PENDING: 'PROCESSING',
    PROCESSING: 'DONE',
    DONE: 'DELIVERED',
};

export default function LaundryPage() {
    const { activePropertyId } = useAuthStore();
    const propertyId = activePropertyId || '';

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Create dialog
    const [createOpen, setCreateOpen] = useState(false);
    const [form, setForm] = useState({ guestName: '', roomNumber: '', notes: '' });
    const [orderItems, setOrderItems] = useState([{ description: '', quantity: '1', pricePerUnit: '0', notes: '' }]);

    useEffect(() => {
        if (!propertyId) return;
        fetchOrders();
    }, [propertyId, filterStatus]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params: any = { propertyId };
            if (filterStatus) params.status = filterStatus;
            const res = await axiosInstance.get('/laundry', { params });
            setOrders(Array.isArray(res.data) ? res.data : res.data?.data || []);
        } catch { toast.error('Không thể tải đơn giặt ủi'); }
        finally { setLoading(false); }
    };

    const createOrder = async () => {
        if (!form.guestName) { toast.error('Nhập tên khách'); return; }
        if (orderItems.some(i => !i.description)) { toast.error('Điền mô tả cho tất cả mặt hàng'); return; }
        try {
            await axiosInstance.post('/laundry', {
                propertyId,
                guestName: form.guestName,
                roomNumber: form.roomNumber || undefined,
                notes: form.notes || undefined,
                items: orderItems.map(i => ({
                    description: i.description,
                    quantity: Number(i.quantity),
                    pricePerUnit: Number(i.pricePerUnit),
                    notes: i.notes || undefined,
                })),
            });
            toast.success('Đã tạo đơn giặt ủi');
            setCreateOpen(false);
            setForm({ guestName: '', roomNumber: '', notes: '' });
            setOrderItems([{ description: '', quantity: '1', pricePerUnit: '0', notes: '' }]);
            fetchOrders();
        } catch { toast.error('Tạo đơn thất bại'); }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await axiosInstance.patch(`/laundry/${id}/status`, { status });
            toast.success(`Đã cập nhật: ${STATUS_LABELS[status]}`);
            fetchOrders();
        } catch { toast.error('Cập nhật thất bại'); }
    };

    const deleteOrder = async (id: string) => {
        if (!confirm('Xoá đơn giặt ủi này?')) return;
        try {
            await axiosInstance.delete(`/laundry/${id}`);
            toast.success('Đã xoá');
            fetchOrders();
        } catch { toast.error('Xoá thất bại (chỉ xoá đơn PENDING)'); }
    };

    const addItem = () => setOrderItems(prev => [...prev, { description: '', quantity: '1', pricePerUnit: '0', notes: '' }]);
    const removeItem = (idx: number) => setOrderItems(prev => prev.filter((_, i) => i !== idx));
    const updateItem = (idx: number, field: string, value: string) =>
        setOrderItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));

    const totalAmount = (order: any) => order.totalAmount || order.items?.reduce((s: number, i: any) => s + i.quantity * i.pricePerUnit, 0) || 0;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Giặt ủi</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý đơn giặt ủi của khách</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={fetchOrders}><RefreshCw size={16} /></Button>
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus size={16} className="mr-2" /> Tạo đơn
                    </Button>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                {['', 'PENDING', 'PROCESSING', 'DONE', 'DELIVERED', 'CANCELLED'].map(s => (
                    <Button
                        key={s}
                        size="sm"
                        variant={filterStatus === s ? 'default' : 'outline'}
                        onClick={() => setFilterStatus(s)}
                    >
                        {s ? STATUS_LABELS[s] : 'Tất cả'}
                    </Button>
                ))}
            </div>

            {/* Orders List */}
            {loading ? (
                <p className="text-center text-gray-400 py-12">Đang tải...</p>
            ) : orders.length === 0 ? (
                <Card><CardContent className="py-12 text-center text-gray-400">Chưa có đơn nào</CardContent></Card>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-semibold">{order.guestName}</span>
                                            {order.roomNumber && <span className="text-sm text-gray-500">Phòng {order.roomNumber}</span>}
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                                                {STATUS_LABELS[order.status]}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')} •
                                            Tổng: <span className="font-semibold text-blue-600">{Number(totalAmount(order)).toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {NEXT_STATUS[order.status] && (
                                            <Button size="sm" variant="outline" onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}>
                                                → {STATUS_LABELS[NEXT_STATUS[order.status]]}
                                            </Button>
                                        )}
                                        {order.status === 'PENDING' && (
                                            <Button size="icon" variant="ghost" className="text-red-500 h-8 w-8" onClick={() => deleteOrder(order.id)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        )}
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                                            {expandedId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </Button>
                                    </div>
                                </div>

                                {expandedId === order.id && order.items?.length > 0 && (
                                    <div className="mt-4 border-t pt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Chi tiết đơn hàng</p>
                                        <div className="space-y-2">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                                                    <div>
                                                        <span className="font-medium">{item.description}</span>
                                                        {item.notes && <span className="text-gray-400 ml-2">({item.notes})</span>}
                                                        {item.stainPhotoUrl && (
                                                            <a href={item.stainPhotoUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 text-xs underline">Ảnh vết bẩn</a>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-gray-500">{item.quantity} × {Number(item.pricePerUnit).toLocaleString('vi-VN')}đ</span>
                                                        <span className="ml-3 font-semibold">{Number(item.quantity * item.pricePerUnit).toLocaleString('vi-VN')}đ</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {order.notes && <p className="text-sm text-gray-500 mt-3">Ghi chú: {order.notes}</p>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo đơn giặt ủi</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Tên khách *</label>
                                <Input className="mt-1" value={form.guestName} onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Số phòng</label>
                                <Input className="mt-1" value={form.roomNumber} onChange={e => setForm(f => ({ ...f, roomNumber: e.target.value }))} />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Ghi chú chung</label>
                            <Input className="mt-1" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">Danh sách quần áo</label>
                                <Button size="sm" variant="outline" onClick={addItem}><Plus size={14} className="mr-1" />Thêm</Button>
                            </div>
                            <div className="space-y-2">
                                {orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 items-start">
                                        <div className="flex-1">
                                            <Input placeholder="Mô tả (VD: Áo sơ mi trắng)" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} />
                                        </div>
                                        <Input className="w-20" type="number" min={1} placeholder="SL" value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} />
                                        <Input className="w-28" type="number" min={0} placeholder="Giá/cái" value={item.pricePerUnit} onChange={e => updateItem(idx, 'pricePerUnit', e.target.value)} />
                                        {orderItems.length > 1 && (
                                            <Button size="icon" variant="ghost" className="text-red-500 h-10 w-10 flex-shrink-0" onClick={() => removeItem(idx)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-right text-gray-600 mt-2">
                                Tổng: <span className="font-bold text-blue-600">
                                    {orderItems.reduce((s, i) => s + Number(i.quantity) * Number(i.pricePerUnit), 0).toLocaleString('vi-VN')}đ
                                </span>
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>Huỷ</Button>
                        <Button onClick={createOrder}>Tạo đơn</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
