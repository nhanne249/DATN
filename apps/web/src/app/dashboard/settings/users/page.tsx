'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { staffService, StaffMember, StaffRole, CreateStaffDto, UpdateStaffDto } from '@/features/settings/services/staff.service';
import { permissionService, CustomRole } from '@/features/settings/services/permission.service';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/use-auth-store';

const ROLE_LABELS: Record<string, string> = {
  hotel_owner: 'Chủ khách sạn',
  hotel_manager: 'Quản lý',
  front_desk: 'Lễ tân',
  housekeeping: 'Buồng phòng',
  maintenance: 'Kỹ thuật',
  laundry: 'Giặt ủi',
  warehouse: 'Kho',
};

const ROLE_COLORS: Record<string, string> = {
  hotel_owner: 'bg-purple-100 text-purple-700 border-purple-200',
  hotel_manager: 'bg-blue-100 text-blue-700 border-blue-200',
  front_desk: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  housekeeping: 'bg-amber-100 text-amber-700 border-amber-200',
  maintenance: 'bg-orange-100 text-orange-700 border-orange-200',
  laundry: 'bg-sky-100 text-sky-700 border-sky-200',
  warehouse: 'bg-gray-100 text-gray-700 border-gray-200',
};

const ASSIGNABLE_ROLES: { value: StaffRole; label: string }[] = [
  { value: 'hotel_manager', label: 'Quản lý' },
  { value: 'front_desk', label: 'Lễ tân' },
  { value: 'housekeeping', label: 'Buồng phòng' },
  { value: 'maintenance', label: 'Kỹ thuật' },
  { value: 'laundry', label: 'Giặt ủi' },
  { value: 'warehouse', label: 'Kho' },
];

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;

// Encode/decode role select value to distinguish built-in vs custom
const encodeRole = (role?: string, customRoleId?: string) =>
  customRoleId ? `custom:${customRoleId}` : `role:${role ?? 'front_desk'}`;

const decodeRole = (val: string): { role?: StaffRole; customRoleId?: string } => {
  if (val.startsWith('custom:')) return { customRoleId: val.slice(7) };
  return { role: val.slice(5) as StaffRole };
};

// ── Role select shared component ──────────────────────────────────────────────

