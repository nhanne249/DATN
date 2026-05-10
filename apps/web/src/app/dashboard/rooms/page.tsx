'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoomTable } from '@/features/rooms/components/RoomTable';
import { RoomTypeTable } from '@/features/rooms/components/RoomTypeTable';
import { useAuthStore } from '@/store/use-auth-store';

export default function RoomsPage() {
    const { activePropertyId } = useAuthStore();
    const propertyId = activePropertyId || '';

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Phòng</h2>
                    <p className="text-gray-500 mt-1">
                        Tạo loại phòng trước, sau đó thêm phòng vào từng loại.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="room-types" className="w-full">
                <TabsList className="bg-gray-50 border border-gray-200 p-1 rounded-lg">
                    <TabsTrigger value="room-types" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500">
                        1. Loại phòng
                    </TabsTrigger>
                    <TabsTrigger value="room-list" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-500">
                        2. Danh sách phòng
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="room-types" className="mt-6">
                    <RoomTypeTable propertyId={propertyId} />
                </TabsContent>

                <TabsContent value="room-list" className="mt-6">
                    <RoomTable propertyId={propertyId} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
