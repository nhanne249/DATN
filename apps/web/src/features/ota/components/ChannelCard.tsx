import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Link as LinkIcon, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { OtaChannel } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ChannelCardProps {
    channel: OtaChannel;
    onConfigure?: (channel: OtaChannel) => void;
    onConnect?: (channel: OtaChannel) => void;
}

export function ChannelCard({ channel, onConfigure, onConnect }: ChannelCardProps) {
    const getStatusIcon = (status: string, isActive: boolean) => {
        if (!isActive) return <XCircle className="h-4 w-4 text-zinc-500" />;
        switch (status) {
            case 'connected': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case 'error': return <AlertCircle className="h-4 w-4 text-rose-500" />;
            default: return <Clock className="h-4 w-4 text-zinc-500" />;
        }
    };

    const lastSyncStr = channel.lastSyncAt 
        ? formatDistanceToNow(new Date(channel.lastSyncAt), { addSuffix: true, locale: vi })
        : 'Chưa đồng bộ';

    return (
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden group">
            <div className={`h-1.5 w-full transition-colors ${channel.isActive ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                            {channel.name}
                        </CardTitle>
                        <CardDescription className="text-zinc-500 mt-1">
                            Type: {channel.type}
                        </CardDescription>
                    </div>
                    {getStatusIcon(channel.status, channel.isActive)}
                </div>
            </CardHeader>
            <CardContent className="pb-3 text-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-400">Trạng thái:</span>
                    {channel.isActive ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-normal">Đã kết nối</Badge>
                    ) : (
                        <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-zinc-800 font-normal">Chưa kết nối</Badge>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Đồng bộ cuối:</span>
                    <span className="text-zinc-300">{lastSyncStr}</span>
                </div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-zinc-800/60 bg-zinc-950/20">
                {channel.isActive ? (
                    <Button 
                        variant="outline" 
                        className="w-full bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                        onClick={() => onConfigure?.(channel)}
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Cấu hình
                    </Button>
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
