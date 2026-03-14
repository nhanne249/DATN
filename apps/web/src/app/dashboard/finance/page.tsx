'use client';

import React, { useState } from 'react';
import {
    Plus, Search, Filter, Download, Wallet, CreditCard,
    TrendingUp, TrendingDown, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpenses, usePayments, useFinanceMutation } from '@/features/finance/hooks/use-finance';
import { ExpenseTable } from '@/features/finance/components/ExpenseTable';
import { PaymentTable } from '@/features/finance/components/PaymentTable';
import { ExpenseModal } from '@/features/finance/components/ExpenseModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/use-auth-store';
import { Expense } from '@/features/finance/types';

export default function FinancePage() {
    const { activePropertyId: propertyId } = useAuthStore();
    const [activeTab, setActiveTab] = useState('payments');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    const { data: expenses, isLoading: loadingExpenses } = useExpenses(propertyId || '');
    const { data: payments, isLoading: loadingPayments } = usePayments(propertyId || '');
    const { createExpense, updateExpense, removeExpense } = useFinanceMutation();

    const totalIncome = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalExpense = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
    const balance = totalIncome - totalExpense;

    const handleCreateExpense = (data: any) => {
        if (selectedExpense) {
            updateExpense.mutate({ id: selectedExpense.id, dto: data });
        } else {
            createExpense.mutate(data);
        }
        setIsModalOpen(false);
        setSelectedExpense(null);
    };

    const handleEditExpense = (expense: Expense) => {
        setSelectedExpense(expense);
        setIsModalOpen(true);
    };

    const handleDeleteExpense = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa phiếu chi này?')) {
            removeExpense.mutate({ id, propertyId: propertyId || '' });
        }
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-zinc-950 min-h-screen text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-blue-500" />
                        Quản lý Tài chính
                    </h2>
                    <p className="text-zinc-500 mt-1">
                        Theo dõi doanh thu, chi phí và lợi nhuận của khách sạn.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800">
                        <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
                    </Button>
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                            setSelectedExpense(null);
                            setIsModalOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tạo phiếu chi
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-zinc-900 border-zinc-800 border-b-2 border-b-emerald-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Tổng doanh thu (Phiếu thu)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-400">+{totalIncome.toLocaleString('vi-VN')}₫</div>
                        <p className="text-xs text-zinc-500 mt-1">Dựa trên các khoản thanh toán</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 border-b-2 border-b-rose-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Tổng chi phí (Phiếu chi)</CardTitle>
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-400">-{totalExpense.toLocaleString('vi-VN')}₫</div>
                        <p className="text-xs text-zinc-500 mt-1">Lương, điện nước, vận hành...</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800 border-b-2 border-b-blue-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Lợi nhuận gộp</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                            {balance.toLocaleString('vi-VN')}₫
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Kết quả kinh doanh (Dự kiến)</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                            placeholder="Tìm kiếm giao dịch..."
                            className="bg-zinc-900 border-zinc-800 pl-9 focus-visible:ring-blue-500"
                        />
                    </div>
                    <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400">
                        <Filter className="mr-2 h-4 w-4" /> Lọc
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1">
                    <TabsTrigger value="payments" className="data-[state=active]:bg-zinc-800 rounded-md py-2 px-6">
                        Phiếu thu (Doanh thu)
                    </TabsTrigger>
                    <TabsTrigger value="expenses" className="data-[state=active]:bg-zinc-800 rounded-md py-2 px-6">
                        Phiếu chi (Chi phí)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="payments" className="m-0">
                    {loadingPayments ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full bg-zinc-900" />
                            <Skeleton className="h-[400px] w-full bg-zinc-900" />
                        </div>
                    ) : (
                        <PaymentTable payments={payments || []} />
                    )}
                </TabsContent>

                <TabsContent value="expenses" className="m-0">
                    {loadingExpenses ? (
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full bg-zinc-900" />
                            <Skeleton className="h-[400px] w-full bg-zinc-900" />
                        </div>
                    ) : (
                        <ExpenseTable 
                            expenses={expenses || []} 
                            onEdit={handleEditExpense} 
                            onDelete={handleDeleteExpense}
                        />
                    )}
                </TabsContent>
            </Tabs>

            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedExpense(null);
                }}
                onSubmit={handleCreateExpense}
                expense={selectedExpense}
                propertyId={propertyId || ''}
                isPending={createExpense.isPending || updateExpense.isPending}
            />
        </div>
    );
}
