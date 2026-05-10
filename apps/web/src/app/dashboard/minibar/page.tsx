'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Search, MoreHorizontal, FileEdit, Trash, ShoppingCart, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';
import axiosInstance from '@/lib/axios';
import { format } from 'date-fns';

export default function MinibarPage() {
    const { activePropertyId } = useAuthStore();
    const propertyId = activePropertyId || '';

    const [items, setItems] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Item dialog
    const [itemOpen, setItemOpen] = useState(false);
    const [itemForm, setItemForm] = useState({ id: '', name: '', description: '', price: '', unit: 'cái', imageUrl: '' });

    // Transaction dialog
    const [txOpen, setTxOpen] = useState(false);
    const [txForm, setTxForm] = useState({ itemId: '', quantity: '1', type: 'CONSUME', roomId: '', note: '' });

    useEffect(() => {
        if (!propertyId) return;
        fetchItems();
        fetchTransactions();
    }, [propertyId]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/minibar/items', { params: { propertyId } });
            setItems(Array.isArray(res.data) ? res.data : res.data?.data || []);
        } catch { toast.error('Không thể tải danh sách sản phẩm minibar'); }
        finally { setLoading(false); }
    };

    const fetchTransactions = async () => {
        try {
            const res = await axiosInstance.get('/minibar/transactions', { params: { propertyId } });
            setTransactions(Array.isArray(res.data) ? res.data : res.data?.data || []);
        } catch { /* silent */ }
    };

    const openCreateItem = () => {
        setItemForm({ id: '', name: '', description: '', price: '', unit: 'cái', imageUrl: '' });
        setItemOpen(true);
    };

    const openEditItem = (item: any) => {
        setItemForm({ id: item.id, name: item.name, description: item.description || '', price: String(item.price), unit: item.unit, imageUrl: item.imageUrl || '' });
        setItemOpen(true);
    };

    const saveItem = async () => {
        if (!itemForm.name || !itemForm.price) { toast.error('Vui lòng điền tên và giá'); return; }
        try {
            const payload = { ...itemForm, price: Number(itemForm.price), propertyId };
            if (itemForm.id) {
                await axiosInstance.put(`/minibar/items/${itemForm.id}`, payload);
                toast.success('Đã cập nhật sản phẩm');
            } else {
                await axiosInstance.post('/minibar/items', payload);
                toast.success('Đã thêm sản phẩm');
            }
            setItemOpen(false);
            fetchItems();
        } catch { toast.error('Lưu thất bại'); }
    };

    const deleteItem = async (id: string) => {
        if (!confirm('Xoá sản phẩm này?')) return;
        try {
            await axiosInstance.delete(`/minibar/items/${id}`);
            toast.success('Đã xoá');
            fetchItems();
        } catch { toast.error('Xoá thất bại'); }
    };

    const recordTransaction = async () => {
        if (!txForm.itemId || !txForm.quantity) { toast.error('Chọn sản phẩm và số lượng'); return; }
        try {
            await axiosInstance.post('/minibar/transactions', {
                propertyId,
                itemId: txForm.itemId,
                quantity: Number(txForm.quantity),
                type: txForm.type,
                roomId: txForm.roomId || undefined,
                note: txForm.note || undefined,
            });
            toast.success(txForm.type === 'CONSUME' ? 'Đã ghi nhận tiêu thụ' : 'Đã ghi nhận bổ sung');
            setTxOpen(false);
            fetchTransactions();
        } catch { toast.error('Ghi nhận thất bại'); }
    };

    const filteredItems = items.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Minibar</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý sản phẩm và ghi nhận tiêu thụ minibar</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setTxOpen(true)}>
                        <ShoppingCart size={16} className="mr-2" /> Ghi nhận
                    </Button>
                    <Button onClick={openCreateItem}>
                        <Plus size={16} className="mr-2" /> Thêm sản phẩm
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="items">
                <TabsList>
                    <TabsTrigger value="items">Danh mục sản phẩm</TabsTrigger>
                    <TabsTrigger value="transactions">Lịch sử giao dịch</TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Tìm sản phẩm..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <Button variant="ghost" size="icon" onClick={fetchItems}><RefreshCw size={16} /></Button>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-400 py-12">Đang tải...</p>
                    ) : filteredItems.length === 0 ? (
                        <Card><CardContent className="py-12 text-center text-gray-400">Chưa có sản phẩm nào</CardContent></Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredItems.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                                                <p className="text-lg font-bold text-blue-600 mt-2">
                                                    {Number(item.price).toLocaleString('vi-VN')}đ
                                                    <span className="text-sm font-normal text-gray-400 ml-1">/ {item.unit}</span>
                                                </p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditItem(item)}>
                                                        <FileEdit size={14} className="mr-2" /> Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => deleteItem(item.id)}>
                                                        <Trash size={14} className="mr-2" /> Xoá
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <Badge variant={item.isActive ? 'default' : 'secondary'} className="mt-3">
                                            {item.isActive ? 'Đang bán' : 'Ngừng bán'}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="transactions">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Lịch sử giao dịch minibar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {transactions.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">Chưa có giao dịch nào</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-gray-500">
                                                <th className="pb-3 pr-4">Thời gian</th>
                                                <th className="pb-3 pr-4">Sản phẩm</th>
                                                <th className="pb-3 pr-4">Loại</th>
                                                <th className="pb-3 pr-4">SL</th>
                                                <th className="pb-3 pr-4">Thành tiền</th>
                                                <th className="pb-3">Phòng</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {transactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-gray-50">
                                                    <td className="py-3 pr-4 text-gray-500">{format(new Date(tx.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                                                    <td className="py-3 pr-4 font-medium">{tx.item?.name || '—'}</td>
                                                    <td className="py-3 pr-4">
                                                        <Badge variant={tx.type === 'CONSUME' ? 'destructive' : 'default'} className="text-xs">
                                                            {tx.type === 'CONSUME' ? 'Tiêu thụ' : 'Bổ sung'}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 pr-4">{tx.quantity}</td>
                                                    <td className="py-3 pr-4 font-semibold text-blue-600">
                                                        {Number(tx.totalPrice).toLocaleString('vi-VN')}đ
                                                    </td>
                                                    <td className="py-3 text-gray-500">{tx.roomId || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Item Dialog */}
            <Dialog open={itemOpen} onOpenChange={setItemOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{itemForm.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm minibar'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="text-sm font-medium">Tên sản phẩm *</label>
                            <Input className="mt-1" value={itemForm.name} onChange={e => setItemForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Nước khoáng Evian" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Giá (VNĐ) *</label>
                                <Input className="mt-1" type="number" value={itemForm.price} onChange={e => setItemForm(f => ({ ...f, price: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Đơn vị</label>
                                <Input className="mt-1" value={itemForm.unit} onChange={e => setItemForm(f => ({ ...f, unit: e.target.value }))} />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Mô tả</label>
                            <Input className="mt-1" value={itemForm.description} onChange={e => setItemForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setItemOpen(false)}>Huỷ</Button>
                        <Button onClick={saveItem}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Transaction Dialog */}
            <Dialog open={txOpen} onOpenChange={setTxOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ghi nhận tiêu thụ / bổ sung</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="text-sm font-medium">Loại</label>
                            <Select value={txForm.type} onValueChange={v => setTxForm(f => ({ ...f, type: v }))}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CONSUME">Tiêu thụ</SelectItem>
                                    <SelectItem value="RESTOCK">Bổ sung</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Sản phẩm *</label>
                            <Select value={txForm.itemId} onValueChange={v => setTxForm(f => ({ ...f, itemId: v }))}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn sản phẩm" /></SelectTrigger>
                                <SelectContent>
                                    {items.filter(i => i.isActive).map(i => (
                                        <SelectItem key={i.id} value={i.id}>{i.name} - {Number(i.price).toLocaleString('vi-VN')}đ</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Số lượng *</label>
                                <Input className="mt-1" type="number" min={1} value={txForm.quantity} onChange={e => setTxForm(f => ({ ...f, quantity: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phòng (tuỳ chọn)</label>
                                <Input className="mt-1" value={txForm.roomId} onChange={e => setTxForm(f => ({ ...f, roomId: e.target.value }))} placeholder="Số phòng" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Ghi chú</label>
                            <Input className="mt-1" value={txForm.note} onChange={e => setTxForm(f => ({ ...f, note: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTxOpen(false)}>Huỷ</Button>
                        <Button onClick={recordTransaction}>Xác nhận</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
