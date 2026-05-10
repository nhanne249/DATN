'use client';
import { Card, CardContent } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

interface PageSkeletonProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export function PageSkeleton({ title, description, icon: Icon }: PageSkeletonProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-400 mt-1">{description}</p>
            </div>
            <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
                            <Icon size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">Module này sẽ được hiện thực trong các phase tiếp theo</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
