'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export default function Page() {
    const methods = ['Tiền mặt', 'Chuyển khoản', 'Thẻ tín dụng', 'MoMo', 'VNPay'];
    return (
        <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900 text-base">Phương thức thanh toán</CardTitle>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">+ Thêm PT</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {methods.map((m) => (
                        <div key={m} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-100/50 px-4 py-3">
                            <span className="text-sm text-gray-700">{m}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-emerald-400">Hoạt động</span>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-700">Chỉnh sửa</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
