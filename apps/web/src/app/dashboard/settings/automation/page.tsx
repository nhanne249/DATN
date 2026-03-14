'use client';

import { useState } from 'react';
import { 
  Zap, Mail, Plus, Search, Settings as SettingsIcon, 
  Play, Pause, Trash2, Edit2, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAutomation } from '@/features/automation/hooks/use-automation';
import { useAuthStore } from '@/store/use-auth-store';
import { Skeleton } from '@/components/ui/skeleton';

export default function AutomationPage() {
  const { activePropertyId: propertyId } = useAuthStore();
  const { 
    templates, isLoadingTemplates, 
    flows, isLoadingFlows,
    createTemplate, createFlow 
  } = useAutomation(propertyId || '');

  const [activeTab, setActiveTab] = useState('flows');

  return (
    <div className="p-6 space-y-6 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Tự động hóa (Automation)
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Cấu hình luồng xử lý và thông báo tự động</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> 
          {activeTab === 'flows' ? 'Tạo quy trình mới' : 'Tạo mẫu email'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-900 border-zinc-800">
          <TabsTrigger value="flows" className="data-[state=active]:bg-zinc-800">
            <Zap className="w-4 h-4 mr-2" /> Quy trình tự động
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-zinc-800">
            <Mail className="w-4 h-4 mr-2" /> Mẫu thông báo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flows" className="space-y-4">
          <div className="grid gap-4">
            {isLoadingFlows ? (
              <Skeleton className="h-[200px] w-full bg-zinc-900" />
            ) : flows.length === 0 ? (
              <Card className="bg-zinc-900 border-zinc-800 border-dashed">
                <CardContent className="py-20 text-center">
                  <Zap className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">Chưa có quy trình tự động nào được thiết lập.</p>
                </CardContent>
              </Card>
            ) : (
              flows.map(flow => (
                <Card key={flow.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${flow.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{flow.name}</h3>
                        <p className="text-sm text-zinc-500">
                          Khi: <span className="text-blue-400">{flow.trigger}</span> ➜ 
                          Làm: <span className="text-emerald-400">{flow.action}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Badge variant={flow.isActive ? "success" : "secondary"}>
                        {flow.isActive ? 'Active' : 'Paused'}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500">
                        <SettingsIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingTemplates ? (
              <>
                <Skeleton className="h-[150px] w-full bg-zinc-900" />
                <Skeleton className="h-[150px] w-full bg-zinc-900" />
              </>
            ) : templates.length === 0 ? (
               <Card className="col-span-full bg-zinc-900 border-zinc-800 border-dashed">
                <CardContent className="py-20 text-center">
                  <Mail className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">Chưa có mẫu email nào.</p>
                </CardContent>
              </Card>
            ) : (
              templates.map(template => (
                <Card key={template.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex justify-between">
                      {template.name}
                      <Mail className="w-4 h-4 text-zinc-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-400 line-clamp-2">{template.subject}</p>
                    <div className="mt-4 flex justify-between items-center">
                       <span className="text-[10px] text-zinc-600">ID: {template.id.slice(0, 8)}</span>
                       <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400 p-0 h-auto">
                        Chi tiết
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
