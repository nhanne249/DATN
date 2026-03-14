import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/store/use-auth-store';

export function VehicleModal({ isOpen, onClose, vehicle, onSaved }: any) {
  const { activePropertyId } = useAuthStore();
  const [formData, setFormData] = useState({
    plateNumber: '',
    name: '',
    provider: '',
    type: 'SCOOTER',
    dailyPrice: '',
    status: 'AVAILABLE',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        plateNumber: vehicle.plateNumber || '',
        name: vehicle.name || '',
        provider: vehicle.provider || '',
        type: vehicle.type || 'SCOOTER',
        dailyPrice: vehicle.dailyPrice?.toString() || '',
        status: vehicle.status || 'AVAILABLE',
      });
      return;
    }

    setFormData({
      plateNumber: '',
      name: '',
      provider: '',
      type: 'SCOOTER',
      dailyPrice: '',
      status: 'AVAILABLE',
    });
  }, [vehicle, isOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
      if (!propertyId) {
        alert('Missing propertyId');
        return;
      }

      const payload = {
        ...formData,
        dailyPrice: parseFloat(formData.dailyPrice) || 0,
        propertyId,
      };

      if (vehicle) {
        await axiosInstance.patch(`/rentals/vehicles/${vehicle.id}`, payload);
      } else {
        await axiosInstance.post('/rentals/vehicles', payload);
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to save vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Update Vehicle' : 'Create Vehicle'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-zinc-200">Plate Number</Label>
              <Input
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                placeholder="29A-123.45"
                required
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-zinc-200">Provider</Label>
              <Input
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="Internal / Partner"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-zinc-200">Vehicle Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Honda Vision 2023"
              required
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-zinc-200">Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="SCOOTER">Scooter</SelectItem>
                  <SelectItem value="MANUAL">Manual</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-zinc-200">Daily Price</Label>
              <Input
                type="number"
                value={formData.dailyPrice}
                onChange={(e) => setFormData({ ...formData, dailyPrice: e.target.value })}
                placeholder="150000"
                required
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-zinc-200">Status</Label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="RENTED">Rented</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-zinc-800 text-white hover:bg-zinc-800">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : vehicle ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
