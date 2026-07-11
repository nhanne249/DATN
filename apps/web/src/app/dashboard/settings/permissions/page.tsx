'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  permissionService,
  CustomRole,
} from '@/features/settings/services/permission.service';
import { MODULES } from '@/lib/modules';
import { toast } from 'sonner';
import { RefreshCw, Shield, ShieldCheck, Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';


interface CustomRoleFormData {
  name: string;
  modules: string[];
}

function CustomRoleDialog({
  open,
  onClose,
  onSave,
  initial,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: CustomRoleFormData) => Promise<void>;
  initial?: CustomRole | null;
  saving: boolean;
}) {
  const [name, setName] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setSelectedModules(initial?.modules ?? []);
    }
  }, [open, initial]);

  const toggleModule = (key: string) => {
    setSelectedModules((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const allSelected = selectedModules.length === MODULES.length;
  const toggleAll = () => {
    setSelectedModules(allSelected ? [] : MODULES.map((m) => m.key));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên vai trò');
      return;
    }
    await onSave({ name: name.trim(), modules: selectedModules });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? 'Chỉnh sửa vai trò' : 'Thêm vai trò tuỳ chỉnh'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Tên vai trò</Label>
            <Input
              placeholder="VD: Lễ tân, Kế toán, Buồng phòng..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Module được phép truy cập</Label>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-blue-600 hover:underline"
              >
                {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-gray-200 p-3 max-h-52 overflow-y-auto">
              {MODULES.map((m) => (
                <label
                  key={m.key}
                  className="flex items-center gap-2 cursor-pointer rounded px-2 py-1.5 hover:bg-gray-50 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(m.key)}
                    onChange={() => toggleModule(m.key)}
                    className="h-3.5 w-3.5 accent-blue-600"
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Huỷ
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Đang lưu...' : initial ? 'Cập nhật' : 'Tạo vai trò'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PermissionsPage() {
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom role dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [dialogSaving, setDialogSaving] = useState(false);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<CustomRole | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Custom role inline module edits (roleId → modules[])
  const [customModules, setCustomModules] = useState<Record<string, string[]>>({});
  const [customSaving, setCustomSaving] = useState<Record<string, boolean>>({});

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const customRes = await permissionService.getCustomRoles();
      setCustomRoles(customRes.data);
      // Seed inline module state from fetched custom roles
      const initial: Record<string, string[]> = {};
      for (const cr of customRes.data) {
        initial[cr.id] = cr.modules;
      }
      setCustomModules(initial);
    } catch {
      toast.error('Không thể tải cấu hình phân quyền');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Custom role inline toggle
  const handleCustomToggle = async (roleId: string, moduleKey: string, checked: boolean) => {
    const current = customModules[roleId] ?? [];
    const updated = checked ? [...current, moduleKey] : current.filter((k) => k !== moduleKey);

    setCustomModules((prev) => ({ ...prev, [roleId]: updated }));
    setCustomSaving((prev) => ({ ...prev, [roleId]: true }));
    try {
      await permissionService.updateCustomRole(roleId, { modules: updated });
      setCustomRoles((prev) =>
        prev.map((cr) => (cr.id === roleId ? { ...cr, modules: updated } : cr))
      );
    } catch {
      toast.error('Lưu thất bại, đang hoàn tác');
      setCustomModules((prev) => ({ ...prev, [roleId]: current }));
    } finally {
      setCustomSaving((prev) => ({ ...prev, [roleId]: false }));
    }
  };

  // Custom role create / update
  const handleSaveCustomRole = async (data: CustomRoleFormData) => {
    setDialogSaving(true);
    try {
      if (editingRole) {
        const res = await permissionService.updateCustomRole(editingRole.id, {
          name: data.name,
          modules: data.modules,
        });
        setCustomRoles((prev) =>
          prev.map((cr) => (cr.id === editingRole.id ? res.data : cr))
        );
        setCustomModules((prev) => ({ ...prev, [editingRole.id]: res.data.modules }));
        toast.success('Đã cập nhật vai trò');
      } else {
        const res = await permissionService.createCustomRole({
          name: data.name,
          baseRole: 'internal_user',
          modules: data.modules,
        });
        setCustomRoles((prev) => [...prev, res.data]);
        setCustomModules((prev) => ({ ...prev, [res.data.id]: res.data.modules }));
        toast.success('Đã tạo vai trò mới');
      }
      setDialogOpen(false);
      setEditingRole(null);
    } catch {
      toast.error('Lưu vai trò thất bại');
    } finally {
      setDialogSaving(false);
    }
  };

  // Custom role delete
  const handleDeleteCustomRole = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await permissionService.deleteCustomRole(deleteTarget.id);
      setCustomRoles((prev) => prev.filter((cr) => cr.id !== deleteTarget.id));
      setCustomModules((prev) => {
        const next = { ...prev };
        delete next[deleteTarget.id];
        return next;
      });
      toast.success('Đã xóa vai trò');
    } catch {
      toast.error('Xóa vai trò thất bại');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Phân quyền theo vai trò</h1>
            <p className="text-sm text-gray-500">
              Cấu hình các module mà từng vai trò nhân viên có thể truy cập
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingRole(null);
            setDialogOpen(true);
          }}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Thêm vai trò
        </Button>
      </div>

      {/* Full access note */}
      <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        <span>
          <strong>Quản trị viên hệ thống (Admin)</strong> luôn có quyền truy cập toàn bộ hệ thống và không thể bị giới hạn.
        </span>
      </div>

      {/* Matrix card */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-base text-gray-900">Danh sách vai trò & Quyền hạn</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Đang tải...
            </div>
          ) : customRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Shield className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm">Chưa có vai trò tuỳ chỉnh nào.</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className="mt-1 text-blue-600"
              >
                Tạo vai trò đầu tiên
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="sticky left-0 z-10 min-w-[160px] bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700">
                      Vai trò
                    </th>
                    {MODULES.map((m) => (
                      <th
                        key={m.key}
                        className="min-w-[90px] px-2 py-3 text-center font-medium text-gray-600"
                        title={m.label}
                      >
                        <span className="block text-xs leading-tight">{m.label}</span>
                      </th>
                    ))}
                    <th className="min-w-[100px] px-3 py-3 text-center font-medium text-gray-500">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Custom roles */}
                  {customRoles.map((cr) => {
                    const modules = customModules[cr.id] ?? cr.modules;
                    const isSaving = customSaving[cr.id] ?? false;

                    return (
                      <tr
                        key={cr.id}
                        className="border-b border-gray-100 transition-colors hover:bg-gray-50/50"
                      >
                        <td className="sticky left-0 z-10 bg-white px-4 py-3 hover:bg-gray-50/50">
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-violet-100 text-violet-700 border-violet-200">
                              {cr.name}
                            </span>
                            {isSaving && (
                              <span className="text-[10px] text-blue-500">Đang lưu...</span>
                            )}
                          </div>
                        </td>

                        {MODULES.map((m) => {
                          const checked = modules.includes(m.key);
                          return (
                            <td key={m.key} className="px-2 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={isSaving}
                                onChange={(e) =>
                                  handleCustomToggle(cr.id, m.key, e.target.checked)
                                }
                                className="h-4 w-4 cursor-pointer accent-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label={`${cr.name} - ${m.label}`}
                              />
                            </td>
                          );
                        })}

                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setEditingRole(cr);
                                setDialogOpen(true);
                              }}
                              className="inline-flex items-center rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(cr)}
                              className="inline-flex items-center rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Xóa vai trò"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="font-medium text-gray-600">Ghi chú:</span>
        <span>
          <span className="inline-block h-3 w-3 rounded-sm border border-violet-400 bg-violet-600 align-middle mr-1" />
          = Được phép truy cập
        </span>
        <span>
          <span className="inline-block h-3 w-3 rounded-sm border border-gray-300 bg-white align-middle mr-1" />
          = Không có quyền
        </span>
      </div>

      {/* Custom role create/edit dialog */}
      <CustomRoleDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingRole(null);
        }}
        onSave={handleSaveCustomRole}
        initial={editingRole}
        saving={dialogSaving}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vai trò &quot;{deleteTarget?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Nhân viên đang được gán vai trò này sẽ bị xóa liên kết quyền hạn. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomRole}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Đang xóa...' : 'Xóa vai trò'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
