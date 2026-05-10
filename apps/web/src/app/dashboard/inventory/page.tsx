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
import {
    Plus, Search, RefreshCw, MoreHorizontal, FileEdit, Trash,
    ArrowDownCircle, ArrowUpCircle, AlertTriangle, Package,
} from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';
import axiosInstance from '@/lib/axios';
import { format } from 'date-fns';

export default function InventoryPage() {
    const { activePropertyId } = useAuthStore();
    const propertyId = activePropertyId || '';

    const [items, setItems] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [lowStock, setLowStock] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Item dialog
    const [itemOpen, setItemOpen] = useState(false);
    const [itemForm, setItemForm] = useState({ id: '', name: '', description: '', unit: 'cái', category: '', minStock: '0', unitCost: '' });

    // Transaction dialog
    const [txOpen, setTxOpen] = useState(false);
    const [txForm, setTxForm] = useState({ itemId: '', type: 'IN', quantity: '1', unitCost: '', note: '' });

    useEffect(() => {
        if (!propertyId) return;
        fetchAll();
    }, [propertyId]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [itemsRes, txRes, lowRes] = await Promise.all([
                axiosInstance.get('/inventory/items', { params: { propertyId } }),
                axiosInstance.get('/inventory/transactions', { params: { propertyId } }),
                axiosInstance.get('/inventory/items/low-stock', { params: { propertyId } }),
            ]);
            setItems(Array.isArray(itemsRes.data) ? itemsRes.data : itemsRes.data?.data || []);
            setTransactions(Array.isArray(txRes.data) ? txRes.data : txRes.data?.data || []);
            setLowStock(Array.isArray(lowRes.data) ? lowRes.data : lowRes.data?.data || []);
        } catch { toast.error('Không thể tải dữ liệu kho'); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setItemForm({ id: '', name: '', description: '', unit: 'cái', category: '', minStock: '0', unitCost: '' });
        setItemOpen(true);
    };

    const openEdit = (item: any) => {
        setItemForm({
            id: item.id, name: item.name, description: item.description || '',
            unit: item.unit, category: item.category || '', minStock: String(item.minStock),
            unitCost: item.unitCost ? String(item.unitCost) : '',
        });
        setItemOpen(true);
    };

    const saveItem = async () => {
        if (!itemForm.name) { toast.error('Nhập tên mặt hàng'); return; }
        try {
            const payload = {
                ...itemForm,
                minStock: Number(itemForm.minStock),
                unitCost: itemForm.unitCost ? Number(itemForm.unitCost) : undefined,
                propertyId,
            };
            if (itemForm.id) {
                await axiosInstance.put(`/inventory/items/${itemForm.id}`, payload);
                toast.success('Đã cập nhật');
            } else {
                await axiosInstance.post('/inventory/items', payload);
                toast.success('Đã thêm mặt hàng');
            }
            setItemOpen(false);
            fetchAll();
        } catch { toast.error('Lưu thất bại'); }
    };

    const deleteItem = async (id: string) => {
        if (!confirm('Xoá mặt hàng này?')) return;
        try {
            await axiosInstance.delete(`/inventory/items/${id}`);
            toast.success('Đã xoá');
            fetchAll();
        } catch { toast.error('Xoá thất bại'); }
    };

    const recordTx = async () => {
        if (!txForm.itemId || !txForm.quantity) { toast.error('Chọn mặt hàng và số lượng'); return; }
        try {
            await axiosInstance.post('/inventory/transactions', {
                propertyId,
                itemId: txForm.itemId,
                type: txForm.type,
                quantity: Number(txForm.quantity),
                unitCost: txForm.unitCost ? Number(txForm.unitCost) : undefined,
                note: txForm.note || undefined,
            });
            toast.success('Đã ghi nhận phiếu kho');
            setTxOpen(false);
            fetchAll();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Ghi nhận thất bại');
        }
    };

    const grouped = items.reduce((acc: any, item: any) => {
        const cat = item.category || 'Chưa phân loại';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    const filtered = Object.fromEntries(
        Object.entries(grouped).map(([cat, catItems]) => [
            cat,
            (catItems as any[]).filter(i => i.name?.toLowerCase().includes(search.toLowerCase())),
        ]).filter(([, catItems]) => (catItems as any[]).length > 0)
    );

    const TX_ICONS: Record<string, any> = {
        IN: <ArrowDownCircle size={16} className="text-green-600" />,
        OUT: <ArrowUpCircle size={16} className="text-red-500" />,
        ADJUSTMENT: <Package size={16} className="text-blue-500" />,
    };
    const TX_LABELS: Record<string, string> = { IN: 'Nhập kho', OUT: 'Xuất kho', ADJUSTMENT: 'Điều chỉnh' };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý kho</h1>
                    <p className="text-sm text-gray-500 mt-1">Theo dõi tồn kho và phiếu nhập/xuất</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setTxForm({ itemId: '', type: 'IN', quantity: '1', unitCost: '', note: '' }); setTxOpen(true); }}>
                        <ArrowDownCircle size={16} className="mr-2" /> Phiếu kho
                    </Button>
                    <Button onClick={openCreate}>
                        <Plus size={16} className="mr-2" /> Thêm mặt hàng
                    </Button>
                </div>
            </div>

            {/* Low stock alert */}
            {lowStock.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-orange-700 font-medium mb-2">
                            <AlertTriangle size={16} /> {lowStock.length} mặt hàng sắp hết tồn kho
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {lowStock.map(i => (
                                <Badge key={i.id} variant="outline" className="border-orange-300 text-orange-700">
                                    {i.name}: {i.currentStock} {i.unit} (tối thiểu: {i.minStock})
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="items">
                <TabsList>
                    <TabsTrigger value="items">Danh mục kho ({items.length})</TabsTrigger>
                    <TabsTrigger value="transactions">Phiếu nhập/xuất</TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Tìm mặt hàng..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <Button variant="ghost" size="icon" onClick={fetchAll}><RefreshCw size={16} /></Button>
                    </div>

                    {loading ? <p className="text-center text-gray-400 py-12">Đang tải...</p>
                        : Object.keys(filtered).length === 0 ? (
                            <Card><CardContent className="py-12 text-center text-gray-400">Chưa có mặt hàng nào</CardContent></Card>
                        ) : Object.entries(filtered).map(([category, catItems]) => (
                            <Card key={category}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base text-gray-700">{category}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b text-left text-gray-500">
                                                    <th className="pb-2 pr-4">Tên</th>
                                                    <th className="pb-2 pr-4">Tồn kho</th>
                                                    <th className="pb-2 pr-4">Tối thiểu</th>
                                                    <th className="pb-2 pr-4">Đơn vị</th>
                                                    <th className="pb-2 pr-4">Giá nhập</th>
                                                    <th className="pb-2"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {(catItems as any[]).map((item: any) => (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="py-3 pr-4 font-medium">{item.name}</td>
                                                        <td className="py-3 pr-4">
                                                            <span className={`font-bold ${item.currentStock <= item.minStock ? 'text-red-600' : 'text-green-700'}`}>
                                                                {item.currentStock}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 pr-4 text-gray-500">{item.minStock}</td>
                                                        <td className="py-3 pr-4 text-gray-500">{item.unit}</td>
                                                        <td className="py-3 pr-4 text-gray-500">
                                                            {item.unitCost ? `${Number(item.unitCost).toLocaleString('vi-VN')}đ` : '—'}
                                                        </td>
                                                        <td className="py-3">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                        <MoreHorizontal size={16} />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => openEdit(item)}>
                                                                        <FileEdit size={14} className="mr-2" /> Chỉnh sửa
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="text-red-600" onClick={() => deleteItem(item.id)}>
                                                                        <Trash size={14} className="mr-2" /> Xoá
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }
                </TabsContent>

                <TabsContent value="transactions">
                    <Card>
                        <CardContent className="p-0">
                            {transactions.length === 0 ? (
                                <p className="text-center text-gray-400 py-12">Chưa có phiếu nào</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-gray-500 bg-gray-50">
                                                <th className="p-4 pr-4">Thời gian</th>
                                                <th className="p-4 pr-4">Loại</th>
                                                <th className="p-4 pr-4">Mặt hàng</th>
                                                <th className="p-4 pr-4">SL</th>
                                                <th className="p-4 pr-4">Trước → Sau</th>
                                                <th className="p-4">Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {transactions.map((tx: any) => (
                                                <tr key={tx.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{format(new Date(tx.createdAt), 'dd/MM/yyyy HH:mm')}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            {TX_ICONS[tx.type]}
                                                            <span>{TX_LABELS[tx.type]}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium">{tx.item?.name || '—'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`font-bold ${tx.type === 'IN' ? 'text-green-600' : tx.type === 'OUT' ? 'text-red-600' : 'text-blue-600'}`}>
                                                            {tx.type === 'IN' ? '+' : tx.type === 'OUT' ? '-' : '='}{tx.quantity}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">{tx.stockBefore} → {tx.stockAfter}</td>
                                                    <td className="px-4 py-3 text-gray-500">{tx.note || '—'}</td>
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
                        <DialogTitle>{itemForm.id ? 'Chỉnh sửa mặt hàng' : 'Thêm mặt hàng'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="text-sm font-medium">Tên mặt hàng *</label>
                            <Input className="mt-1" value={itemForm.name} onChange={e => setItemForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Đơn vị</label>
                                <Input className="mt-1" value={itemForm.unit} onChange={e => setItemForm(f => ({ ...f, unit: e.target.value }))} placeholder="cái, kg, lít..." />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Danh mục</label>
                                <Input className="mt-1" value={itemForm.category} onChange={e => setItemForm(f => ({ ...f, category: e.target.value }))} placeholder="VD: Vệ sinh, Đồ uống..." />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Tồn kho tối thiểu</label>
                                <Input className="mt-1" type="number" min={0} value={itemForm.minStock} onChange={e => setItemForm(f => ({ ...f, minStock: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Giá nhập (VNĐ)</label>
                                <Input className="mt-1" type="number" min={0} value={itemForm.unitCost} onChange={e => setItemForm(f => ({ ...f, unitCost: e.target.value }))} />
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
                        <DialogTitle>Tạo phiếu kho</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="text-sm font-medium">Loại phiếu</label>
                            <Select value={txForm.type} onValueChange={v => setTxForm(f => ({ ...f, type: v }))}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IN">Nhập kho</SelectItem>
                                    <SelectItem value="OUT">Xuất kho</SelectItem>
                                    <SelectItem value="ADJUSTMENT">Điều chỉnh tồn kho</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Mặt hàng *</label>
                            <Select value={txForm.itemId} onValueChange={v => setTxForm(f => ({ ...f, itemId: v }))}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Chọn mặt hàng" /></SelectTrigger>
                                <SelectContent>
                                    {items.map(i => (
                                        <SelectItem key={i.id} value={i.id}>{i.name} (tồn: {i.currentStock} {i.unit})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">
                                    {txForm.type === 'ADJUSTMENT' ? 'Tồn kho mới' : 'Số lượng'} *
                                </label>
                                <Input className="mt-1" type="number" min={0} value={txForm.quantity} onChange={e => setTxForm(f => ({ ...f, quantity: e.target.value }))} />
                            </div>
                            {txForm.type === 'IN' && (
                                <div>
                                    <label className="text-sm font-medium">Giá nhập (VNĐ)</label>
                                    <Input className="mt-1" type="number" min={0} value={txForm.unitCost} onChange={e => setTxForm(f => ({ ...f, unitCost: e.target.value }))} />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Ghi chú</label>
                            <Input className="mt-1" value={txForm.note} onChange={e => setTxForm(f => ({ ...f, note: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTxOpen(false)}>Huỷ</Button>
                        <Button onClick={recordTx}>Xác nhận</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
