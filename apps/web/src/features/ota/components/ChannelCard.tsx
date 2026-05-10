import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Link as LinkIcon, CheckCircle2, XCircle, AlertCircle, Clock, Upload, Download } from 'lucide-react';
import { OtaChannel } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ChannelCardProps {
  channel: OtaChannel;
  onConfigure?: (channel: OtaChannel) => void;
  onConnect?: (channel: OtaChannel) => void;
  onPushARI?: (channel: OtaChannel) => void;
  onPullReservations?: (channel: OtaChannel) => void;
  isPushingARI?: boolean;
  isPullingReservations?: boolean;
}

export function ChannelCard({ channel, onConfigure, onConnect, onPushARI, onPullReservations, isPushingARI, isPullingReservations }: ChannelCardProps) {
  const getStatusIcon = (status: string | undefined, isActive: boolean) => {
    if (!isActive) return <XCircle className="h-4 w-4 text-gray-400" />;
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const lastSyncStr = channel.lastSyncAt
    ? formatDistanceToNow(new Date(channel.lastSyncAt), { addSuffix: true, locale: vi })
    : 'Chưa đồng bộ';

  return (
    <Card className="bg-gray-50 border-gray-200 overflow-hidden group">
      <div className={`h-1.5 w-full transition-colors ${channel.isActive ? 'bg-emerald-500' : 'bg-gray-200'}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {channel.name}
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">Type: {channel.type}</CardDescription>
          </div>
          {getStatusIcon(channel.status, channel.isActive)}
        </div>
      </CardHeader>
      <CardContent className="pb-3 text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500">Trạng thái:</span>
          {channel.isActive ? (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-normal">
              Đã kết nối
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-zinc-500/10 text-gray-500 border-gray-200 font-normal">
              Chưa kết nối
            </Badge>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Đồng bộ cuối:</span>
          <span className="text-gray-600">{lastSyncStr}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t border-gray-200/60 bg-gray-50 flex flex-col gap-2">
        {channel.isActive ? (
          <>
            <Button
              variant="outline"
              className="w-full bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              onClick={() => onConfigure?.(channel)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Cấu hình mapping
            </Button>
            {channel.type === 'channex' && (
              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent text-xs"
                  onClick={() => onPushARI?.(channel)}
                  disabled={isPushingARI}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  {isPushingARI ? 'Đang đẩy...' : 'Push ARI'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-transparent text-xs"
                  onClick={() => onPullReservations?.(channel)}
                  disabled={isPullingReservations}
                >
                  <Download className="h-3 w-3 mr-1" />
                  {isPullingReservations ? 'Đang kéo...' : 'Pull Bookings'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onConnect?.(channel)}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Kết nối ngay
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
