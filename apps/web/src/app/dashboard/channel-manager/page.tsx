'use client';

import React, { useState } from 'react';
import {
    Globe, RefreshCcw, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOtaChannels, useOtaMutation, useOtaLogs } from '@/features/ota/hooks/use-ota';
import { ChannelCard } from '@/features/ota/components/ChannelCard';
import { MappingTable } from '@/features/ota/components/MappingTable';
import { SyncLogTable } from '@/features/ota/components/SyncLogTable';
import { AddChannelModal } from '@/features/ota/components/AddChannelModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/use-auth-store';
import { OtaChannel } from '@/features/ota/types';

export default function ChannelManagerPage() {
    const { activePropertyId: propertyId } = useAuthStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

    const { data: channels, isLoading: loadingChannels } = useOtaChannels(propertyId || '');
    const { createChannel, deleteChannel, deleteMapping } = useOtaMutation();
    
    // Fetch logs for the first selected channel if none selected
    const currentChannelId = selectedChannelId || (channels?.[0]?.id);
    const { data: logs, isLoading: loadingLogs } = useOtaLogs(currentChannelId || '');

    const handleAddChannel = (data: any) => {
        createChannel.mutate(data);
        setIsAddModalOpen(false);
    };

    const handleDeleteChannel = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn ngắt kết nối kênh này? Toàn bộ mapping sẽ bị xóa.')) {
            deleteChannel.mutate({ id, propertyId: propertyId || '' });
        }
    };

    const handleDeleteMap = (id: string) => {
        if (confirm('Xóa liên kết phòng này?')) {
            deleteMapping.mutate({ id, channelId: currentChannelId! });
        }
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-zinc-950 min-h-screen text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Globe className="h-6 w-6 text-blue-500" />
                        Quản lý Kênh Phân Phối (Channel Manager)
                    </h2>
                    <p className="text-zinc-500 mt-2 text-sm">
                        Kết nối, đồng bộ giá, quỹ phòng và nhận booking tự động từ các OTA.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Đồng bộ toàn bộ
                    </Button>
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Thêm kênh mới
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800 rounded-md py-2 px-6">
                        Tổng quan & Kết nối
                    </TabsTrigger>
                    <TabsTrigger value="mappings" className="data-[state=active]:bg-zinc-800 rounded-md py-2 px-6">
                        Map Hạng Phòng & Giá
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="data-[state=active]:bg-zinc-800 rounded-md py-2 px-6">
                        Lịch sử Đồng bộ
                    </TabsTrigger>
                </TabsList>

                {/* TAB: OVERVIEW */}
                <TabsContent value="overview">
                    {loadingChannels ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Skeleton className="h-[200px] w-full bg-zinc-900" />
                            <Skeleton className="h-[200px] w-full bg-zinc-900" />
                            <Skeleton className="h-[200px] w-full bg-zinc-900" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {channels?.map((channel) => (
                                <ChannelCard 
                                    key={channel.id} 
                                    channel={channel} 
                                    onConfigure={() => {
                                        setSelectedChannelId(channel.id);
                                        setActiveTab('mappings');
                                    }}
                                />
                            ))}
                            {channels?.length === 0 && (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-xl">
                                    <Globe className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                                    <p className="text-zinc-500">Chưa có kênh OTA nào được kết nối.</p>
                                    <Button 
                                        variant="link" 
                                        className="text-blue-500 mt-2"
                                        onClick={() => setIsAddModalOpen(true)}
                                    >
                                        Kết nối kênh đầu tiên
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* TAB: MAPPINGS */}
                <TabsContent value="mappings">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-zinc-900/40 p-4 rounded-lg border border-zinc-800">
                            <span className="text-sm text-zinc-400">Chọn kênh:</span>
                            <div className="flex gap-2">
                                {channels?.map(c => (
                                    <Button
                                        key={c.id}
                                        variant={currentChannelId === c.id ? 'default' : 'outline'}
                                        size="sm"
                                        className={currentChannelId === c.id ? 'bg-blue-600' : 'bg-transparent border-zinc-700'}
                                        onClick={() => setSelectedChannelId(c.id)}
                                    >
                                        {c.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {currentChannelId ? (
                            <MappingTable 
                                mappings={channels?.find(c => c.id === currentChannelId)?.otaMappings || []} 
                                onDelete={handleDeleteMap}
                            />
                        ) : (
                            <div className="py-20 text-center bg-zinc-900/20 rounded-xl border border-zinc-800">
                                <p className="text-zinc-500">Vui lòng chọn hoặc kết nối kênh để thiết lập Mapping.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* TAB: LOGS */}
                <TabsContent value="logs">
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-zinc-900/40 p-4 rounded-lg border border-zinc-800">
                            <span className="text-sm text-zinc-400">Chọn kênh xem nhật ký:</span>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {channels?.map(c => (
                                    <Button
                                        key={c.id}
                                        variant={currentChannelId === c.id ? 'default' : 'outline'}
                                        size="sm"
                                        className={currentChannelId === c.id ? 'bg-blue-600' : 'bg-transparent border-zinc-700'}
                                        onClick={() => setSelectedChannelId(c.id)}
                                    >
                                        {c.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {loadingLogs ? (
                            <Skeleton className="h-[400px] w-full bg-zinc-900" />
                        ) : (
                            <SyncLogTable logs={logs || []} />
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <AddChannelModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddChannel}
                propertyId={propertyId || ''}
                isPending={createChannel.isPending}
            />
        </div>
    );
}
