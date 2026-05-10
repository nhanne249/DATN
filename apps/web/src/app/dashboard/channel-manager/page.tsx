'use client';

import React, { useState } from 'react';
import { Globe, RefreshCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOtaChannels, useOtaMutation, useOtaLogs } from '@/features/ota/hooks/use-ota';
import { ChannelCard } from '@/features/ota/components/ChannelCard';
import { MappingTable } from '@/features/ota/components/MappingTable';
import { SyncLogTable } from '@/features/ota/components/SyncLogTable';
import { AddChannelModal } from '@/features/ota/components/AddChannelModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/use-auth-store';
import { useRoomTypes } from '@/features/rooms/hooks/use-rooms';
import { toast } from 'sonner';

export default function ChannelManagerPage() {
  const { activePropertyId: propertyId } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [mappingForm, setMappingForm] = useState({
    roomTypeId: '',
    externalRoomId: '',
    externalRateId: '',
  });

  const { data: channels, isLoading: loadingChannels } = useOtaChannels(propertyId || '');
  const { data: roomTypes = [] } = useRoomTypes(propertyId || '');
  const { createChannel, createMapping, deleteMapping, updateChannel, pushARI, pullReservations } = useOtaMutation();

  const currentChannelId = selectedChannelId || channels?.[0]?.id;
  const { data: logs, isLoading: loadingLogs } = useOtaLogs(currentChannelId || '');

  const handleAddChannel = (data: any) => {
    createChannel.mutate(data);
    setIsAddModalOpen(false);
  };

  const handleToggleConnect = (channel: { id: string; isActive: boolean }) => {
    if (!propertyId) return;
    updateChannel.mutate({
      id: channel.id,
      propertyId,
      dto: { isActive: !channel.isActive },
    });
  };

  const handlePushARI = (channel: { id: string }) => {
    pushARI.mutate({ channelId: channel.id });
  };

  const handlePullReservations = (channel: { id: string }) => {
    pullReservations.mutate(channel.id);
  };

  const handleDeleteMap = (id: string) => {
    if (!currentChannelId) return;
    if (confirm('Xóa liên kết phòng này?')) {
      deleteMapping.mutate({ id, channelId: currentChannelId });
    }
  };

  const handleCreateMapping = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentChannelId) {
      toast.error('Vui lòng chọn kênh OTA trước khi tạo mapping');
      return;
    }
    if (!mappingForm.roomTypeId) {
      toast.error('Vui lòng chọn hạng phòng nội bộ');
      return;
    }

    createMapping.mutate(
      {
        channelId: currentChannelId,
        roomTypeId: mappingForm.roomTypeId,
        externalRoomId: mappingForm.externalRoomId.trim() || undefined,
        externalRateId: mappingForm.externalRateId.trim() || undefined,
      },
      {
        onSuccess: () => {
          setMappingForm({
            roomTypeId: '',
            externalRoomId: '',
            externalRateId: '',
          });
        },
      },
    );
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 min-h-screen text-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-500" />
            Quản lý Kênh Phân Phối (Channel Manager)
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Kết nối, đồng bộ giá, quỹ phòng và nhận booking tự động từ các OTA.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-gray-50 border-gray-200 text-gray-600">
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
        <TabsList className="bg-gray-50 border border-gray-200 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-100 rounded-md py-2 px-6">
            Tổng quan và Kết nối
          </TabsTrigger>
          <TabsTrigger value="mappings" className="data-[state=active]:bg-gray-100 rounded-md py-2 px-6">
            Map Hạng Phòng và Giá
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-gray-100 rounded-md py-2 px-6">
            Lịch sử Đồng bộ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {loadingChannels ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-[200px] w-full bg-gray-50" />
              <Skeleton className="h-[200px] w-full bg-gray-50" />
              <Skeleton className="h-[200px] w-full bg-gray-50" />
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
                  onConnect={() => handleToggleConnect(channel)}
                  onPushARI={handlePushARI}
                  onPullReservations={handlePullReservations}
                  isPushingARI={pushARI.isPending}
                  isPullingReservations={pullReservations.isPending}
                />
              ))}
              {channels?.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
                  <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400">Chưa có kênh OTA nào được kết nối.</p>
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

        <TabsContent value="mappings">
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Chọn kênh:</span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {channels?.map((channel) => (
                  <Button
                    key={channel.id}
                    variant={currentChannelId === channel.id ? 'default' : 'outline'}
                    size="sm"
                    className={currentChannelId === channel.id ? 'bg-blue-600' : 'bg-transparent border-gray-300'}
                    onClick={() => setSelectedChannelId(channel.id)}
                  >
                    {channel.name}
                  </Button>
                ))}
              </div>
            </div>

            {currentChannelId ? (
              <>
                <form
                  onSubmit={handleCreateMapping}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="space-y-2">
                    <Label htmlFor="roomTypeId">Hạng phòng nội bộ</Label>
                    <select
                      id="roomTypeId"
                      value={mappingForm.roomTypeId}
                      onChange={(e) =>
                        setMappingForm((prev) => ({ ...prev, roomTypeId: e.target.value }))
                      }
                      className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-800"
                      required
                    >
                      <option value="">Chọn hạng phòng</option>
                      {roomTypes.map((roomType: any) => (
                        <option key={roomType.id} value={roomType.id}>
                          {roomType.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="externalRoomId">Room ID trên OTA</Label>
                    <Input
                      id="externalRoomId"
                      value={mappingForm.externalRoomId}
                      onChange={(e) =>
                        setMappingForm((prev) => ({
                          ...prev,
                          externalRoomId: e.target.value,
                        }))
                      }
                      placeholder="Ví dụ: OTA_ROOM_101"
                      className="bg-white border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="externalRateId">Mã giá (Rate Plan)</Label>
                    <Input
                      id="externalRateId"
                      value={mappingForm.externalRateId}
                      onChange={(e) =>
                        setMappingForm((prev) => ({
                          ...prev,
                          externalRateId: e.target.value,
                        }))
                      }
                      placeholder="Ví dụ: OTA_RATE_STANDARD"
                      className="bg-white border-gray-200"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={createMapping.isPending}
                    >
                      {createMapping.isPending ? 'Đang tạo...' : 'Tạo liên kết'}
                    </Button>
                  </div>
                </form>

                <MappingTable
                  mappings={channels?.find((channel) => channel.id === currentChannelId)?.otaMappings || []}
                  onDelete={handleDeleteMap}
                />
              </>
            ) : (
              <div className="py-20 text-center bg-gray-50/50 rounded-xl border border-gray-200">
                <p className="text-gray-400">Vui lòng chọn hoặc kết nối kênh để thiết lập mapping.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Chọn kênh xem nhật ký:</span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {channels?.map((channel) => (
                  <Button
                    key={channel.id}
                    variant={currentChannelId === channel.id ? 'default' : 'outline'}
                    size="sm"
                    className={currentChannelId === channel.id ? 'bg-blue-600' : 'bg-transparent border-gray-300'}
                    onClick={() => setSelectedChannelId(channel.id)}
                  >
                    {channel.name}
                  </Button>
                ))}
              </div>
            </div>

            {loadingLogs ? (
              <Skeleton className="h-[400px] w-full bg-gray-50" />
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
