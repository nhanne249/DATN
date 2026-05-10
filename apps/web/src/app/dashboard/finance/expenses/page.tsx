'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Plus, Search, DollarSign, FolderOpen, MoreHorizontal, FileEdit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/use-auth-store';
import axiosInstance from '@/lib/axios';

export default function ExpensesPage() {
    const { activePropertyId } = useAuthStore();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isOpen, setIsOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ id: '', name: '' });
    const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';

    const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        id: '',
        title: '',
        category: '',
        newCategoryName: '',
        amount: '',
        description: '',
        code: ''
    });

    useEffect(() => {
        if (!propertyId) return;
        fetchExpenses();
        fetchCategories();
    }, [propertyId]);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/finance/expenses', { params: { propertyId } });
            const data = res.data;
            setExpenses(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error("Failed to load expenses", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get('/settings/categories', { params: { propertyId } });
            const data = res.data;
            setCategories(Array.isArray(data) ? data.filter((c: any) => c.type === 'expense') : []);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    const handleCreateExpense = async () => {
        let finalCategory = formData.category;

        if (formData.category === 'new' && formData.newCategoryName.trim()) {
            try {
                const catRes = await axiosInstance.post('/settings/categories', {
                    name: formData.newCategoryName.trim(),
                    type: 'expense',
                    propertyId
                });
                finalCategory = catRes.data.name;
            } catch (error: any) {
                toast.error(error.message || "Lỗi khi tạo danh mục mới");
                return;
            }
        }

        try {
            const isEditing = !!formData.id;
            const payload = {
                title: formData.title,
                code: formData.code || undefined,
                category: finalCategory,
                amount: Number(formData.amount),
                description: formData.description,
                propertyId
            };

            if (isEditing) {
                await axiosInstance.patch(`/finance/expenses/${formData.id}`, payload);
            } else {
                await axiosInstance.post('/finance/expenses', payload);
            }

            toast.success(isEditing ? "Cập nhật phiếu chi thành công!" : "Tạo phiếu chi thành công!");
            setIsOpen(false);
            setFormData({ id: '', title: '', category: '', newCategoryName: '', amount: '', description: '', code: '' });
            fetchExpenses();
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message || "Lỗi kết nối máy chủ");
        }
    };

    const handleEditExpense = (expense: any) => {
        setFormData({
            id: expense.id,
            title: expense.title || '',
            category: expense.category || '',
            newCategoryName: '',
            amount: expense.amount ? expense.amount.toString() : '',
            description: expense.description || '',
            code: expense.code || ''
        });
        setIsOpen(true);
    };

    const handleDeleteExpense = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa phiếu chi này? Hành động này không thể hoàn tác.')) return;
        try {
            await axiosInstance.delete(`/finance/expenses/${id}`);
            toast.success('Xóa phiếu chi thành công');
            fetchExpenses();
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi xóa phiếu chi');
        }
    };

    const handleBatchDeleteExpenses = async () => {
        if (!selectedExpenses.length) return;
        if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedExpenses.length} phiếu chi đã chọn? Hành động này không thể hoàn tác.`)) return;

        try {
            await Promise.all(selectedExpenses.map(id => axiosInstance.delete(`/finance/expenses/${id}`)));
            toast.success(`Đã xóa thành công ${selectedExpenses.length} phiếu chi`);
            setSelectedExpenses([]);
            fetchExpenses();
        } catch (error: any) {
            toast.error(error.message || "Một số phiếu chi không thể xóa");
            fetchExpenses();
        }
    };

    const handleSaveCategory = async () => {
        try {
            if (categoryForm.id) {
                await axiosInstance.patch(`/settings/categories/${categoryForm.id}`, { name: categoryForm.name.trim() });
            } else {
                await axiosInstance.post('/settings/categories', {
                    name: categoryForm.name.trim(),
                    type: 'expense',
                    propertyId
                });
            }
            toast.success("Lưu danh mục thành công!");
            setIsCategoryOpen(false);
            setCategoryForm({ id: '', name: '' });
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message || "Không thể lưu danh mục. Vui lòng thử lại!");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
        try {
            await axiosInstance.delete(`/settings/categories/${id}`);
            fetchCategories();
            fetchExpenses();
        } catch (error) {
            console.error("Failed to delete category", error);
        }
    };

    const handleBatchDeleteCategories = async () => {
        if (!selectedCategories.length) return;
        if (!confirm(`Bạn có chắc muốn xóa ${selectedCategories.length} danh mục đã chọn?`)) return;
        try {
            await Promise.all(selectedCategories.map(id => axiosInstance.delete(`/settings/categories/${id}`)));
            toast.success(`Đã xóa thành công ${selectedCategories.length} danh mục`);
            setSelectedCategories([]);
            fetchCategories();
            fetchExpenses();
        } catch (error: any) {
            toast.error(error.message || "Một số danh mục không thể xóa");
            fetchCategories();
        }
    };

    const filteredData = expenses.filter(e => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            e.code?.toLowerCase().includes(term) ||
            e.title?.toLowerCase().includes(term) ||
            e.category?.toLowerCase().includes(term) ||
            e.description?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-rose-500" /> Quản lý Chi phí (Phiếu chi)
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Ghi nhận các khoản chi xuất khỏi quỹ tiền tệ</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {selectedExpenses.length > 0 && (
                        <Button className="bg-red-900/40 hover:bg-red-900/80 text-red-500 border border-red-900/30 whitespace-nowrap" onClick={handleBatchDeleteExpenses}>
                            <Trash className="w-4 h-4 mr-2" /> Xóa ({selectedExpenses.length})
                        </Button>
                    )}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm phiếu chi..."
                            className="pl-9 bg-white border-gray-200 text-gray-900 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Dialog open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) setFormData({ id: '', title: '', category: '', newCategoryName: '', amount: '', description: '', code: '' });
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                                <Plus className="w-4 h-4 mr-2" /> Tạo phiếu chi
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{formData.id ? 'Sửa Phiếu Chi' : 'Tạo Phiếu Chi Mới'}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500">Mã phiếu chi</label>
                                        <Input
                                            placeholder="Tự động nếu để trống"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            className="bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500">Số tiền (VND) <span className="text-rose-500">*</span></label>
                                        <Input
                                            type="number"
                                            placeholder="VD: 500000"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="bg-gray-50 border-gray-200 font-bold text-rose-400"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500">Tên khoản chi <span className="text-rose-500">*</span></label>
                                    <Input
                                        placeholder="VD: Chi trả tiền điện tháng 03"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="bg-gray-50 border-gray-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500">Danh mục <span className="text-rose-500">*</span></label>
                                    <select
                                        className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Chọn danh mục...</option>
                                        {categories.map((c: any) => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                        <option value="new">+  Tạo danh mục mới</option>
                                    </select>
                                </div>

                                {formData.category === 'new' && (
                                    <div className="space-y-2 pl-4 border-l-2 border-rose-500">
                                        <label className="text-xs font-medium text-gray-500">Tên Danh mục Mới</label>
                                        <Input
                                            placeholder="VD: Chi trả nhà cung cấp, Điện nước..."
                                            value={formData.newCategoryName}
                                            onChange={(e) => setFormData({ ...formData, newCategoryName: e.target.value })}
                                            className="bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500">Ghi chú thêm</label>
                                    <Input
                                        placeholder="Mô tả nếu cần..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="bg-gray-50 border-gray-200"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" className="border-gray-200" onClick={() => setIsOpen(false)}>Hủy</Button>
                                <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleCreateExpense} disabled={!formData.title || !formData.amount || (!formData.category && !formData.newCategoryName)}>
                                    {formData.id ? 'Cập nhật' : 'Tạo phiếu chi'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="expenses" className="space-y-4">
                <TabsList className="bg-white border border-gray-200 p-1">
                    <TabsTrigger value="expenses" className="data-[state=active]:bg-gray-50 data-[state=active]:text-rose-400">
                        Phiếu chi
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="data-[state=active]:bg-gray-50 data-[state=active]:text-rose-400">
                        Danh mục chi phí
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="expenses" className="space-y-4 mt-0">
                    <Card className="bg-white border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-3 w-10">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 bg-gray-50 accent-rose-500 cursor-pointer"
                                                checked={filteredData.length > 0 && selectedExpenses.length === filteredData.length}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedExpenses(filteredData.map(d => d.id));
                                                    else setSelectedExpenses([]);
                                                }}
                                            />
                                        </th>
                                        <th className="px-4 py-3 font-medium">Mã Phiếu</th>
                                        <th className="px-4 py-3 font-medium">Tên khoản chi</th>
                                        <th className="px-4 py-3 font-medium">Danh mục</th>
                                        <th className="px-4 py-3 font-medium text-right">Số tiền (VND)</th>
                                        <th className="px-4 py-3 font-medium">Nhân viên chi</th>
                                        <th className="px-4 py-3 font-medium">Thời gian</th>
                                        <th className="px-4 py-3 font-medium">Ghi chú</th>
                                        <th className="px-4 py-3 font-medium text-right w-[100px]">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/50 text-gray-600">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-8 text-center text-gray-400">Đang tải biểu dữ liệu...</td>
                                        </tr>
                                    ) : filteredData.length > 0 ? (
                                        filteredData.map(e => (
                                            <tr key={e.id} className="hover:bg-gray-50/30 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-gray-300 bg-gray-50 accent-rose-500 cursor-pointer"
                                                        checked={selectedExpenses.includes(e.id)}
                                                        onChange={(event) => {
                                                            if (event.target.checked) {
                                                                setSelectedExpenses(prev => [...prev, e.id]);
                                                            } else {
                                                                setSelectedExpenses(prev => prev.filter(id => id !== e.id));
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-mono text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded inline-block">
                                                        {e.code || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-700">{e.title || 'Khoản chi không tên'}</td>
                                                <td className="px-4 py-3">
                                                    <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-xs font-medium border border-rose-500/20">
                                                        {e.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-rose-500">
                                                    - {e.amount.toLocaleString('vi-VN')}
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    {e.createdBy?.name || 'Hệ thống'}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500 text-xs">
                                                    {format(new Date(e.date), 'dd/MM/yyyy HH:mm')}
                                                </td>
                                                <td className="px-4 py-3 text-xs max-w-[200px] truncate" title={e.description}>
                                                    {e.description || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-700 hover:bg-gray-100">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-gray-50 border-gray-200 text-gray-600">
                                                            <DropdownMenuItem className="focus:bg-gray-100 focus:text-gray-900 cursor-pointer" onClick={() => handleEditExpense(e)}>
                                                                <FileEdit className="mr-2 h-4 w-4" />
                                                                <span>Chỉnh sửa</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-gray-100" />
                                                            <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer" onClick={() => handleDeleteExpense(e.id)}>
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                <span>Xóa</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-8 text-center text-gray-400">Chưa có khoản chi nào được ghi nhận.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4 mt-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <FolderOpen className="w-5 h-5 text-gray-500" /> Cấu hình danh mục chi phí
                        </h2>
                        <div className="flex gap-2">
                            {selectedCategories.length > 0 && (
                                <Button className="bg-red-900/40 hover:bg-red-900/80 text-red-500 border border-red-900/30 whitespace-nowrap" onClick={handleBatchDeleteCategories}>
                                    <Trash className="w-4 h-4 mr-2" /> Xóa ({selectedCategories.length})
                                </Button>
                            )}
                            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900" onClick={() => { setCategoryForm({ id: '', name: '' }); setIsCategoryOpen(true); }}>
                                <Plus className="w-4 h-4 mr-2" /> Thêm danh mục
                            </Button>
                        </div>
                    </div>

                    <Card className="bg-white border-gray-200">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 bg-gray-50 accent-rose-500 cursor-pointer"
                                            checked={categories.length > 0 && selectedCategories.length === categories.length}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedCategories(categories.map(c => c.id));
                                                else setSelectedCategories([]);
                                            }}
                                        />
                                    </th>
                                    <th className="px-4 py-3 font-medium">Tên danh mục</th>
                                    <th className="px-4 py-3 font-medium text-right">Phân loại hệ thống</th>
                                    <th className="px-4 py-3 font-medium text-right w-[100px]">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50 text-gray-600">
                                {categories.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50/30">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 bg-gray-50 accent-rose-500 cursor-pointer"
                                                checked={selectedCategories.includes(c.id)}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setSelectedCategories(prev => [...prev, c.id]);
                                                    } else {
                                                        setSelectedCategories(prev => prev.filter(id => id !== c.id));
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Expense</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-700 hover:bg-gray-100">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-gray-50 border-gray-200 text-gray-600">
                                                    <DropdownMenuItem className="focus:bg-gray-100 focus:text-gray-900 cursor-pointer" onClick={() => { setCategoryForm({ id: c.id, name: c.name }); setIsCategoryOpen(true); }}>
                                                        <FileEdit className="mr-2 h-4 w-4" />
                                                        <span>Chỉnh sửa</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-gray-100" />
                                                    <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer" onClick={() => handleDeleteCategory(c.id)}>
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        <span>Xóa</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Chưa có cấu hình danh mục nào.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Category Dialog */}
            <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>{categoryForm.id ? 'Sửa' : 'Thêm'} Danh Mục Chi Phí</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Tên danh mục <span className="text-rose-500">*</span></label>
                            <Input
                                placeholder="VD: Lương nhân viên, Điện nước..."
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="border-gray-200" onClick={() => setIsCategoryOpen(false)}>Hủy</Button>
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleSaveCategory} disabled={!categoryForm.name.trim()}>
                            Lưu ngay
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