function RoleSelect({
  value,
  onChange,
  customRoles,
  canAssignManager = true,
  disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  customRoles: CustomRole[];
  canAssignManager?: boolean;
  disabled?: boolean;
}) {
  const roles = canAssignManager
    ? ASSIGNABLE_ROLES
    : ASSIGNABLE_ROLES.filter((r) => r.value !== 'hotel_manager');

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="text-gray-900">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-xs text-gray-400">Vai trò hệ thống</SelectLabel>
          {roles.map((r) => (
            <SelectItem key={r.value} value={`role:${r.value}`}>
              {r.label}
            </SelectItem>
          ))}
        </SelectGroup>
        {customRoles.length > 0 && (
          <SelectGroup>
            <SelectLabel className="text-xs text-gray-400">Vai trò tuỳ chỉnh</SelectLabel>
            {customRoles.map((cr) => (
              <SelectItem key={cr.id} value={`custom:${cr.id}`}>
                {cr.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}

// ── Create dialog ─────────────────────────────────────────────────────────────

function CreateStaffDialog({
  open,
  onClose,
  onCreated,
  customRoles,
  canAssignManager,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (s: StaffMember) => void;
  customRoles: CustomRole[];
  canAssignManager: boolean;
}) {
  const [form, setForm] = useState({
    username: '',
    name: '',
    password: '',
    phone: '',
    roleVal: 'role:front_desk',
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field: string) => (val: string) => {
    setForm((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Tối thiểu 2 ký tự';
    if (!form.username.trim() || !USERNAME_REGEX.test(form.username) || form.username.length < 2)
      e.username = 'Chỉ chữ cái, số, dấu chấm/gạch (tối thiểu 2 ký tự)';
    if (!PASSWORD_REGEX.test(form.password))
      e.password = 'Ít nhất 8 ký tự, gồm chữ cái, số và ký tự đặc biệt';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const { role, customRoleId } = decodeRole(form.roleVal);
    const dto: CreateStaffDto = {
      username: form.username,
      name: form.name,
      password: form.password,
      ...(customRoleId ? { customRoleId } : { role: role! }),
      ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
    };
    try {
      setSubmitting(true);
      const res = await staffService.create(dto);
      onCreated(res.data);
      toast.success(`Đã tạo tài khoản cho ${form.name}`);
      onClose();
      setForm({ username: '', name: '', password: '', phone: '', roleVal: 'role:front_desk' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Tạo tài khoản thất bại';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Tạo tài khoản nhân viên</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Field label="Họ và tên *" error={errors.name}>
            <Input
              value={form.name}
              onChange={(e) => set('name')(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="text-gray-900"
            />
          </Field>
          <Field label="Tên đăng nhập *" error={errors.username}>
            <Input
              value={form.username}
              onChange={(e) => set('username')(e.target.value.toLowerCase())}
              placeholder="nv-a"
              className="font-mono text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">Dùng để đăng nhập cùng định danh khách sạn</p>
          </Field>
          <Field label="Mật khẩu *" error={errors.password}>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => set('password')(e.target.value)}
              placeholder="Ít nhất 8 ký tự, có chữ cái, số, ký tự đặc biệt"
              className="text-gray-900"
            />
          </Field>
          <Field label="Vai trò *">
            <RoleSelect
              value={form.roleVal}
              onChange={(v) => setForm((p) => ({ ...p, roleVal: v }))}
              customRoles={customRoles}
              canAssignManager={canAssignManager}
            />
          </Field>
          <Field label="Số điện thoại" error={errors.phone}>
            <Input
              value={form.phone}
              onChange={(e) => set('phone')(e.target.value)}
              placeholder="+84901234567 (tùy chọn)"
              className="text-gray-900"
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white">
            {submitting ? 'Đang tạo...' : 'Tạo tài khoản'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit dialog ───────────────────────────────────────────────────────────────

function EditStaffDialog({
  staff,
  onClose,
  onUpdated,
  canAssignManager,
  customRoles,
}: {
  staff: StaffMember | null;
  onClose: () => void;
  onUpdated: (s: StaffMember) => void;
  canAssignManager: boolean;
  customRoles: CustomRole[];
}) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    roleVal: 'role:front_desk',
    newPassword: '',
    changePassword: false,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (staff) {
      setForm({
        name: staff.name,
        phone: staff.phone ?? '',
        roleVal: encodeRole(staff.role, staff.customRoleId ?? undefined),
        newPassword: '',
        changePassword: false,
      });
      setErrors({});
    }
  }, [staff]);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name?.trim() || form.name.trim().length < 2) e.name = 'Tối thiểu 2 ký tự';
    if (form.changePassword && form.newPassword && !PASSWORD_REGEX.test(form.newPassword))
      e.newPassword = 'Ít nhất 8 ký tự, gồm chữ cái, số và ký tự đặc biệt';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!staff || !validate()) return;
    const { role, customRoleId } = decodeRole(form.roleVal);
    const dto: UpdateStaffDto = {
      name: form.name,
      phone: form.phone || undefined,
      ...(customRoleId
        ? { customRoleId }
        : { role: role as StaffRole, customRoleId: null }),
    };
    if (form.changePassword && form.newPassword) dto.newPassword = form.newPassword;
    try {
      setSubmitting(true);
      const res = await staffService.update(staff.id, dto);
      onUpdated(res.data);
      toast.success('Đã cập nhật thông tin nhân viên');
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Cập nhật thất bại';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!staff} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Chỉnh sửa nhân viên</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Field label="Họ và tên *" error={errors.name}>
            <Input
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: undefined })); }}
              className="text-gray-900"
            />
          </Field>
          <Field label="Vai trò *">
            <RoleSelect
              value={form.roleVal}
              onChange={(v) => setForm((p) => ({ ...p, roleVal: v }))}
              customRoles={customRoles}
              canAssignManager={canAssignManager}
              disabled={staff?.role === 'hotel_owner'}
            />
          </Field>
          <Field label="Số điện thoại">
            <Input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+84901234567 (tùy chọn)"
              className="text-gray-900"
            />
          </Field>
          <div className="border-t border-gray-100 pt-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.changePassword}
                onChange={(e) => setForm((p) => ({ ...p, changePassword: e.target.checked, newPassword: '' }))}
              />
              Đặt lại mật khẩu
            </label>
            {form.changePassword && (
              <Field label="Mật khẩu mới *" error={errors.newPassword} className="mt-3">
                <Input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => { setForm((p) => ({ ...p, newPassword: e.target.value })); setErrors((p) => ({ ...p, newPassword: undefined })); }}
                  placeholder="Ít nhất 8 ký tự, có chữ cái, số, ký tự đặc biệt"
                  className="text-gray-900"
                />
              </Field>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white">
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Field helper ──────────────────────────────────────────────────────────────

function Field({ label, error, children, className = '' }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SettingsUsersPage() {
  const { user } = useAuthStore();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [lockingId, setLockingId] = useState<string | null>(null);

  const canAssignManager = user?.role === 'hotel_owner' || user?.role === 'admin';

  useEffect(() => {
    Promise.all([staffService.list(), permissionService.getCustomRoles()])
      .then(([staffRes, rolesRes]) => {
        setStaff(staffRes.data);
        setCustomRoles(rolesRes.data);
      })
      .catch(() => toast.error('Không thể tải dữ liệu'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (s: StaffMember) => setStaff((p) => [...p, s]);

  const handleUpdated = (s: StaffMember) =>
    setStaff((p) => p.map((u) => (u.id === s.id ? s : u)));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await staffService.remove(deleteTarget.id);
      setStaff((p) => p.filter((u) => u.id !== deleteTarget.id));
      toast.success(`Đã xóa tài khoản ${deleteTarget.name}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xóa thất bại');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggleLock = async (s: StaffMember) => {
    setLockingId(s.id);
    try {
      const res = await staffService.toggleLock(s.id);
      setStaff((p) => p.map((u) => (u.id === s.id ? { ...u, isLocked: res.data.isLocked } : u)));
      toast.success(res.data.isLocked ? `Đã khóa tài khoản ${s.name}` : `Đã mở khóa tài khoản ${s.name}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setLockingId(null);
    }
  };

  const getRoleDisplay = (s: StaffMember) => {
    if (s.customRoleId) {
      const cr = customRoles.find((r) => r.id === s.customRoleId);
      return cr ? { label: cr.name, color: 'bg-violet-100 text-violet-700 border-violet-200' } : null;
    }
    return { label: ROLE_LABELS[s.role] ?? s.role, color: ROLE_COLORS[s.role] ?? 'border-gray-200 text-gray-600' };
  };

  return (
    <>
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-gray-900 text-base">Quản lý nhân viên</CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">
              {staff.length} tài khoản trong khách sạn
            </p>
          </div>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setCreateOpen(true)}
          >
            + Tạo tài khoản
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Đang tải...</div>
          ) : staff.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm">Chưa có nhân viên nào</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => setCreateOpen(true)}
              >
                Tạo tài khoản đầu tiên
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staff.map((s) => {
                    const roleDisplay = getRoleDisplay(s);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">{s.name}</div>
                          {s.phone && <div className="text-xs text-gray-400">{s.phone}</div>}
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600 text-xs">
                          {s.username ?? <span className="text-gray-300 italic">—</span>}
                        </td>
                        <td className="py-3 px-4">
                          {roleDisplay && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${roleDisplay.color}`}
                            >
                              {roleDisplay.label}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {s.isLocked ? (
                            <Badge className="bg-red-100 text-red-600 text-xs">Bị khóa</Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-600 text-xs">Hoạt động</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            {s.role !== 'hotel_owner' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-500 hover:text-blue-700 text-xs h-7 px-2"
                                  onClick={() => setEditTarget(s)}
                                >
                                  Sửa
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`text-xs h-7 px-2 ${s.isLocked ? 'text-emerald-600 hover:text-emerald-700' : 'text-amber-600 hover:text-amber-700'}`}
                                  onClick={() => handleToggleLock(s)}
                                  disabled={lockingId === s.id}
                                >
                                  {lockingId === s.id ? '...' : s.isLocked ? 'Mở khóa' : 'Khóa'}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-red-600 text-xs h-7 px-2"
                                  onClick={() => setDeleteTarget(s)}
                                >
                                  Xóa
                                </Button>
                              </>
                            )}
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

      <CreateStaffDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
        customRoles={customRoles}
        canAssignManager={canAssignManager}
      />

      <EditStaffDialog
        staff={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdated={handleUpdated}
        canAssignManager={canAssignManager}
        customRoles={customRoles}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Xóa tài khoản nhân viên?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Tài khoản của <strong>{deleteTarget?.name}</strong> sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-700">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
