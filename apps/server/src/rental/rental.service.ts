import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Vehicle, VehicleStatus } from './entities/vehicle.entity';
import { VehicleRental, RentalStatus } from './entities/vehicle-rental.entity';
import { CreateVehicleDto, CreateRentalDto } from './dto/rental.dto';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleRental)
    private readonly rentalRepo: Repository<VehicleRental>,
    private readonly dataSource: DataSource,
  ) {}

  // ===== VEHICLES =====
  findAllVehicles(propertyId: string) {
    return this.vehicleRepo.find({
      where: { propertyId },
      order: { plateNumber: 'ASC' },
    });
  }

  async createVehicle(dto: CreateVehicleDto) {
    const vehicle = this.vehicleRepo.create(dto);
    return this.vehicleRepo.save(vehicle);
  }

  // ===== RENTALS =====
  findAllRentals(propertyId: string) {
    return this.rentalRepo.find({
      where: { propertyId },
      relations: ['vehicle', 'booking'],
      order: { createdAt: 'DESC' },
    });
  }

  async createRental(dto: CreateRentalDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    const days = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const totalAmount = days * dto.pricePerDay;

    return this.dataSource.transaction(async (manager) => {
      // 1. Create Rental Record
      const rental = this.rentalRepo.create({
        ...dto,
        startTime: start,
        endTime: end,
        totalAmount,
        status: RentalStatus.ACTIVE,
      });
      const savedRental = await manager.save(rental);

      // 2. Update Vehicle Status if internal
      if (dto.vehicleId) {
        await manager.update(Vehicle, dto.vehicleId, {
          status: VehicleStatus.RENTED,
        });
      }

      return savedRental;
    });
  }

  async recordPickup(id: string) {
    await this.rentalRepo.update(id, { actualPickupTime: new Date() });
    return this.rentalRepo.findOneBy({ id });
  }

  async recordReturn(id: string) {
    const rental = await this.rentalRepo.findOneBy({ id });
    if (!rental) throw new NotFoundException('Rental not found');

    return this.dataSource.transaction(async (manager) => {
      await manager.update(VehicleRental, id, {
        actualReturnTime: new Date(),
        status: RentalStatus.COMPLETED,
      });

      if (rental.vehicleId) {
        await manager.update(Vehicle, rental.vehicleId, {
          status: VehicleStatus.AVAILABLE,
        });
      }
      return this.rentalRepo.findOneBy({ id });
    });
  }
}
